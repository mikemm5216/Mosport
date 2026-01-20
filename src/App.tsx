import { useState, useEffect } from 'react';
import { APP_VERSION } from './constants';
import { UserRole } from './types';
import { getDecisionSignals } from './services/moEngine';
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { VenueAnalytics } from './components/VenueAnalytics';
import { DecisionCard } from './components/DecisionCard';
import { AuthModal } from './components/AuthModal';

import { LandingPage } from './components/LandingPage';

function App() {
    const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.FAN);
    const [signals, setSignals] = useState<any[]>([]); // Using any[] for now to match the implicit structure, ideally strict DecisionSignal[]
    const [loading, setLoading] = useState(true);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);
    const [isGuestMode, setIsGuestMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('Ha Noi');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getDecisionSignals(locationFilter);
            setSignals(data);
            setLoading(false);
        };
        fetchData();
    }, [locationFilter]);

    const handleSkipLogin = (role: UserRole) => {
        setCurrentRole(role);
        setHasEntered(true);
        setIsGuestMode(true); // Skip = Guest Mode
        setIsAuthOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleHomeClick = () => {
        setHasEntered(false);
        setCurrentRole(UserRole.FAN);
        setIsGuestMode(false);
        setSearchTerm('');
        setLocationFilter('Ha Noi');
        setDateRange({ from: '', to: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Smart Search Mapping
    const getSearchKeywords = (term: string) => {
        const t = term.toLowerCase();
        if (t === 'soccer' || t === 'football' || t === 'bong da') return ['v.league', 'premier league', 'champions league', 'aff cup', 'vietnam', 'hanoi'];
        if (t === 'baseball') return ['mlb', 'npb'];
        if (t === 'basketball') return ['nba', 'vba'];
        if (t === 'hanoi' || t === 'ha noi') return ['hanoi', 'ha noi'];
        return [t];
    };

    const filteredBySearch = signals.filter(s => {
        // 1. Text Search
        const lowerTerm = searchTerm.toLowerCase();
        let matchesSearch = true;
        if (lowerTerm) {
            const keywords = getSearchKeywords(lowerTerm);
            matchesSearch = keywords.some((k: string) =>
                s.event.title.toLowerCase().includes(k) ||
                s.event.league.toLowerCase().includes(k) ||
                s.event.teamA.toLowerCase().includes(k) ||
                s.event.teamB.toLowerCase().includes(k)
            );
        }

        // 2. Date Range Search
        let matchesDate = true;
        if (dateRange.from || dateRange.to) {
            const eventDate = new Date(s.event.startTime);
            eventDate.setHours(0, 0, 0, 0); // Normalize time

            if (dateRange.from) {
                const fromDate = new Date(dateRange.from);
                fromDate.setHours(0, 0, 0, 0);
                if (eventDate < fromDate) matchesDate = false;
            }
            if (dateRange.to && matchesDate) {
                const toDate = new Date(dateRange.to);
                toDate.setHours(0, 0, 0, 0);
                if (eventDate > toDate) matchesDate = false;
            }
        }

        return matchesSearch && matchesDate;
    });

    if (!hasEntered) {
        return (
            <>
                <LandingPage onLoginClick={() => setIsAuthOpen(true)} />
                <AuthModal
                    isOpen={isAuthOpen}
                    onClose={() => setIsAuthOpen(false)}
                    onLoginAs={handleSkipLogin}
                />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-mosport-black font-sans text-gray-200 pb-20 selection:bg-pink-500 selection:text-white">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-center py-2 px-4 border-b border-white/5 shadow-lg relative z-50">
                <div className="flex items-center justify-center gap-2 animate-fadeIn">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <p className="text-[10px] font-mono font-medium tracking-widest text-gray-400 uppercase">
                        SYSTEM STATUS: <span className="text-gray-200 font-bold">{APP_VERSION}</span>
                    </p>
                </div>
            </div>

            <Navbar
                currentRole={currentRole}
                isGuestMode={isGuestMode}
                onLoginClick={() => setIsAuthOpen(true)}
                onHomeClick={handleHomeClick}
            />

            {currentRole === UserRole.FAN && (
                <SearchHero
                    onSearch={setSearchTerm}
                    onLocationChange={setLocationFilter}
                    dateRange={dateRange}
                    onDateChange={setDateRange}
                />
            )}

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {currentRole === UserRole.VENUE && !loading && <VenueAnalytics />}

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                        {currentRole === UserRole.VENUE ? 'Matched Events (Your Schedule)' : 'Upcoming Matches'}
                    </h2>
                    {loading && <span className="text-[10px] font-mono text-mosport-venue animate-pulse">CONNECTING TO MO-ENGINE...</span>}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-48 bg-gray-900/50 rounded-xl animate-pulse border border-gray-800"></div>)}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredBySearch.length > 0 ? (
                            filteredBySearch.map(signal => (
                                <DecisionCard
                                    key={signal.eventId}
                                    signal={signal}
                                    userRole={currentRole}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
                                <p className="font-bold">No matches found.</p>
                                <p className="text-xs mt-1">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onLoginAs={handleSkipLogin}
            />
        </div>
    );
}

export default App;
