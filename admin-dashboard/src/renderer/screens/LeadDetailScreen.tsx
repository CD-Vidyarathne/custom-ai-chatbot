import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getLeadById, updateLead, type Lead } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';

export function LeadDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone_number: '', notes: '', status: 'new' as Lead['status'] });

  const fetchLead = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const result = await getLeadById(id);
    setLoading(false);
    if ('error' in result) {
      setError(result.status === 404 ? 'Lead not found.' : result.error);
      setLead(null);
      return;
    }
    setLead(result.data);
    setForm({
      name: result.data.name ?? '',
      email: result.data.email ?? '',
      phone_number: result.data.phone_number ?? '',
      notes: result.data.notes ?? '',
      status: result.data.status,
    });
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setEditError(null);
    const result = await updateLead(id, {
      name: form.name || null,
      email: form.email || null,
      phone_number: form.phone_number || null,
      notes: form.notes || null,
      status: form.status,
    });
    setSaving(false);
    if ('error' in result) {
      setEditError(result.error);
      return;
    }
    setLead(result.data);
  };

  if (!id) {
    return (
      <div className="min-h-full space-y-6">
        <ErrorMessage message="Missing lead ID" onRetry={() => navigate('/contacts')} />
      </div>
    );
  }

  if (loading && !lead) {
    return (
      <div className="min-h-full space-y-6">
        <button
          type="button"
          onClick={() => navigate('/contacts')}
          className="flex items-center gap-2 text-(--color-primary) hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to leads
        </button>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border) animate-pulse space-y-4">
          <div className="h-6 w-48 bg-(--color-bg-secondary) rounded" />
          <div className="h-4 w-full bg-(--color-bg-secondary) rounded" />
          <div className="h-4 w-full bg-(--color-bg-secondary) rounded" />
        </div>
      </div>
    );
  }

  if (error && !lead) {
    return (
      <div className="min-h-full space-y-6">
        <button
          type="button"
          onClick={() => navigate('/contacts')}
          className="flex items-center gap-2 text-(--color-primary) hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to leads
        </button>
        <ErrorMessage message={error} onRetry={fetchLead} />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="min-h-full space-y-6">
      <button
        type="button"
        onClick={() => navigate('/contacts')}
        className="flex items-center gap-2 text-(--color-primary) hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to leads
      </button>

      <div>
        <h1 className="text-3xl font-bold text-(--color-text-primary)">Lead details</h1>
        <p className="text-sm mt-1 text-(--color-text-muted)">View and edit lead information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
          <h2 className="text-lg font-semibold mb-4 text-(--color-text-primary)">Lead information</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-(--color-text-muted)">Lead ID</dt>
              <dd className="font-mono text-(--color-text-primary)">{lead.lead_id}</dd>
            </div>
            <div>
              <dt className="text-(--color-text-muted)">Consumer ID</dt>
              <dd className="font-mono text-(--color-text-primary)">{lead.consumer_id}</dd>
            </div>
            <div>
              <dt className="text-(--color-text-muted)">Captured</dt>
              <dd className="text-(--color-text-primary)">
                {lead.captured_at ? new Date(lead.captured_at).toLocaleString() : '—'}
              </dd>
            </div>
            {lead.session_id && (
              <div>
                <dt className="text-(--color-text-muted)">Associated conversation</dt>
                <dd>
                  <button
                    type="button"
                    onClick={() => navigate(`/conversations?session=${lead.session_id}`)}
                    className="text-(--color-primary) hover:underline font-mono text-xs"
                  >
                    {lead.session_id}
                  </button>
                </dd>
              </div>
            )}
          </dl>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
          <h2 className="text-lg font-semibold mb-4 text-(--color-text-primary)">Edit lead</h2>
          {editError && (
            <ErrorMessage message={editError} className="mb-4" />
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) focus:outline-none focus:border-(--color-border-focus) bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) focus:outline-none focus:border-(--color-border-focus) bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">Phone</label>
              <input
                type="text"
                value={form.phone_number}
                onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) focus:outline-none focus:border-(--color-border-focus) bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) focus:outline-none focus:border-(--color-border-focus) bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-text-secondary)">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Lead['status'] }))}
                className="w-full px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) focus:outline-none focus:border-(--color-border-focus) bg-white"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-(--color-primary) text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
