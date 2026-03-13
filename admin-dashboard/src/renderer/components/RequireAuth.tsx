import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (!isConfigured) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-bg-primary)">
        <div className="text-(--color-text-muted)">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
