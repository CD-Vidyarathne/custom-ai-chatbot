import { LogOut } from 'lucide-react';

export function TopNavbar() {
    const handleLogout = () => {
        console.log('Logout clicked');
    };

    return (
        <div className="h-16 bg-white border-b border-(--color-border) flex items-center justify-between px-6">
            <div className="flex items-center"></div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleLogout}
                    className=" flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-(--color-bg-glass) text-(--color-text-secondary) hover:bg-(--color-bg-glass-hover) "
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
