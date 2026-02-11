import { Outlet } from 'react-router-dom';
import { SideNavbar } from './components/SideNavbar';
import { TopNavbar } from './components/TopNavbar';

export function AppLayout() {
    return (
        <div className="h-screen w-screen flex bg-(--color-bg-primary)">
            <SideNavbar />

            <div className="w-full flex flex-col">
                <TopNavbar />
                <main className="flex-1 h-full overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
