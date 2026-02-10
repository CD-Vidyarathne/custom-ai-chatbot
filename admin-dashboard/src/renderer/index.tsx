import ReactDom from 'react-dom/client';
import React from 'react';

import { AppRoutes } from './routes';

import './globals.css';
import { DashboardScreen } from './screens/DashboardScreen';

ReactDom.createRoot(document.querySelector('app') as HTMLElement).render(
  <React.StrictMode>
    <DashboardScreen />
  </React.StrictMode>
);
