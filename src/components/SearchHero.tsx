import { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { useUserLocation } from '../hooks/useUserLocation';
import { useCities } from '../hooks/useCities';
import { useSports } from '../hooks/useSports';

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

                {/* 4 個篩選器 */}
                <div className="max-w-6xl mx-auto bg-mosport-dark border border-gray-700 rounded-xl p-1 md:p-2 flex flex-col md:flex-row gap-1 md:gap-2 shadow-2xl">

                    {/* 1. 搜尋框 */}
                    <div className="flex-[1.5] px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700 relative">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">搜尋</label>
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
                            placeholder="球隊、聯賽或賽事"
                            className="w-full bg-transparent text-white font-medium focus:outline-none placeholder-gray-600"
                        />

                        {/* Trending dropdown */}
                        {isFocused && !term && trending && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-mosport-dark border border-gray-700 rounded-lg p-4 shadow-xl z-50 max-w-md">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-2">🔥 熱門搜尋</div>
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

                    {/* 2. 運動類型（動態） */}
                    <div className="flex-1 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">運動類型</label>
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedSport}
                                onChange={(e) => {
                                    setSelectedSport(e.target.value);
                                    onSportChange(e.target.value);
                                }}
                                className="bg-transparent text-white font-medium focus:outline-none w-full"
                                disabled={sportsLoading}
                            >
                                <option value="">所有運動</option>
                                {sports.map(sport => (
                                    <option key={sport.id} value={sport.id}>
                                        {sport.icon} {sport.name} ({sport.event_count})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 3. 日期範圍（保留） */}
                    <div className="flex-[1.8] px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">日期範圍</label>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-500">📅</span>
                            <div
                                className="relative flex items-center cursor-pointer min-w-[80px]"
                                onClick={() => triggerPicker(fromDateRef)}
                            >
                                <div className={`text-xs font-medium ${dateRange.from ? 'text-white' : 'text-gray-500'} pointer-events-none`}>
                                    {dateRange.from ? formatDate(dateRange.from) : '開始'}
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
                                    {dateRange.to ? formatDate(dateRange.to) : '結束'}
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

                    {/* 4. 地點（GPS 動態） */}
                    <div className="flex-1 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-700">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">地點</label>
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500">📍</span>
                            <select
                                value={selectedLocation}
                                onChange={(e) => {
                                    setSelectedLocation(e.target.value);
                                    onLocationChange(e.target.value);
                                }}
                                className="bg-transparent text-white font-medium focus:outline-none w-full text-sm"
                                disabled={citiesLoading}
                            >
                                <option value="">
                                    {locationLoading ? '偵測位置中...' : '所有地點'}
                                </option>

                                {/* 附近城市 */}
                                {nearbyCities.length > 0 && (
                                    <optgroup label="📍 附近">
                                        {nearbyCities.map(city => (
                                            <option key={city.name} value={city.name}>
                                                {city.flag_emoji} {city.name} ({city.distance_km}km)
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {/* 按國家分組 */}
                                {Object.entries(groupedCities).map(([country, citiesList]) => (
                                    <optgroup key={country} label={`${citiesList[0].flag_emoji} ${country}`}>
                                        {citiesList.filter(c => !c.is_nearby).map(city => (
                                            <option key={city.name} value={city.name}>
                                                {city.name} {city.distance_km && `(${city.distance_km}km)`}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
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
