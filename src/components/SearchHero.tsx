import { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { useDebounce } from '../hooks/useDebounce';

interface DateRange {
    from: string;
    to: string;
}

interface SearchHeroProps {
    onSearch: (term: string) => void;
    onLocationChange: (loc: string) => void;
    dateRange: DateRange;
    onDateChange: (range: DateRange) => void;
}

interface TrendingData {
    tags: string[];
    events: Array<{
        id: string;
        title: string;
        league: string;
        sport: string;
        team_a: string;
        team_b: string;
    }>;
}

interface SearchResult {
    id: string;
    name: string;
    slug: string;
    address: string;
    city: string;
    distance_km: number;
    qoe_score: number;
    tags: string[];
}

export const SearchHero = ({ onSearch, onLocationChange, dateRange, onDateChange }: SearchHeroProps) => {
    const [term, setTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [trending, setTrending] = useState<TrendingData | null>(null);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [fallbackVenues, setFallbackVenues] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState({ lat: 21.0285, lon: 105.8542 }); // Default: Hanoi

    const fromDateRef = useRef<HTMLInputElement>(null);
    const toDateRef = useRef<HTMLInputElement>(null);

    // Debounce search term (300ms delay)
    const debouncedTerm = useDebounce(term, 300);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    // Fetch trending data on mount (Zero State)
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/v1/search/trending`);
                const data = await res.json();
                setTrending(data);
            } catch (err) {
                console.error('Failed to fetch trending:', err);
            }
        };
        fetchTrending();
    }, [apiUrl]);

    // Search venues when debounced term changes
    useEffect(() => {
        if (!debouncedTerm) {
            setSearchResults([]);
            return;
        }

        const searchVenues = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(
                    `${apiUrl}/api/v1/search/venues?q=${encodeURIComponent(debouncedTerm)}&lat=${userLocation.lat}&lon=${userLocation.lon}`
                );
                const data = await res.json();
                setSearchResults(data.results || []);

                // If no results, fetch fallback venues
                if (data.results.length === 0) {
                    const fallbackRes = await fetch(
                        `${apiUrl}/api/v1/search/fallback?lat=${userLocation.lat}&lon=${userLocation.lon}`
                    );
                    const fallbackData = await fallbackRes.json();
                    setFallbackVenues(fallbackData.venues || []);
                } else {
                    setFallbackVenues([]);
                }
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setIsLoading(false);
            }
        };

        searchVenues();
    }, [debouncedTerm, userLocation, apiUrl]);

    const triggerPicker = (ref: React.RefObject<HTMLInputElement>) => {
        if (ref.current) {
            try {
                // @ts-ignore - showPicker is a standard HTMLInputElement method but might be missing in some older TS defs
                ref.current.showPicker();
            } catch (e) {
                console.log('showPicker not supported', e);
            }
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return (
        <div className="relative border-b border-gray-800 bg-mosport-card/50">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 sm:px-6 lg:px-8 relative z-10">
                <h1 className="text-xl sm:text-3xl font-bold text-center mb-4 md:mb-6 text-white tracking-tight">
                    Find Your Game, <span className="text-gray-500">Anywhere.</span>
                </h1>
                <div className="max-w-4xl mx-auto bg-mosport-dark border border-gray-700 rounded-xl p-1 md:p-2 flex flex-col md:flex-row gap-1 md:gap-2 shadow-2xl">
                    <div className="flex-[1.5] px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700 relative">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">I want to watch</label>
                        <input
                            type="text"
                            value={term}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            onChange={(e) => {
                                const val = e.target.value;
                                setTerm(val);
                                onSearch(val);
                            }}
                            placeholder="Team, League, or Event?"
                            className="w-full bg-transparent text-white font-medium focus:outline-none placeholder-gray-600"
                        />

                        {/* Zero State: Trending Tags */}
                        {isFocused && !term && trending && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-mosport-dark border border-gray-700 rounded-lg p-4 shadow-xl z-50">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-2">🔥 Trending Now</div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {trending.tags.map((tag, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setTerm(tag);
                                                onSearch(tag);
                                            }}
                                            className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-full text-sm transition-colors"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                                {trending.events.length > 0 && (
                                    <>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-2">🏆 Upcoming Events</div>
                                        <div className="space-y-2">
                                            {trending.events.slice(0, 3).map((event) => (
                                                <button
                                                    key={event.id}
                                                    onClick={() => {
                                                        setTerm(event.title);
                                                        onSearch(event.title);
                                                    }}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded text-sm transition-colors"
                                                >
                                                    <div className="text-white font-medium">{event.team_a} vs {event.team_b}</div>
                                                    <div className="text-gray-500 text-xs">{event.league}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Search Results */}
                        {isFocused && term && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-mosport-dark border border-gray-700 rounded-lg p-4 shadow-xl z-50 max-h-96 overflow-y-auto">
                                {isLoading && (
                                    <div className="text-center text-gray-500">Searching...</div>
                                )}

                                {!isLoading && searchResults.length > 0 && (
                                    <div className="space-y-2">
                                        {searchResults.map((venue) => (
                                            <div
                                                key={venue.id}
                                                className="px-3 py-2 hover:bg-gray-800 rounded cursor-pointer transition-colors"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-white font-medium">{venue.name}</div>
                                                        <div className="text-gray-500 text-xs">{venue.address}</div>
                                                        <div className="flex gap-1 mt-1">
                                                            {venue.tags.slice(0, 3).map((tag, idx) => (
                                                                <span key={idx} className="text-xs text-blue-400">#{tag}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-orange-500">{venue.distance_km}km</div>
                                                        <div className="text-xs text-gray-500">QoE: {venue.qoe_score}/10</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* No Results: Fallback Venues */}
                                {!isLoading && searchResults.length === 0 && fallbackVenues.length > 0 && (
                                    <div>
                                        <div className="text-gray-400 mb-3">
                                            No venues found for "<span className="text-white">{term}</span>".
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-2">
                                            📍 Here are popular sports bars near you:
                                        </div>
                                        <div className="space-y-2">
                                            {fallbackVenues.map((venue) => (
                                                <div
                                                    key={venue.id}
                                                    className="px-3 py-2 hover:bg-gray-800 rounded cursor-pointer transition-colors"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="text-white font-medium">{venue.name}</div>
                                                            <div className="text-gray-500 text-xs">{venue.address}</div>
                                                        </div>
                                                        <div className="text-sm text-orange-500">{venue.distance_km}km</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!isLoading && searchResults.length === 0 && fallbackVenues.length === 0 && (
                                    <div className="text-center text-gray-500">
                                        No results found for "{term}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex-[1.8] px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Date Range (From - To)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-500">📅</span>
                            {/* From Date */}
                            <div
                                className="relative flex items-center cursor-pointer min-w-[80px]"
                                onClick={() => triggerPicker(fromDateRef)}
                            >
                                <div className={`text-xs font-medium ${dateRange.from ? 'text-white' : 'text-gray-500'} pointer-events-none`}>
                                    {dateRange.from ? formatDate(dateRange.from) : 'Start Date'}
                                </div>
                                <input
                                    ref={fromDateRef}
                                    type="date"
                                    lang="en"
                                    value={dateRange.from}
                                    onChange={(e) => onDateChange({ ...dateRange, from: e.target.value })}
                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                />
                            </div>
                            <span className="text-gray-500">-</span>
                            {/* To Date */}
                            <div
                                className="relative flex items-center cursor-pointer min-w-[80px]"
                                onClick={() => triggerPicker(toDateRef)}
                            >
                                <div className={`text-xs font-medium ${dateRange.to ? 'text-white' : 'text-gray-500'} pointer-events-none`}>
                                    {dateRange.to ? formatDate(dateRange.to) : 'End Date'}
                                </div>
                                <input
                                    ref={toDateRef}
                                    type="date"
                                    lang="en"
                                    value={dateRange.to}
                                    onChange={(e) => onDateChange({ ...dateRange, to: e.target.value })}
                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location</label>
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500">📍</span>
                            <select
                                onChange={(e) => {
                                    onLocationChange(e.target.value);
                                    // Update coordinates based on city
                                    if (e.target.value === 'Ha Noi') {
                                        setUserLocation({ lat: 21.0285, lon: 105.8542 });
                                    } else if (e.target.value === 'Bac Ninh') {
                                        setUserLocation({ lat: 21.1862, lon: 106.0763 });
                                    }
                                }}
                                className="bg-transparent text-white font-medium focus:outline-none w-full"
                            >
                                <option value="Ha Noi">Ha Noi</option>
                                <option value="Bac Ninh">Bac Ninh</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-1 md:p-0">
                        <Button className="w-full md:w-auto py-3 md:py-0 md:px-8 md:h-full md:aspect-square" variant="primary">GO</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
