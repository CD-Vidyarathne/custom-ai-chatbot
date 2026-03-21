import { supabase } from '../config/supabase.js';
import type { ChatStatus } from '../types/database.js';

export interface ConversationRow {
  session_id: string;
  consumer_id: string;
  persona_id: string;
  org_id: string;
  status: ChatStatus;
  lead_captured: boolean;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  last_message?: string | null;
  last_activity_at?: string;
}

export interface AdminConversationFilters {
  org_id?: string;
  status?: ChatStatus;
  consumer_id?: string;
  limit?: number;
  offset?: number;
}

export interface AdminStats {
  total_conversations: number;
  active_conversations: number;
  total_leads: number;
  recent_activity: {
    session_id: string;
    consumer_name: string;
    updated_at: string;
    message_count: number;
  }[];
}

export interface AdminMonitoring {
  total_messages: number;
  messages_last_24h: number;
  active_sessions_count: number;
  recent_sessions: { session_id: string; started_at: string; message_count: number }[];
}

/** Get all conversations with optional filters. */
export async function getConversationsWithFilters(
  filters: AdminConversationFilters
): Promise<ConversationRow[]> {
  let query = supabase
    .from('chat_session')
    .select('*')
    .order('updated_at', { ascending: false });

  if (filters.org_id) query = query.eq('org_id', filters.org_id);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.consumer_id) query = query.eq('consumer_id', filters.consumer_id);

  const limit = Math.min(filters.limit ?? 50, 100);
  const offset = filters.offset ?? 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch conversations: ${error.message}`);
  
  const rows = (data ?? []) as ConversationRow[];
  const enhancedRows = await Promise.all(
    rows.map(async (row) => {
      const { data: lastMessage } = await supabase
        .from('message')
        .select('content, created_at')
        .eq('session_id', row.session_id)
        .order('sequence_no', { ascending: false })
        .limit(1)
        .single();
      
      return {
        ...row,
        last_message: lastMessage?.content ?? null,
        last_activity_at: lastMessage?.created_at ?? row.updated_at,
      };
    })
  );

  return enhancedRows;
}

/** Get dashboard statistics. */
export async function getAdminStats(orgId?: string): Promise<AdminStats> {
  let sessionsQuery = supabase
    .from('chat_session')
    .select('session_id, status, updated_at, consumer:consumer_id(name)');
  if (orgId) sessionsQuery = sessionsQuery.eq('org_id', orgId);
  const { data: sessions, error: sessionsError } = await sessionsQuery;
  if (sessionsError) throw new Error(`Failed to fetch stats: ${sessionsError.message}`);

  const rows = (sessions ?? []) as {
    session_id: string;
    status: string;
    updated_at: string;
    consumer: { name: string | null } | { name: string | null }[] | null;
  }[];
  const total_conversations = rows.length;
  const active_conversations = rows.filter((r) => r.status === 'active').length;

  let leadsQuery = supabase.from('qualified_lead').select('lead_id', { count: 'exact', head: true });
  if (orgId) leadsQuery = leadsQuery.eq('org_id', orgId);
  const { count: total_leads, error: leadsError } = await leadsQuery;
  if (leadsError) throw new Error(`Failed to fetch leads count: ${leadsError.message}`);

  const recent = rows.slice(0, 10);
  const messageCounts = await Promise.all(
    recent.map(async (r) => {
      const { count } = await supabase
        .from('message')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', r.session_id);
      const consumerRow = Array.isArray(r.consumer) ? r.consumer[0] : r.consumer;
      return {
        session_id: r.session_id,
        consumer_name: consumerRow?.name ?? 'Unknown consumer',
        updated_at: r.updated_at,
        message_count: count ?? 0,
      };
    })
  );

  return {
    total_conversations,
    active_conversations,
    total_leads: total_leads ?? 0,
    recent_activity: messageCounts,
  };
}

/** Get monitoring data (message counts, activity). */
export async function getAdminMonitoring(orgId?: string): Promise<AdminMonitoring> {
  let sessionsQuery = supabase
    .from('chat_session')
    .select('session_id, started_at, status')
    .order('started_at', { ascending: false })
    .limit(100);
  if (orgId) sessionsQuery = sessionsQuery.eq('org_id', orgId);
  const { data: sessions, error: sessionsError } = await sessionsQuery;
  if (sessionsError) throw new Error(`Failed to fetch monitoring: ${sessionsError.message}`);

  const rows = (sessions ?? []) as { session_id: string; started_at: string; status: string }[];
  const active_sessions_count = rows.filter((r) => r.status === 'active').length;

  const { count: total_messages, error: totalError } = await supabase
    .from('message')
    .select('*', { count: 'exact', head: true });
  if (totalError) throw new Error(`Failed to fetch message count: ${totalError.message}`);

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let last24Query = supabase
    .from('message')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneDayAgo);
  const { count: messages_last_24h, error: last24Error } = await last24Query;
  if (last24Error) throw new Error(`Failed to fetch 24h count: ${last24Error.message}`);

  const recent_sessions = rows.slice(0, 20).map((r) => ({
    session_id: r.session_id,
    started_at: r.started_at,
    message_count: 0,
  }));

  const counts = await Promise.all(
    recent_sessions.map(async (s) => {
      const { count } = await supabase
        .from('message')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', s.session_id);
      return count ?? 0;
    })
  );
  recent_sessions.forEach((s, i) => {
    s.message_count = counts[i];
  });

  return {
    total_messages: total_messages ?? 0,
    messages_last_24h: messages_last_24h ?? 0,
    active_sessions_count,
    recent_sessions,
  };
}
