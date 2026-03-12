import { API_BASE_URL } from './config.js';

export interface AdminStats {
  total_conversations: number;
  active_conversations: number;
  total_leads: number;
  recent_activity: Array<{
    session_id: string;
    updated_at: string;
    message_count: number;
  }>;
}

export interface ApiError {
  error: string;
  message?: string;
}

/**
 * Get auth token for API requests. Set by AuthContext from Supabase session (syncs to api_token on login).
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('api_token') ?? sessionStorage.getItem('api_token');
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string> } = {}
): Promise<{ data: T } | { error: string; status: number }> {
  const { params, ...init } = options;
  const url = new URL(path.startsWith('http') ? path : `${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(url.toString(), { ...init, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (body as ApiError).error ?? (body as ApiError).message ?? res.statusText;
    return { error: message, status: res.status };
  }
  return { data: body as T };
}

/** GET /api/admin/stats - dashboard statistics (requires auth). */
export async function getAdminStats(orgId?: string): Promise<
  | { data: AdminStats }
  | { error: string; status: number }
> {
  const result = await request<AdminStats>('/api/admin/stats', {
    params: orgId ? { org_id: orgId } : undefined,
  });
  return result;
}

// --- Leads ---

export interface Lead {
  lead_id: string;
  consumer_id: string;
  session_id: string | null;
  org_id: string;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  notes: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  captured_at: string;
  updated_at: string;
}

export async function getLeads(orgId?: string): Promise<
  | { data: { leads: Lead[] } }
  | { error: string; status: number }
> {
  const result = await request<{ leads: Lead[] }>('/api/leads', {
    params: orgId ? { org_id: orgId } : undefined,
  });
  return result;
}

export async function getLeadById(leadId: string): Promise<
  | { data: Lead }
  | { error: string; status: number }
> {
  return request<Lead>(`/api/leads/${leadId}`);
}

export async function updateLead(
  leadId: string,
  body: { name?: string | null; email?: string | null; phone_number?: string | null; notes?: string | null; status?: Lead['status'] }
): Promise<{ data: Lead } | { error: string; status: number }> {
  return request<Lead>(`/api/leads/${leadId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// --- Persona ---

export interface Persona {
  persona_id: string;
  org_id: string;
  name: string;
  system_prompt: string;
  greeting_message: string | null;
  fallback_message: string | null;
  ai_provider: string;
  model_name: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPersona(params: { org_id?: string; persona_id?: string }): Promise<
  | { data: Persona }
  | { error: string; status: number }
> {
  if (!params.org_id && !params.persona_id) {
    return { error: 'org_id or persona_id required', status: 400 };
  }
  const searchParams = new URLSearchParams();
  if (params.org_id) searchParams.set('org_id', params.org_id);
  if (params.persona_id) searchParams.set('persona_id', params.persona_id);
  return request<Persona>(`/api/persona?${searchParams.toString()}`);
}

export async function updatePersona(
  personaId: string,
  body: Partial<Pick<Persona, 'name' | 'system_prompt' | 'greeting_message' | 'fallback_message' | 'ai_provider' | 'model_name' | 'temperature' | 'max_tokens' | 'is_active'>>
): Promise<{ data: Persona } | { error: string; status: number }> {
  return request<Persona>(`/api/persona/${personaId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}
