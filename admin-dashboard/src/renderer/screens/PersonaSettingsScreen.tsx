import { useState, useCallback, useEffect } from 'react';
import {
  getPersona,
  updatePersona,
  type Persona,
} from '../api/client';
import { supabase } from '../lib/supabase';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';

const emptyForm = {
  name: '',
  system_prompt: '',
  greeting_message: '',
  fallback_message: '',
};

export function PersonaSettingsScreen() {
  const { user, loading: authLoading, isConfigured } = useAuth();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPersona = useCallback(async (orgIdParam: string) => {
    setLoading(true);
    setError(null);
    const result = await getPersona({ org_id: orgIdParam });
    setLoading(false);
    if ('error' in result) {
      if (result.status === 404) {
        setError('Persona not found. Create one for your organization.');
        setPersona(null);
        setIsNew(true);
        setForm(emptyForm);
        return;
      }
      setError(result.error);
      setPersona(null);
      setIsNew(false);
      return;
    }
    setPersona(result.data);
    setIsNew(false);
    setForm({
      name: result.data.name,
      system_prompt: result.data.system_prompt,
      greeting_message: result.data.greeting_message ?? '',
      fallback_message: result.data.fallback_message ?? '',
    });
  }, []);

  // Resolve the current user's organization and load its persona (one org → one persona).
  useEffect(() => {
    if (!isConfigured || authLoading) return;
    if (!user) {
      setError('You must be signed in to manage persona settings.');
      return;
    }

    const loadForUser = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('organization')
        .select('org_id')
        .eq('owner_user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();
      if (error || !data) {
        setLoading(false);
        setError('Organization not found for this user.');
        setOrgId(null);
        setPersona(null);
        setIsNew(false);
        return;
      }

      setOrgId(data.org_id);
      await fetchPersona(data.org_id);
    };

    void loadForUser();
  }, [user, authLoading, isConfigured, fetchPersona]);

  const handleSave = async () => {
    const name = form.name.trim();
    const system_prompt = form.system_prompt.trim();
    if (!name) {
      setSaveError('Persona name cannot be empty.');
      return;
    }
    if (!system_prompt) {
      setSaveError('System prompt cannot be empty.');
      return;
    }
    setSaving(true);
    setSaveError(null);

    try {
      if (isNew) {
        if (!orgId) {
          setSaveError('Organization is not available for this user.');
          setSaving(false);
          return;
        }

        const { data, error } = await supabase
          .from('persona')
          .insert({
            org_id: orgId,
            name,
            system_prompt,
            greeting_message: form.greeting_message.trim() || null,
            fallback_message: form.fallback_message.trim() || null,
            ai_provider: 'openai',
            model_name: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 1024,
            is_active: true,
          })
          .select('*')
          .maybeSingle();

        setSaving(false);

        if (error || !data) {
          setSaveError(error?.message ?? 'Failed to create persona.');
          return;
        }

        setPersona(data as Persona);
        setIsNew(false);
      } else {
        if (!persona) {
          setSaving(false);
          return;
        }

        const result = await updatePersona(persona.persona_id, {
          name,
          system_prompt,
          greeting_message: form.greeting_message.trim() || null,
          fallback_message: form.fallback_message.trim() || null,
        });
        setSaving(false);
        if ('error' in result) {
          setSaveError(result.error);
          return;
        }
        setPersona(result.data);
      }
    } catch (e) {
      setSaving(false);
      setSaveError(e instanceof Error ? e.message : 'Failed to save persona.');
    }
  };

  return (
    <div className="min-h-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-(--color-text-primary)">
          Persona Settings
        </h1>
        <p className="text-sm mt-1 text-(--color-text-muted)">
          Configure your chatbot&apos;s personality and behavior
        </p>
      </div>

      {error && !persona && !isNew && (
        <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
          <ErrorMessage message={error} className="mt-0" />
        </section>
      )}

      {loading && !persona && (
        <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border) space-y-4">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-24 w-full" />
          <LoadingSkeleton className="h-24 w-full" />
        </section>
      )}

      {(persona || isNew) && (
        <>
          <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
            <h2 className="text-lg font-semibold mb-4 text-(--color-text-primary)">
              Persona name
            </h2>
            <input
              type="text"
              placeholder="e.g. Ava"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
            />
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
            <h2 className="text-lg font-semibold mb-4 text-(--color-text-primary)">
              System prompt
            </h2>
            <textarea
              rows={6}
              placeholder="Instructions that define the assistant's behavior and context..."
              value={form.system_prompt}
              onChange={(e) => setForm((f) => ({ ...f, system_prompt: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
            />
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
            <h2 className="text-lg font-semibold mb-4 text-(--color-text-primary)">
              Greeting & instructions
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                  Greeting message
                </label>
                <textarea
                  rows={2}
                  placeholder="Hi! How can I help you today?"
                  value={form.greeting_message}
                  onChange={(e) => setForm((f) => ({ ...f, greeting_message: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
                  Fallback / instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional instructions, fallback when unsure..."
                  value={form.fallback_message}
                  onChange={(e) => setForm((f) => ({ ...f, fallback_message: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
            <h2 className="text-lg font-semibold mb-4 text-(--color-text-primary)">
              Preview
            </h2>
            <div className="rounded-lg border border-(--color-border) bg-(--color-bg-primary) p-4 space-y-2">
              <p className="text-sm font-medium text-(--color-text-muted)">Name</p>
              <p className="text-(--color-text-primary)">{form.name || '—'}</p>
              <p className="text-sm font-medium text-(--color-text-muted) mt-2">Greeting</p>
              <p className="text-(--color-text-primary)">{form.greeting_message || '—'}</p>
              <p className="text-sm font-medium text-(--color-text-muted) mt-2">System prompt (excerpt)</p>
              <p className="text-(--color-text-primary) text-sm line-clamp-3">
                {form.system_prompt ? `${form.system_prompt.slice(0, 200)}${form.system_prompt.length > 200 ? '…' : ''}` : '—'}
              </p>
            </div>
          </section>

          {saveError && (
            <ErrorMessage message={saveError} className="mb-4" />
          )}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-(--color-primary) text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
