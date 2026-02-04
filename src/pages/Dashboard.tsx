import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_VERSION } from '../constants';
import { DecisionSignal, UserRole } from '../types';
import { normalizeSearchTerm } from '../lib/search/synonyms';
import { getDecisionSignals } from '../services/moEngine';
import { Navbar } from '../components/Navbar';
import { SearchHero } from '../components/SearchHero';
import { DecisionCard } from '../components/DecisionCard';
import { AuthModal } from '../components/AuthModal';
import { useAuthStore } from '../stores/useAuthStore';
import { useLoginModal } from '../stores/useLoginModal';
import { StaffDashboard } from '../components/StaffDashboard';
import { VenueOwnerDashboard } from '../components/VenueOwnerDashboard';
import { MajorEventBanner } from '../components/MajorEventBanner';
import { AdminDashboard } from './dashboard/AdminDashboard';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout, setUser } = useAuthStore();
    const { isOpen, closeLoginModal, onSuccessCallback } = useLoginModal();
    const [signals, setSignals] = useState<DecisionSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sportFilter, setSportFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [sortBy, setSortBy] = useState('recommended');

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

    // If user is ADMIN, show AdminDashboard
    if (currentRole === UserRole.ADMIN) {
        return <AdminDashboard />;
    }

    // If user is STAFF, show StaffDashboard
    if (currentRole === UserRole.STAFF) {
        return <StaffDashboard />;
    }

    // If user is VENUE, show VenueOwnerDashboard
    if (currentRole === UserRole.VENUE) {
        return <VenueOwnerDashboard />;
    }
    // === END ROLE-BASED ROUTING ===


    const handleHomeClick = () => {
        logout();
        navigate('/');
    };

    // Helper: Basic Levenshtein Distance for fuzzy match
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

    const filteredBySearch = signals.filter(s => {
        // 1. Fuzzy Text Search
        const rawTerm = searchTerm.toLowerCase().trim();
        // Layer 1: Synonym Engine
        // Normalize the search term (e.g., "Man U" -> "Manchester United")
        // We use this normalized term for checking includes/keywords
        const normalizedTerm = normalizeSearchTerm(rawTerm).toLowerCase();

        // We still keep rawTerm for fuzzy matching to handle typos that might not be in synonyms
        let matchesSearch = true;

        if (rawTerm) {
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

            // Start with normalized checks (exact substring match of normalized term)
            matchesSearch = searchableText.includes(normalizedTerm) ||
                searchableText.includes(rawTerm) ||
                fields.some(f => f.includes(normalizedTerm)) ||
                // Then do fuzzy on the raw term
                fields.some(f => {
                    // Split field into words for better fuzzy matching against single-word query
                    return f.split(' ').some((word: string) => {
                        if (Math.abs(word.length - rawTerm.length) > 2) return false;
                        return levenshtein(word, rawTerm) <= 2;
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

            {/* V6.2 WBC Campaign Banner - Re-positioned to Top */}
            {currentRole === UserRole.FAN && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <MajorEventBanner
                        eventName="WBC 2026: Taipei Pool"
                        hypeText="Team Taiwan 🇹🇼 takes on the world! Catch every strike live at validated audio-enabled venues."
                        ctaText="Find Official Parties"
                        onCtaClick={() => {
                            setSearchTerm('WBC');
                            setSportFilter('Baseball');
                        }}
                    />
                </div>
            )}

            {currentRole === UserRole.FAN && (
                <SearchHero
                    onSearch={setSearchTerm}
                    onSportChange={setSportFilter}
                    onLocationChange={setLocationFilter}
                    dateRange={dateRange}
                    onDateChange={setDateRange}
                    onSortChange={setSortBy}
                />
            )}

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8 safe-bottom">



                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                        Upcoming Matches
                    </h2>
                    {loading && <span className="text-[10px] font-mono text-mosport-venue animate-pulse">CONNECTING TO MO-ENGINE...</span>}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-48 bg-gray-900/50 rounded-xl animate-pulse border border-gray-800"></div>)}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {(() => {
                            // Apply Sorting
                            let displaySignals = [...filteredBySearch];

                            if (sortBy === 'rating') {
                                displaySignals.sort((a, b) => {
                                    const maxRatingA = Math.max(...a.matchedVenues.map(m => m.venue.rating));
                                    const maxRatingB = Math.max(...b.matchedVenues.map(m => m.venue.rating));
                                    return maxRatingB - maxRatingA;
                                });
                            } else if (sortBy === 'benefits') {
                                displaySignals.sort((a, b) => {
                                    // Count tags + features (mock logic for features count)
                                    const countA = Math.max(...a.matchedVenues.map(m => m.venue.tags.length));
                                    const countB = Math.max(...b.matchedVenues.map(m => m.venue.tags.length));
                                    return countB - countA;
                                });
                            } else if (sortBy === 'nearest') {
                                displaySignals.sort((a, b) => {
                                    // Parse distance string "1.2 km" -> 1.2
                                    const getDist = (s: DecisionSignal) => {
                                        const distStr = s.matchedVenues[0]?.venue.distance || '9999';
                                        return parseFloat(distStr.replace(/[^0-9.]/g, ''));
                                    };
                                    return getDist(a) - getDist(b);
                                });
                            }
                            // 'recommended' is default order

                            // Layer 3: Category Fallback Logic
                            const showVenueFallback = displaySignals.length === 0 && searchTerm;

                            // Find venues that match the search term (even if no event exists)
                            // This is a "Safety Net" to prevent empty results for searched categories
                            const fallbackVenues = showVenueFallback ?
                                // We can't access 'all venues' easily here since we only have 'signals' which contain matched venues.
                                // However, we can scan all venues from the signals list (deduplicated) or fetch them.
                                // Ideally, we should filter from a global venue list.
                                // For now, let's scan all signals' unique venues as a proxy, or import MOCK_VENUES if needed.
                                // Let's try to filter based on available unique venues in 'signals' (mock or api data)
                                Array.from(new Map(signals.flatMap(s => s.matchedVenues).map(mv => [mv.venue.id, mv.venue])).values())
                                    .filter(venue => {
                                        const term = normalizeSearchTerm(searchTerm).toLowerCase();
                                        return (
                                            venue.tags.some(t => t.label.toLowerCase().includes(term)) ||
                                            venue.name.toLowerCase().includes(term) ||
                                            // Also check simplified features if available
                                            (venue.features && JSON.stringify(venue.features).toLowerCase().includes(term))
                                        );
                                    }).slice(0, 3)
                                : [];

                            if (displaySignals.length > 0) {
                                return displaySignals.map(signal => (
                                    <DecisionCard
                                        key={signal.eventId}
                                        signal={signal}
                                        userRole={currentRole}
                                    />
                                ));
                            } else if (showVenueFallback && fallbackVenues.length > 0) {
                                // Layer 3 UI: Fallback to Venues
                                return (
                                    <div className="space-y-6">
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">No scheduled matches found for "{searchTerm}"</h3>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400 ml-11 mb-4">
                                                However, these venues are known for showing <strong>{normalizeSearchTerm(searchTerm)}</strong>.
                                                We recommend checking them out!
                                            </p>

                                            <div className="grid gap-3">
                                                {fallbackVenues.map(venue => (
                                                    <div key={venue.id} className="bg-mosport-card border border-gray-800 p-4 rounded-lg flex justify-between items-center hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => window.open(venue.googleMapUrl, '_blank')}>
                                                        <div className="flex items-center gap-3">
                                                            <img src={venue.imageUrl} alt={venue.name} className="w-12 h-12 rounded-full object-cover border border-gray-700" />
                                                            <div>
                                                                <h4 className="font-bold text-white">{venue.name}</h4>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <span>{venue.location}</span>
                                                                    <span>•</span>
                                                                    <span className="text-yellow-500">★ {venue.rating}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded border border-gray-700">
                                                            View
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="text-center py-12 text-gray-500 bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
                                        <p className="font-bold">No matches found.</p>
                                        <p className="text-xs mt-1">Try adjusting your filters.</p>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                )}
            </main>

            {/* AuthModal for Lazy Login */}
            <AuthModal
                isOpen={isOpen}
                onClose={closeLoginModal}
                onLoginAs={(role) => {
                    setUser({
                        id: 'temp-user',
                        email: user?.email,
                        role,
                        isAuthenticated: true,
                        isGuest: false,
                        provider: 'google',
                    });
                    closeLoginModal();
                    if (onSuccessCallback) {
                        onSuccessCallback();
                    }
                }}
            />
        </div>
    );
};
