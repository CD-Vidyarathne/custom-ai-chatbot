import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="background overflow-hidden">
      <Outlet />
    </div>
  );
}
