import { Route, Routes, Navigate } from 'react-router-dom';
import { Router } from 'lib/electron-router-dom';
import { AppLayout } from './layout';
import { RequireAuth } from './components/RequireAuth';
import { RedirectIfAuth } from './components/RedirectIfAuth';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { PersonaSettingsScreen } from './screens/PersonaSettingsScreen';
import { LeadsScreen } from './screens/LeadsScreen';
import { LeadDetailScreen } from './screens/LeadDetailScreen';
import { ConversationsScreen } from './screens/ConversationsScreen';

export function AppRoutes() {
  return (
    <Router
      main={
        <Routes>
          <Route path="/login" element={<RedirectIfAuth><LoginScreen /></RedirectIfAuth>} />
          <Route path="/register" element={<RedirectIfAuth><RegisterScreen /></RedirectIfAuth>} />
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/persona-settings" element={<PersonaSettingsScreen />} />
            <Route path="/contacts" element={<LeadsScreen />} />
            <Route path="/contacts/:id" element={<LeadDetailScreen />} />
            <Route path="/conversations" element={<ConversationsScreen />} />
          </Route>
        </Routes>
      }
    />
  );
}
