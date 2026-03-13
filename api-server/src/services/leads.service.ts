import { randomUUID } from 'node:crypto';
import { supabase } from '../config/supabase.js';
import type { LeadStatus } from '../types/database.js';

export interface LeadRow {
  lead_id: string;
  consumer_id: string;
  session_id: string | null;
  org_id: string;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  notes: string | null;
  status: LeadStatus;
  captured_at: string;
  updated_at: string;
}

export interface CaptureLeadInput {
  consumer_id: string;
  org_id: string;
  session_id?: string | null;
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  notes?: string | null;
}

export interface UpdateLeadInput {
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  notes?: string | null;
  status?: LeadStatus;
}

/** Get all leads, optionally filtered by org_id. */
export async function getAllLeads(orgId?: string): Promise<LeadRow[]> {
  let query = supabase.from('qualified_lead').select('*').order('captured_at', { ascending: false });
  if (orgId) query = query.eq('org_id', orgId);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch leads: ${error.message}`);
  return (data ?? []) as LeadRow[];
}

/** Get a single lead by id. */
export async function getLeadById(leadId: string): Promise<LeadRow | null> {
  const { data, error } = await supabase
    .from('qualified_lead')
    .select('*')
    .eq('lead_id', leadId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch lead: ${error.message}`);
  }
  return data as LeadRow;
}

/** Capture a lead (create). Optionally pass session_id to link and mark session as lead_captured. */
export async function captureLead(input: CaptureLeadInput): Promise<LeadRow> {
  const leadId = randomUUID();
  const now = new Date().toISOString();

  const { error: insertError } = await supabase.from('qualified_lead').insert({
    lead_id: leadId,
    consumer_id: input.consumer_id,
    session_id: input.session_id ?? null,
    org_id: input.org_id,
    name: input.name ?? null,
    email: input.email ?? null,
    phone_number: input.phone_number ?? null,
    notes: input.notes ?? null,
    status: 'new',
    captured_at: now,
    updated_at: now,
  });

  if (insertError) throw new Error(`Failed to capture lead: ${insertError.message}`);

  if (input.session_id) {
    await supabase
      .from('chat_session')
      .update({ lead_captured: true, updated_at: now })
      .eq('session_id', input.session_id);
  }

  const lead = await getLeadById(leadId);
  if (!lead) throw new Error('Failed to fetch created lead');
  return lead;
}

/** Update lead information. */
export async function updateLead(leadId: string, input: UpdateLeadInput): Promise<LeadRow | null> {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('qualified_lead')
    .update({
      ...input,
      updated_at: now,
    })
    .eq('lead_id', leadId);

  if (error) throw new Error(`Failed to update lead: ${error.message}`);
  return getLeadById(leadId);
}

/** Extract lead data from a conversation: get consumer + session and return fields for capture. */
export async function extractLeadFromSession(sessionId: string): Promise<CaptureLeadInput | null> {
  const { data: session, error: sessionError } = await supabase
    .from('chat_session')
    .select('consumer_id, org_id')
    .eq('session_id', sessionId)
    .single();

  if (sessionError || !session) return null;

  const row = session as { consumer_id: string; org_id: string };
  const { data: consumer, error: consumerError } = await supabase
    .from('consumer')
    .select('name, email, phone_number')
    .eq('consumer_id', row.consumer_id)
    .single();

  if (consumerError || !consumer) return null;

  const c = consumer as { name: string | null; email: string | null; phone_number: string | null };
  return {
    consumer_id: row.consumer_id,
    org_id: row.org_id,
    session_id: sessionId,
    name: c.name ?? null,
    email: c.email ?? null,
    phone_number: c.phone_number ?? null,
    notes: null,
  };
}
