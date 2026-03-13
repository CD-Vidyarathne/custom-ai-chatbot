import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function LoginScreen() {
  const navigate = useNavigate();
  const { signIn, error, clearError, loading, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    const { error: err, user } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err || !user) return;

    // After successful login, check if the user already has an organization.
    const { data, error } = await supabase
      .from('organization')
      .select('org_id')
      .eq('owner_user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('org_id', data.org_id);
      }
      navigate('/dashboard', { replace: true });
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('org_id');
    }
    navigate('/organization', { replace: true });
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-bg-primary)">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-(--color-border) max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-(--color-text-primary) mb-2">Supabase not configured</h1>
          <p className="text-sm text-(--color-text-muted)">
            Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-bg-primary)">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-(--color-border) max-w-md w-full">
        <h1 className="text-2xl font-bold text-(--color-text-primary) mb-1">Sign in</h1>
        <p className="text-sm text-(--color-text-muted) mb-6">Use your email and password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-(--color-danger) bg-red-50/50 px-4 py-2 text-sm text-(--color-danger)">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) focus:outline-none focus:border-(--color-border-focus) bg-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) focus:outline-none focus:border-(--color-border-focus) bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-2.5 rounded-lg bg-(--color-primary) text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--color-text-muted)">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-(--color-primary) hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
