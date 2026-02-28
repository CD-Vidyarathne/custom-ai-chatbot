import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    UserCircle,
    MessageSquare,
    Users,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

export function SideNavbar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems: NavItem[] = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            path: '/dashboard',
        },
        {
            id: 'persona',
            label: 'Persona Settings',
            icon: <UserCircle className="w-5 h-5" />,
            path: '/persona-settings',
        },
        {
            id: 'contacts',
            label: 'Contacts|Leads',
            icon: <Users className="w-5 h-5" />,
            path: '/contacts',
        },
        {
            id: 'conversations',
            label: 'Conversations',
            icon: <MessageSquare className="w-5 h-5" />,
            path: '/conversations',
        },
    ];

    const handleNavClick = (path: string) => {
        navigate(path);
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div
            className={`h-full min-h-full flex flex-col border-r bg-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} border-(--color-border)`}
        >
            <div className="p-6">
                <div className="flex items-center justify-center">
                    {!isCollapsed ? (
                        <h1 className="text-xl font-semibold tracking-tight text-(--color-primary) select-none">
                            Chatbot Manager
                        </h1>
                    ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg bg-(--color-primary) select-none">
                            CM
                        </div>
                    )}
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const active = isActive(item.path);

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.path)}
                            className={` w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isCollapsed ? 'justify-center' : ''} ${active ? 'bg-(--color-primary) text-white shadow-sm' : 'text-(--color-text-secondary) hover:bg-(--color-bg-glass-hover)'} `}
                        >
                            {item.icon}
                            {!isCollapsed && (
                                <span className="font-medium text-sm">{item.label}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-(--color-border)">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={` w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 bg-(--color-bg-glass) text-(--color-text-secondary) hover:bg-(--color-bg-glass-hover) ${isCollapsed ? 'justify-center' : ''} `}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-medium text-sm">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
