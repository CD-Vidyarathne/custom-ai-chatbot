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
 * Get auth token for API requests. Override when auth is implemented (e.g. Supabase session).
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
