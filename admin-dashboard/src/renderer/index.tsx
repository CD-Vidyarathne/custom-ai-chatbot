import ReactDom from 'react-dom/client';
import React from 'react';
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes';

ReactDom.createRoot(document.querySelector('app') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
