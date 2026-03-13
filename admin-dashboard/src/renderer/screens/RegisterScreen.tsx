import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RegisterScreen() {
  const { signUp, error, clearError, loading, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (password !== confirmPassword) {
      clearError();
      return;
    }
    setSubmitting(true);
    const { error: err } = await signUp(email.trim(), password);
    setSubmitting(false);
    if (err) return;
    setSuccess(true);
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-bg-primary)">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-(--color-border) max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-(--color-text-primary) mb-2">Check your email</h1>
          <p className="text-sm text-(--color-text-muted) mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
          </p>
          <Link
            to="/login"
            className="inline-block py-2.5 px-4 rounded-lg bg-(--color-primary) text-white font-medium hover:opacity-90"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  const passwordMismatch = Boolean(
    password &&
      confirmPassword &&
      password !== confirmPassword
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-bg-primary)">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-(--color-border) max-w-md w-full">
        <h1 className="text-2xl font-bold text-(--color-text-primary) mb-1">Create account</h1>
        <p className="text-sm text-(--color-text-muted) mb-6">Register with your email</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-(--color-danger) bg-red-50/50 px-4 py-2 text-sm text-(--color-danger)">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
              Email
            </label>
            <input
              id="register-email"
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
            <label htmlFor="register-password" className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) focus:outline-none focus:border-(--color-border-focus) bg-white"
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label htmlFor="register-confirm" className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
              Confirm password
            </label>
            <input
              id="register-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border text-(--color-text-primary) focus:outline-none bg-white ${
                passwordMismatch ? 'border-(--color-danger)' : 'border-(--color-border) focus:border-(--color-border-focus)'
              }`}
            />
            {passwordMismatch && (
              <p className="mt-1 text-sm text-(--color-danger)">Passwords do not match</p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting || loading || passwordMismatch}
            className="w-full py-2.5 rounded-lg bg-(--color-primary) text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--color-text-muted)">
          Already have an account?{' '}
          <Link to="/login" className="text-(--color-primary) hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
