import { Route, Navigate } from 'react-router-dom';
import { Router } from 'lib/electron-router-dom';
import { AppLayout } from './layout';
import { DashboardScreen } from './screens/DashboardScreen';
import { PersonaSettingsScreen } from './screens/PersonaSettingsScreen';
import { ContactsScreen } from './screens/ContactsScreen';
import { ConversationsScreen } from './screens/ConversationsScreen';

// function RootRedirect() {
//   const { isAuthenticated, isLoading } = useAuth();
//
//   if (isLoading) {
//     return (
//       <div className="screen-container">
//         <div className="screen-content flex items-center justify-center">
//           <div className="text-white text-xl">Loading...</div>
//         </div>
//       </div>
//     );
//   }
//
//   return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
// }

export function AppRoutes() {
    return (
        <Router
            main={
                <Route element={<AppLayout />}>
                    {/* Redirect root to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Main Routes */}
                    <Route path="/dashboard" element={<DashboardScreen />} />
                    <Route path="/persona-settings" element={<PersonaSettingsScreen />} />
                    <Route path="/contacts" element={<ContactsScreen />} />
                    <Route path="/conversations" element={<ConversationsScreen />} />
                </Route>
            }
        />
    );
}
