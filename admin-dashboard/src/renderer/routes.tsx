import { Route, Navigate } from 'react-router-dom';

import { Router } from 'lib/electron-router-dom';

import { AppLayout } from './layout';
import { DashboardScreen } from './screens/DashboardScreen';

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
//   return <Navigate to={isAuthenticated ? '/main-menu' : '/login'} replace />;
// }

export function AppRoutes() {
  return (
    <Router
      main={
        <Route element={<AppLayout />}>
          {/* <Route element={<RootRedirect />} path="/" /> */}
          <Route element={<DashboardScreen />} path="/dashboard" />
        </Route>
      }
    />
  );
}
