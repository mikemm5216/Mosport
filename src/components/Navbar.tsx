import { ROLE_THEMES } from '../constants';
import { UserRole } from '../types';

interface NavbarProps {
    currentRole: UserRole;
    isGuestMode?: boolean;
    onLoginClick: () => void;
    onHomeClick: () => void;
}

export const Navbar = ({ currentRole, isGuestMode = false, onLoginClick, onHomeClick }: NavbarProps) => {
    const theme = ROLE_THEMES[currentRole];

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
                        {isGuestMode ? (
                            <div className="px-3 py-1.5 rounded-md bg-gray-800/50 border border-gray-700">
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                                    GUEST MODE
                                </span>
                            </div>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className={`px-3 py-1.5 rounded-md border ${getRoleBgColor(currentRole)} hover:opacity-80 transition-opacity cursor-pointer focus:outline-none`}
                            >
                                <span className={`text-[10px] uppercase font-bold ${getRoleColor(currentRole)} tracking-widest`}>
                                    {currentRole} MODE
                                </span>
                            </button>
                        )}

                        {/* Login Icon */}
                        <button onClick={onLoginClick} className="text-gray-300 hover:text-white transition-colors focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
