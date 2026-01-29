import { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { useUserLocation } from '../hooks/useUserLocation';
import { useCities } from '../hooks/useCities';
import { useSports } from '../hooks/useSports';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select";

interface DateRange {
    from: string;
    to: string;
}

interface SearchHeroProps {
    onSearch: (term: string) => void;
    onSportChange: (sport: string) => void;
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

export const SearchHero = ({ onSearch, onSportChange, onLocationChange, dateRange, onDateChange }: SearchHeroProps) => {
    const [term, setTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [trending, setTrending] = useState<TrendingData | null>(null);
    const [selectedSport, setSelectedSport] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    const fromDateRef = useRef<HTMLInputElement>(null);
    const toDateRef = useRef<HTMLInputElement>(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    // Hooks
    const { location, loading: locationLoading } = useUserLocation();
    const { cities, loading: citiesLoading } = useCities(location);
    const { sports, loading: sportsLoading } = useSports();

    // Fetch trending data
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/v1/search/trending`);
                const data = await res.json();
                setTrending(data);
            } catch (err) {
                console.error('Failed to fetch trending:', err);
                setTrending({
                    tags: ['football', 'basketball', 'sports bar', 'live events'],
                    events: []
                });
            }
        };
        fetchTrending();
    }, [apiUrl]);

    const triggerPicker = (ref: React.RefObject<HTMLInputElement>) => {
        if (ref.current) {
            try {
                // @ts-ignore
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


    // Tier 0 Strategy: Dynamic Sport Priority based on City
    const getPrioritySports = (city: string) => {
        const c = city.toLowerCase();
        if (c.includes('tokyo') || c.includes('japan')) return ['npb', 'mlb', 'j1_league', 'epl'];
        if (c.includes('seoul') || c.includes('korea')) return ['kbo', 'epl', 'mlb', 'esports']; // LCK is usually under esports
        if (c.includes('hanoi') || c.includes('ho chi minh') || c.includes('bangkok') || c.includes('thai') || c.includes('vietnam')) return ['epl', 'nba', 'f1'];
        if (c.includes('taipei') || c.includes('taiwan')) return ['cpbl', 'mlb', 'npb', 'nba'];
        return ['epl', 'nba', 'f1']; // Default Global Priority
    };

    const prioritizedSports = [...sports].sort((a, b) => {
        // Use selectedLocation or fallback to detected location city if available (simplified here to selectedLocation)
        // In a real app, we'd map GPS lat/lng to city name if selectedLocation is empty
        const currentCity = selectedLocation || 'Global';
        const priorities = getPrioritySports(currentCity);

        const indexA = priorities.indexOf(a.id);
        const indexB = priorities.indexOf(b.id);

        // If both are in priority list, sort by index
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only A is in list, it comes first
        if (indexA !== -1) return -1;
        // If only B is in list, it comes first
        if (indexB !== -1) return 1;

        // Default sort by event count (already sorted from backend, so keep order)
        return 0;
    });

    // Group cities by country
    const groupedCities = cities.reduce((acc, city) => {
        if (!acc[city.country]) {
            acc[city.country] = [];
        }
        acc[city.country].push(city);
        return acc;
    }, {} as Record<string, typeof cities>);

    const nearbyCities = cities.filter(c => c.is_nearby);

    return (
        <div className="relative border-b border-gray-800 bg-mosport-card/50">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 sm:px-6 lg:px-8 relative z-10">
                <h1 className="text-xl sm:text-3xl font-bold text-center mb-4 md:mb-6 text-white tracking-tight">
                    Find Your Game, <span className="text-gray-500">Anywhere.</span>
                </h1>

                {/* 4 Filters */}
                <div className="max-w-6xl mx-auto bg-mosport-dark border border-gray-700 rounded-xl p-1 md:p-2 flex flex-col md:flex-row gap-1 md:gap-2 shadow-2xl">

                    {/* 1. Search Box */}
                    <div className="flex-[1.5] px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700 relative">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Search</label>
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
                            placeholder="Teams, Leagues or Events"
                            className="w-full bg-transparent text-white font-medium focus:outline-none placeholder-gray-600"
                        />

                        {/* Trending dropdown */}
                        {isFocused && !term && trending && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-mosport-dark border border-gray-700 rounded-lg p-4 shadow-xl z-50 max-w-md">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-2">🔥 Trending</div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {trending.tags.slice(0, 8).map((tag, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setTerm(tag);
                                                onSearch(tag);
                                                setIsFocused(false);
                                            }}
                                            className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-full text-sm transition-colors"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Sport Type */}
                    <div className="flex-1 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sport Type</label>
                        <div className="flex items-center gap-2 w-full">
                            <Select
                                value={selectedSport}
                                onValueChange={(val: string) => {
                                    setSelectedSport(val);
                                    onSportChange(val);
                                }}
                                disabled={sportsLoading}
                            >
                                <SelectTrigger className="w-full bg-[#1a1a1a] border-blue-500/30 text-gray-200 hover:border-blue-400 focus:ring-blue-500 rounded-md h-auto py-2">
                                    <SelectValue placeholder="All Sports" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a1a] border-blue-500/20 text-gray-300 shadow-lg shadow-blue-900/20 rounded-md">
                                    <SelectItem value="all" className="focus:bg-blue-900/30 focus:text-white cursor-pointer">
                                        All Sports
                                    </SelectItem>
                                    {prioritizedSports.map(sport => (
                                        <SelectItem key={sport.id} value={sport.id} className="focus:bg-blue-900/30 focus:text-white cursor-pointer">
                                            {sport.icon} {sport.name} ({sport.event_count})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 3. Date Range */}
                    <div className="flex-[1.8] px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Date Range</label>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-500">📅</span>
                            <div
                                className="relative flex items-center cursor-pointer min-w-[80px]"
                                onClick={() => triggerPicker(fromDateRef)}
                            >
                                <div className={`text-xs font-medium ${dateRange.from ? 'text-white' : 'text-gray-500'} pointer-events-none`}>
                                    {dateRange.from ? formatDate(dateRange.from) : 'Start'}
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
                            <div
                                className="relative flex items-center cursor-pointer min-w-[80px]"
                                onClick={() => triggerPicker(toDateRef)}
                            >
                                <div className={`text-xs font-medium ${dateRange.to ? 'text-white' : 'text-gray-500'} pointer-events-none`}>
                                    {dateRange.to ? formatDate(dateRange.to) : 'End'}
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

                    {/* 4. Location */}
                    <div className="flex-1 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location</label>
                        <div className="flex items-center gap-2 w-full">
                            <span className="text-orange-500 whitespace-nowrap">📍</span>
                            <Select
                                value={selectedLocation}
                                onValueChange={(val: string) => {
                                    setSelectedLocation(val);
                                    onLocationChange(val);
                                }}
                                disabled={citiesLoading}
                            >
                                <SelectTrigger className="w-full bg-transparent border-none text-white font-medium focus:ring-0 focus:ring-offset-0 px-0 h-auto py-0 shadow-none hover:bg-transparent data-[placeholder]:text-white">
                                    <SelectValue placeholder={locationLoading ? 'Locating...' : 'All Locations'} />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a1a] border-blue-500/20 text-gray-300 shadow-lg shadow-blue-900/20 rounded-md">
                                    <SelectItem value="all" className="focus:bg-blue-900/30 focus:text-white cursor-pointer">
                                        {locationLoading ? 'Locating...' : 'All Locations'}
                                    </SelectItem>

                                    {/* Nearby Cities */}
                                    {nearbyCities.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel className="text-gray-500 text-xs px-2 py-1">📍 Nearby</SelectLabel>
                                            {nearbyCities.map(city => (
                                                <SelectItem key={city.name} value={city.name} className="focus:bg-blue-900/30 focus:text-white cursor-pointer">
                                                    {city.flag_emoji} {city.name} ({city.distance_km}km)
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}

                                    {/* Group by Country */}
                                    {Object.entries(groupedCities).map(([country, citiesList]) => (
                                        <SelectGroup key={country}>
                                            <SelectLabel className="text-gray-500 text-xs px-2 py-1">{citiesList[0].flag_emoji} {country}</SelectLabel>
                                            {citiesList.filter(c => !c.is_nearby).map(city => (
                                                <SelectItem key={city.name} value={city.name} className="focus:bg-blue-900/30 focus:text-white cursor-pointer">
                                                    {city.name} {city.distance_km && `(${city.distance_km}km)`}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* GO 按鈕 */}
                    <div className="p-1 md:p-0">
                        <Button className="w-full md:w-auto py-3 md:py-0 md:px-8 md:h-full md:aspect-square" variant="primary">GO</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
