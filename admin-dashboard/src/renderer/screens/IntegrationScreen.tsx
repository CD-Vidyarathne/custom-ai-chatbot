import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../api/config';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const ORG_STORAGE_KEY = 'org_id';

export const IntegrationScreen: React.FC = () => {
  const { user, isConfigured, loading: authLoading } = useAuth();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured || authLoading) return;
    if (!user) {
      setError('You must be signed in to view integration instructions.');
      setLoading(false);
      return;
    }

    const loadOrg = async () => {
      setLoading(true);
      setError(null);

      let stored: string | null = null;
      if (typeof window !== 'undefined') {
        stored = window.localStorage.getItem(ORG_STORAGE_KEY);
      }
      if (stored) {
        setOrgId(stored);
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from('organization')
        .select('org_id')
        .eq('owner_user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (dbError || !data) {
        setError('Organization not found for this user.');
        setOrgId(null);
        setLoading(false);
        return;
      }

      setOrgId(data.org_id);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ORG_STORAGE_KEY, data.org_id);
      }
      setLoading(false);
    };

    void loadOrg();
  }, [user, isConfigured, authLoading]);

  const hostUrl = "http://localhost:3090";
  const scriptSrc = `${hostUrl}/chat-bubble.js`;
  const resolvedOrgId = orgId ?? '<organization_id_not_found>';

  const headSnippet = `<script src="${scriptSrc}"></script>`;
  const bodySnippet = `<script>
  window.customWebChat.init({
    hostUrl: "${hostUrl}",
    chatId: "${resolvedOrgId}"
  });
</script>`;

  return (
    <div className="min-h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-(--color-text-primary)">Integration</h1>
        <p className="text-sm mt-1 text-(--color-text-muted)">
          Embed the chat bubble on your website using a simple JavaScript snippet.
        </p>
      </div>

      {loading && (
        <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
          <p className="text-sm text-(--color-text-muted)">Loading organization info…</p>
        </section>
      )}

      {error && !loading && (
        <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border)">
          <p className="text-sm text-(--color-danger)">{error}</p>
        </section>
      )}

      {!loading && !error && (
        <>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border) space-y-4">
            <h2 className="text-lg font-semibold text-(--color-text-primary)">1. Include the script on your site</h2>
            <p className="text-sm text-(--color-text-muted)">
              Add this script tag inside the <span className="font-mono">&lt;head&gt;</span> of your public website.
            </p>
            <pre className="bg-(--color-bg-primary) rounded-lg p-4 text-xs overflow-x-auto">
              <code>{headSnippet}</code>
            </pre>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border) space-y-4">
            <h2 className="text-lg font-semibold text-(--color-text-primary)">2. Initialize the widget</h2>
            <p className="text-sm text-(--color-text-muted)">
              Then, before the closing <span className="font-mono">&lt;/body&gt;</span> tag of your site, initialize the widget:
            </p>
            <pre className="bg-(--color-bg-primary) rounded-lg p-4 text-xs overflow-x-auto">
              <code>{bodySnippet}</code>
            </pre>
            {!orgId && (
              <p className="text-xs text-(--color-text-muted)">
                Organization id was not found automatically. Make sure you have created an organization first.
              </p>
            )}
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border) space-y-3">
            <h2 className="text-lg font-semibold text-(--color-text-primary)">How it works</h2>
            <ul className="list-disc list-inside text-sm text-(--color-text-secondary) space-y-1">
              <li>
                <span className="font-mono">chat-bubble.js</span> injects a floating button in the bottom-right corner of your site.
              </li>
              <li>
                When clicked, it opens an iframe pointing to <span className="font-mono">/embed/&lt;chatId&gt;</span> in the
                chat bubble app.
              </li>
              <li>
                The embed page communicates with the parent window via <span className="font-mono">postMessage</span> to resize
                between bubble and full chat window.
              </li>
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

