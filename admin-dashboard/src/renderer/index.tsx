import ReactDom from 'react-dom/client';
import React from 'react';
import './globals.css';
import { AppRoutes } from './routes';

import { DashboardScreen } from './screens/DashboardScreen';

ReactDom.createRoot(document.querySelector('app') as HTMLElement).render(
    <React.StrictMode>
        <AppRoutes />
    </React.StrictMode>
);
