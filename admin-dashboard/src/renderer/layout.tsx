import { Outlet } from 'react-router-dom';
import { SideNavbar } from './components/SideNavbar';
import { TopNavbar } from './components/TopNavbar';

export function AppLayout() {
    return (
        <div
            className="screen-container flex"
            style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
            {/* Side Navbar */}
            <SideNavbar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <TopNavbar />

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
