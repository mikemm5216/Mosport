import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { UserRole } from '../types';
import { useAuthStore } from '../stores/useAuthStore';

interface NavbarProps {
    currentRole: UserRole;
    onHomeClick: () => void;
}

export const Navbar = ({ currentRole, onHomeClick }: NavbarProps) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case UserRole.FAN: return 'text-mosport-fan';
            case UserRole.VENUE: return 'text-mosport-venue';
            case UserRole.STAFF: return 'text-mosport-staff';
            case UserRole.ADMIN: return 'text-purple-400';
            default: return 'text-gray-400';
        }
    };

    const getRoleBgColor = (role: UserRole) => {
        switch (role) {
            case UserRole.FAN: return 'bg-mosport-fan/10 border-mosport-fan/30';
            case UserRole.VENUE: return 'bg-mosport-venue/10 border-mosport-venue/30';
            case UserRole.STAFF: return 'bg-mosport-staff/10 border-mosport-staff/30';
            case UserRole.ADMIN: return 'bg-purple-500/10 border-purple-500/30';
            default: return 'bg-gray-800 border-gray-700';
        }
    };

    const handleDashboardClick = () => {
        if (currentRole === UserRole.FAN) {
            navigate('/dashboard/fan');
        } else if (currentRole === UserRole.ADMIN) {
            navigate('/dashboard/admin');
        }
        setShowUserMenu(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-mosport-black/90 backdrop-blur-md border-b border-gray-800 safe-top">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={onHomeClick}>
                        <div className="text-2xl font-black tracking-tighter italic">
                            <span className="text-mosport-fan">M</span>
                            <span className="text-mosport-venue">S</span>
                        </div>
                        <span className="text-white font-bold tracking-wide hidden sm:block">MOSPORT</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Role Badge */}
                        <div className={`px-3 py-1.5 rounded-md border ${getRoleBgColor(currentRole)}`}>
                            <span className={`text-[10px] uppercase font-bold ${getRoleColor(currentRole)} tracking-widest`}>
                                {currentRole} MODE
                            </span>
                        </div>

                        {/* User Menu Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors"
                            >
                                <User className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-300 hidden sm:block">{user?.name || 'User'}</span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
                                    {(currentRole === UserRole.FAN || currentRole === UserRole.ADMIN) && (
                                        <button
                                            onClick={handleDashboardClick}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>Dashboard</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 transition-colors border-t border-gray-800"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
