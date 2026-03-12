import { useState, useEffect, useCallback } from 'react';
import {
  getPersona,
  updatePersona,
  type Persona,
} from '../api/client';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';

const emptyForm = {
  name: '',
  system_prompt: '',
  greeting_message: '',
  fallback_message: '',
};

export function PersonaSettingsScreen() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadOrgId, setLoadOrgId] = useState('');
  const [loadPersonaId, setLoadPersonaId] = useState('');
  const [form, setForm] = useState(emptyForm);

  const fetchPersona = useCallback(async (orgId?: string, personaId?: string) => {
    if (!orgId && !personaId) {
      setError('Enter Organization ID or Persona ID to load.');
      setPersona(null);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await getPersona(orgId ? { org_id: orgId } : { persona_id: personaId! });
    setLoading(false);
    if ('error' in result) {
      setError(result.status === 404 ? 'Persona not found.' : result.error);
      setPersona(null);
      return;
    }
    setPersona(result.data);
    setForm({
      name: result.data.name,
      system_prompt: result.data.system_prompt,
      greeting_message: result.data.greeting_message ?? '',
      fallback_message: result.data.fallback_message ?? '',
    });
  }, []);

  const handleLoadByOrg = () => fetchPersona(loadOrgId.trim() || undefined);
  const handleLoadById = () => fetchPersona(undefined, loadPersonaId.trim() || undefined);

  const handleSave = async () => {
    if (!persona) return;
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

      <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
        <h2 className="text-lg font-semibold mb-4 text-(--color-text-primary)">
          Load persona
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
              Organization ID
            </label>
            <input
              type="text"
              placeholder="UUID"
              value={loadOrgId}
              onChange={(e) => setLoadOrgId(e.target.value)}
              className="w-64 px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleLoadByOrg}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-(--color-primary) text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load by org'}
          </button>
          <div className="text-(--color-text-muted)">or</div>
          <div>
            <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">
              Persona ID
            </label>
            <input
              type="text"
              placeholder="UUID"
              value={loadPersonaId}
              onChange={(e) => setLoadPersonaId(e.target.value)}
              className="w-64 px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleLoadById}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) hover:bg-(--color-bg-glass) disabled:opacity-50"
          >
            Load by ID
          </button>
        </div>
        {error && !persona && (
          <ErrorMessage message={error} onRetry={() => fetchPersona(loadOrgId || undefined, loadPersonaId || undefined)} className="mt-4" />
        )}
      </section>

      {loading && !persona && (
        <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border) space-y-4">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-24 w-full" />
          <LoadingSkeleton className="h-24 w-full" />
        </section>
      )}

      {persona && (
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
