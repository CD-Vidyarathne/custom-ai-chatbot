import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const OrganizationSetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, isConfigured, loading } = useAuth();
  const [orgName, setOrgName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user already has an organization, skip this screen.
  useEffect(() => {
    if (!user || !isConfigured) return;

    const checkOrg = async () => {
      const { data, error } = await supabase
        .from('organization')
        .select('org_id')
        .eq('owner_user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        navigate('/dashboard', { replace: true });
      }
    };

    void checkOrg();
  }, [user, isConfigured, navigate]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-bg-primary)">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-(--color-border) max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-(--color-text-primary) mb-2">Supabase not configured</h1>
          <p className="text-sm text-(--color-text-muted)">
            Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.
          </p>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-bg-primary)">
        <div className="text-(--color-text-muted)">Loading…</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = orgName.trim();
    if (!trimmed) {
      setError('Organization name is required.');
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from('organization')
      .insert({
        owner_user_id: user.id,
        org_name: trimmed,
        email: user.email ?? '',
        is_active: true,
      })
      .select('org_id')
      .maybeSingle();
    setSubmitting(false);

    if (error || !data) {
      setError(error?.message ?? 'Failed to create organization. Please try again.');
      return;
    }

    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-bg-primary)">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-(--color-border) max-w-md w-full">
        <h1 className="text-2xl font-bold text-(--color-text-primary) mb-1">Create your organization</h1>
        <p className="text-sm text-(--color-text-muted) mb-6">
          Set up an organization to manage your chatbot, leads, and conversations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-(--color-danger) bg-red-50/50 px-4 py-2 text-sm text-(--color-danger)">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="org-name" className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
              Organization name
            </label>
            <input
              id="org-name"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) focus:outline-none focus:border-(--color-border-focus) bg-white"
              placeholder="Acme Inc."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-(--color-primary) text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Creating organization…' : 'Create organization'}
          </button>
        </form>
      </div>
    </div>
  );
};

