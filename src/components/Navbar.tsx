import { UserRole } from '../types';

interface NavbarProps {
    currentRole: UserRole;
    isGuestMode?: boolean;
    onHomeClick: () => void;
}

export const Navbar = ({ currentRole, isGuestMode = false, onHomeClick }: NavbarProps) => {
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

    return (
        <nav className="sticky top-0 z-50 bg-mosport-black/90 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={onHomeClick}>
                        <div className="text-2xl font-black tracking-tighter italic">
                            <span className="text-mosport-fan">M</span>
                            <span className="text-mosport-venue">S</span>
                        </div>
                        <span className="text-white font-bold tracking-wide hidden sm:block">MOSPORT</span>
                    </div>
                    <div></div>
                    <div className="flex items-center gap-3">
                        {/* Role Badge */}
                        <div className={`px-3 py-1.5 rounded-md border ${getRoleBgColor(currentRole)}`}>
                            <span className={`text-[10px] uppercase font-bold ${getRoleColor(currentRole)} tracking-widest`}>
                                {currentRole} MODE
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
