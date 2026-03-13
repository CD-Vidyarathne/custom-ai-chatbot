import { randomUUID } from 'node:crypto';
import { supabase } from '../config/supabase.js';
import { getPersonaById } from './persona.service.js';
import type { ChatStatus } from '../types/database.js';

export interface CreateConversationInput {
  persona_id: string;
  org_id: string;
  consumer?: {
    name?: string | null;
    email?: string | null;
    phone_number?: string | null;
    fingerprint?: string | null;
  };
}

export interface ConversationWithConsumer {
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
}

export interface MessageRow {
  msg_id: string;
  session_id: string;
  sequence_no: number;
  msg_source: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used: number | null;
  is_deleted: boolean;
  created_at: string;
}

/** Create a new consumer and chat session (conversation). */
export async function createConversation(
  input: CreateConversationInput
): Promise<{ session_id: string; consumer_id: string }> {
  const consumerId = randomUUID();
  const sessionId = randomUUID();
  const now = new Date().toISOString();

  const { error: consumerError } = await supabase.from('consumer').insert({
    consumer_id: consumerId,
    persona_id: input.persona_id,
    org_id: input.org_id,
    name: input.consumer?.name ?? null,
    email: input.consumer?.email ?? null,
    phone_number: input.consumer?.phone_number ?? null,
    fingerprint: input.consumer?.fingerprint ?? null,
  });

  if (consumerError) {
    throw new Error(`Failed to create consumer: ${consumerError.message}`);
  }

  const { error: sessionError } = await supabase.from('chat_session').insert({
    session_id: sessionId,
    consumer_id: consumerId,
    persona_id: input.persona_id,
    org_id: input.org_id,
    status: 'active',
    lead_captured: false,
    started_at: now,
    ended_at: null,
  });

  if (sessionError) {
    throw new Error(`Failed to create session: ${sessionError.message}`);
  }

  // Optionally send a greeting / welcome message as the first system message
  try {
    const persona = await getPersonaById(input.persona_id);
    const greeting =
      persona?.greeting_message ??
      (persona?.name
        ? `Hi, I'm ${persona.name}. How can I help you today?`
        : null);

    if (greeting) {
      // First message in a new session uses sequence_no = 0
      await insertMessage(sessionId, 'system', greeting, 0);
    }
  } catch (err) {
    // Do not fail session creation if greeting insertion fails; log and continue.
    // eslint-disable-next-line no-console
    console.error('Failed to insert greeting message for conversation:', err);
  }

  return { session_id: sessionId, consumer_id: consumerId };
}

/** List conversations (sessions) for a consumer. */
export async function getConversationsByConsumer(
  consumerId: string
): Promise<ConversationWithConsumer[]> {
  const { data, error } = await supabase
    .from('chat_session')
    .select('*')
    .eq('consumer_id', consumerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch conversations: ${error.message}`);
  return (data ?? []) as ConversationWithConsumer[];
}

/** Get a single conversation by session_id. */
export async function getConversationById(
  sessionId: string
): Promise<ConversationWithConsumer | null> {
  const { data, error } = await supabase
    .from('chat_session')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch conversation: ${error.message}`);
  }
  return data as ConversationWithConsumer;
}

/** Get messages for a conversation, ordered by sequence_no. */
export async function getMessagesBySessionId(
  sessionId: string
): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from('message')
    .select('*')
    .eq('session_id', sessionId)
    .eq('is_deleted', false)
    .order('sequence_no', { ascending: true });

  if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
  return (data ?? []) as MessageRow[];
}

/** Close a conversation (set status to closed, ended_at to now). */
export async function closeConversation(sessionId: string): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('chat_session')
    .update({ status: 'closed', ended_at: now, updated_at: now })
    .eq('session_id', sessionId);

  if (error) throw new Error(`Failed to close conversation: ${error.message}`);
}

const INACTIVITY_CLOSE_MINUTES = 5;

/** Get last activity timestamp for a session (last message created_at, or session started_at). */
export async function getLastActivityAt(sessionId: string): Promise<Date> {
  const { data: lastMsg } = await supabase
    .from('message')
    .select('created_at')
    .eq('session_id', sessionId)
    .order('sequence_no', { ascending: false })
    .limit(1)
    .single();

  if (lastMsg?.created_at) return new Date(lastMsg.created_at as string);

  const { data: session } = await supabase
    .from('chat_session')
    .select('started_at')
    .eq('session_id', sessionId)
    .single();

  return new Date((session as { started_at: string } | null)?.started_at ?? 0);
}

/** Close active sessions that have had no activity for more than the given minutes. */
export async function closeInactiveSessions(
  inactivityMinutes: number = INACTIVITY_CLOSE_MINUTES
): Promise<number> {
  const { data: activeSessions } = await supabase
    .from('chat_session')
    .select('session_id')
    .eq('status', 'active');

  if (!activeSessions?.length) return 0;

  const now = Date.now();
  const thresholdMs = inactivityMinutes * 60 * 1000;
  let closed = 0;

  for (const row of activeSessions as { session_id: string }[]) {
    const lastAt = await getLastActivityAt(row.session_id);
    if (now - lastAt.getTime() >= thresholdMs) {
      await closeConversation(row.session_id);
      closed += 1;
    }
  }
  return closed;
}

/** Get next sequence number for a session. */
export async function getNextSequenceNo(sessionId: string): Promise<number> {
  const { data, error } = await supabase
    .from('message')
    .select('sequence_no')
    .eq('session_id', sessionId)
    .order('sequence_no', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get next sequence: ${error.message}`);
  }
  const last = (data as { sequence_no: number } | null)?.sequence_no ?? -1;
  return last + 1;
}

/** Insert a single message. */
export async function insertMessage(
  sessionId: string,
  source: 'user' | 'assistant' | 'system',
  content: string,
  sequenceNo: number
): Promise<string> {
  const msgId = randomUUID();
  const { error } = await supabase.from('message').insert({
    msg_id: msgId,
    session_id: sessionId,
    sequence_no: sequenceNo,
    msg_source: source,
    content,
    tokens_used: null,
    is_deleted: false,
  });

  if (error) throw new Error(`Failed to insert message: ${error.message}`);
  return msgId;
}

/** Save user message and AI reply for a session (reply stored as source 'system' per database types). */
export async function saveUserAndSystemMessages(
  sessionId: string,
  userContent: string,
  systemReplyContent: string
): Promise<void> {
  const userSeq = await getNextSequenceNo(sessionId);
  const systemSeq = userSeq + 1;
  await insertMessage(sessionId, 'user', userContent, userSeq);
  await insertMessage(sessionId, 'system', systemReplyContent, systemSeq);
}
