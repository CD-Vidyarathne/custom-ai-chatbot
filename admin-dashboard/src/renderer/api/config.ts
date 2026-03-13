/**
 * API base URL for the backend. In Electron this typically points to localhost where the api-server runs.
 * Override via process.env.VITE_API_URL or window.__API_BASE_URL__ if needed.
 */
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && (window as { __API_BASE_URL__?: string }).__API_BASE_URL__) {
    return (window as { __API_BASE_URL__: string }).__API_BASE_URL__;
  }
  return (process.env as { VITE_API_URL?: string }).VITE_API_URL ?? 'http://localhost:8080';
};

export const API_BASE_URL = getBaseUrl();
