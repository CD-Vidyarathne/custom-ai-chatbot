import { createClient } from '@supabase/supabase-js';

// In the renderer, env values must be prefixed with VITE_ to be exposed.
// Expect VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to be defined in .env.
const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

const url = env.VITE_SUPABASE_URL ?? '';
const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

export const isSupabaseConfigured = Boolean(url && publishableKey);

export const supabase = createClient(url || 'http://localhost', publishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
