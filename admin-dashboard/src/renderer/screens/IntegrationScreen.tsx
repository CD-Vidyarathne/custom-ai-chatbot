import React from 'react';
import { API_BASE_URL } from '../api/config';

export const IntegrationScreen: React.FC = () => {
  const scriptSrc = `${API_BASE_URL.replace(/\/+$/, '')}/chat-bubble.js`;
  const hostUrl = API_BASE_URL.replace(/\/+$/, '');

  const headSnippet = `<script src="${scriptSrc}"></script>`;
  const bodySnippet = `<script>
  window.customWebChat.init({
    hostUrl: "${hostUrl}",
    chatId: "<your_organization_id>"
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
        <p className="text-xs text-(--color-text-muted)">
          Replace <span className="font-mono">&lt;your_organization_id&gt;</span> with the{' '}
          <span className="font-mono">org_id</span> of the organization that owns this chatbot.
        </p>
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
    </div>
  );
};

