import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const API_TOKEN_KEY = 'api_token';

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
};

type AuthActions = {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<(AuthState & AuthActions) | null>(null);

function syncToken(session: Session | null) {
  if (typeof window === 'undefined') return;
  if (session?.access_token) {
    localStorage.setItem(API_TOKEN_KEY, session.access_token);
  } else {
    localStorage.removeItem(API_TOKEN_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      syncToken(s);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      syncToken(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const { error: e } = await supabase.auth.signInWithPassword({ email, password });
    if (e) {
      setError(e.message);
      return { error: e.message };
    }
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);
    const { error: e } = await supabase.auth.signUp({ email, password });
    if (e) {
      setError(e.message);
      return { error: e.message };
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') localStorage.removeItem(API_TOKEN_KEY);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: AuthState & AuthActions = {
    user,
    session,
    loading,
    error,
    isConfigured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx == null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
