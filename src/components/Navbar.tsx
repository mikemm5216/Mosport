import { useState } from 'react';
import { UserRole } from '../types';
import { useAuthStore } from '../stores/useAuthStore';
import { isAdmin } from '../config/admin';
import { ChevronDown } from 'lucide-react';

interface NavbarProps {
    currentRole: UserRole;
    onHomeClick: () => void;
}

export const Navbar = ({ currentRole, onHomeClick }: NavbarProps) => {
    const { user, setRole } = useAuthStore();
    const [showRoleMenu, setShowRoleMenu] = useState(false);
    const userIsAdmin = isAdmin(user?.email);

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case UserRole.FAN: return 'text-mosport-fan';
            case UserRole.VENUE: return 'text-mosport-venue';
            case UserRole.STAFF: return 'text-mosport-staff';
            default: return 'text-gray-400';
        }
    };

    const getRoleBgColor = (role: UserRole) => {
        switch (role) {
            case UserRole.FAN: return 'bg-mosport-fan/10 border-mosport-fan/30';
            case UserRole.VENUE: return 'bg-mosport-venue/10 border-mosport-venue/30';
            case UserRole.STAFF: return 'bg-mosport-staff/10 border-mosport-staff/30';
            default: return 'bg-gray-800 border-gray-700';
        }
    };

    const handleRoleSwitch = (role: UserRole) => {
        setRole(role);
        setShowRoleMenu(false);
    };

    const availableRoles = [
        UserRole.FAN,
        UserRole.VENUE,
        ...(userIsAdmin ? [UserRole.STAFF] : [])
    ];

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
                    <div></div>
                    <div className="flex items-center gap-3 relative">
                        {/* Role Switcher Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowRoleMenu(!showRoleMenu)}
                                className={`px-3 py-1.5 rounded-md border ${getRoleBgColor(currentRole)} hover:opacity-80 transition-opacity flex items-center gap-2`}
                            >
                                <span className={`text-[10px] uppercase font-bold ${getRoleColor(currentRole)} tracking-widest`}>
                                    {currentRole} MODE
                                </span>
                                <ChevronDown size={12} className={getRoleColor(currentRole)} />
                            </button>

                            {showRoleMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                                    {availableRoles.map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => handleRoleSwitch(role)}
                                            className={`w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-wider transition-colors ${role === currentRole
                                                    ? `${getRoleColor(role)} bg-gray-800`
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                                }`}
                                        >
                                            {role} MODE
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
