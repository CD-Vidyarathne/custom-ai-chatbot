import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function TopNavbar() {
  const { user, signOut } = useAuth();

  return (
    <div className="h-16 bg-white border-b border-(--color-border) flex items-center justify-between px-6">
      <div className="flex items-center" />
      <div className="flex items-center gap-4">
        {user?.email && (
          <span className="text-sm text-(--color-text-muted) truncate max-w-[180px]">
            {user.email}
          </span>
        )}
        <button
          type="button"
          onClick={() => signOut()}
          className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-(--color-bg-glass) text-(--color-text-secondary) hover:bg-(--color-bg-glass-hover)"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
