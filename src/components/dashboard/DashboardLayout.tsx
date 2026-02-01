import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserRole } from '../../types';
import { User, LogOut, LayoutDashboard, Users, Building2 } from 'lucide-react';

export interface DashboardLayoutProps {
    role: UserRole;
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, children }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const roleConfig = {
        [UserRole.FAN]: {
            color: 'blue',
            icon: User,
            label: 'Fan Mode'
        },
        [UserRole.VENUE]: {
            color: 'red',
            icon: Building2,
            label: 'Venue Mode'
        },
        [UserRole.ADMIN]: {
            color: 'purple',
            icon: Users,
            label: 'Admin Mode'
        },
        [UserRole.STAFF]: {
            color: 'yellow',
            icon: LayoutDashboard,
            label: 'Staff Mode'
        }
    };

    const config = roleConfig[role];
    const RoleIcon = config.icon;

    return (
        <div className="min-h-screen bg-mosport-black">
            {/* Top Navigation Bar */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold">
                                <span className="text-mosport-fan">M</span>
                                <span className="text-white">/</span>
                                <span className="text-mosport-venue">S</span>
                                <span className="text-gray-400 ml-2">MOSPORT</span>
                            </h1>
                            <div className={`rounded-full px-3 py-1 text-xs font-medium border bg-${config.color}-500/10 border-${config.color}-500/30 text-${config.color}-400 flex items-center gap-1`}>
                                <RoleIcon className="h-3 w-3" />
                                {config.label}
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">{user?.profile?.name || user?.email}</p>
                                <p className="text-xs text-gray-500">{role}</p>
                            </div>
                            {user?.profile?.picture && (
                                <img
                                    src={user.profile.picture}
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full border border-gray-700"
                                />
                            )}
                            <button
                                onClick={handleLogout}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};
