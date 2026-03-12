import { createClient } from '@supabase/supabase-js';

const env =
  typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string | undefined> }).env
    ? (import.meta as { env: Record<string, string | undefined> }).env
    : (process.env as Record<string, string | undefined>);

// Support both Vite-style (VITE_*) and plain SUPABASE_* env vars
const url = env.SUPABASE_URL ?? '';
const anonKey =  env.SUPABASE_ANON_KEY ?? '';

if (!url || !anonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(url, anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const isSupabaseConfigured = Boolean(url && anonKey);
