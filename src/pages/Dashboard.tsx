import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_VERSION } from '../constants';
import { DecisionSignal, UserRole } from '../types';
import { getDecisionSignals } from '../services/moEngine';
import { Navbar } from '../components/Navbar';
import { SearchHero } from '../components/SearchHero';
import { VenueAnalytics } from '../components/VenueAnalytics';
import { DecisionCard } from '../components/DecisionCard';
import { useAuthStore } from '../stores/useAuthStore';
import { StaffDashboard } from '../components/StaffDashboard';
import { VenueOwnerDashboard } from '../components/VenueOwnerDashboard';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [signals, setSignals] = useState<DecisionSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sportFilter, setSportFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    const currentRole: UserRole = (user?.role as UserRole) || UserRole.FAN;

    // Fetch data only for FAN users
    useEffect(() => {
        if (currentRole === UserRole.FAN) {
            const fetchData = async () => {
                setLoading(true);
                const data = await getDecisionSignals(locationFilter);
                setSignals(data);
                setLoading(false);
            };
            fetchData();
        }
    }, [locationFilter, sportFilter, searchTerm, currentRole]);

    // === ROLE-BASED ROUTING LOGIC ===
    // If user is STAFF, show StaffDashboard
    if (currentRole === UserRole.STAFF) {
        return <StaffDashboard />;
    }

    // If user is VENUE, show VenueOwnerDashboard
    if (currentRole === UserRole.VENUE) {
        return <VenueOwnerDashboard />;
    }

    // Otherwise, show FAN view (default)
    // === END ROLE-BASED ROUTING ===


    const handleHomeClick = () => {
        logout();
        navigate('/');
    };



    const filteredBySearch = signals.filter(s => {
        // 1. Fuzzy Text Search
        const lowerTerm = searchTerm.toLowerCase().trim();
        let matchesSearch = true;

        if (lowerTerm) {
            // Special case for "live events" tag
            if (lowerTerm === 'live events' || lowerTerm === 'live') {
                // If searching for live events, only show hot/live events
                if (!s.event.isHot) return false;
            }

            // Build searchable text including Event AND Venue data
            const venueText = s.matchedVenues.map(mv =>
                `${mv.venue.name} ${mv.venue.tags.map(t => t.label).join(' ')}`
            ).join(' ');

            const searchableText = `
                ${s.event.title.toLowerCase()} 
                ${s.event.league.toLowerCase()} 
                ${s.event.sport.toLowerCase()}
                ${s.event.teamA.toLowerCase()} 
                ${s.event.teamB.toLowerCase()}
                ${venueText.toLowerCase()}
            `;

            // Synonym handling
            const synonyms: Record<string, string> = {
                'soccer': 'football',
                'football': 'soccer',
                'basketbal': 'basketball', // Common typo
                'b-ball': 'basketball'
            };

            const synonym = synonyms[lowerTerm];

            // Basic Levenshtein Distance for fuzzy match
            const levenshtein = (a: string, b: string): number => {
                if (a.length === 0) return b.length;
                if (b.length === 0) return a.length;

                const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

                for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
                for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

                for (let j = 1; j <= b.length; j++) {
                    for (let i = 1; i <= a.length; i++) {
                        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
                        matrix[j][i] = Math.min(
                            matrix[j][i - 1] + 1,
                            matrix[j - 1][i] + 1,
                            matrix[j - 1][i - 1] + indicator
                        );
                    }
                }
                return matrix[b.length][a.length];
            };

            // Check if any searchable field fuzzy matches the term (allow 2 typos for words > 4 chars)
            // Or strict includes
            const fields = [
                s.event.title.toLowerCase(),
                s.event.league.toLowerCase(),
                s.event.sport.toLowerCase(),
                s.event.teamA.toLowerCase(),
                s.event.teamB.toLowerCase()
            ];

            matchesSearch = searchableText.includes(lowerTerm) ||
                (!!synonym && searchableText.includes(synonym)) ||
                fields.some(f => {
                    // Split field into words for better fuzzy matching against single-word query
                    return f.split(' ').some((word: string) => {
                        if (Math.abs(word.length - lowerTerm.length) > 2) return false;
                        return levenshtein(word, lowerTerm) <= 2;
                    });
                });
        }

        // 2. Date Range Search
        let matchesDate = true;
        if (dateRange.from || dateRange.to) {
            const eventDate = new Date(s.event.startTime);
            eventDate.setHours(0, 0, 0, 0);

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
                onHomeClick={handleHomeClick}
            />

            {currentRole === UserRole.FAN && (
                <SearchHero
                    onSearch={setSearchTerm}
                    onSportChange={setSportFilter}
                    onLocationChange={setLocationFilter}
                    dateRange={dateRange}
                    onDateChange={setDateRange}
                />
            )}

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8 safe-bottom">
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
        </div>
    );
};
