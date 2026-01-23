import { useState, useRef } from 'react';
import { Button } from './Button';

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

export const SearchHero = ({ onSearch, onLocationChange, dateRange, onDateChange }: SearchHeroProps) => {
    const [term, setTerm] = useState('');
    const fromDateRef = useRef<HTMLInputElement>(null);
    const toDateRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTerm(val);
        onSearch(val);
    };

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
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white tracking-tight">
                    Find Your Game, <span className="text-gray-500">Anywhere.</span>
                </h1>
                <div className="max-w-4xl mx-auto bg-mosport-dark border border-gray-700 rounded-xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl">
                    <div className="flex-[1.5] px-4 py-2 border-b md:border-b-0 md:border-r border-gray-700">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">I want to watch</label>
                        <input
                            type="text"
                            value={term}
                            onChange={(e) => {
                                const val = e.target.value;
                                setTerm(val);
                                onSearch(val);
                            }}
                            placeholder="Team, League, or Event?"
                            className="w-full bg-transparent text-white font-medium focus:outline-none placeholder-gray-600"
                        />
                    </div>
                    <div className="flex-[1.8] px-4 py-2 border-b md:border-b-0 md:border-r border-gray-700">
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
                    <div className="flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-700">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location</label>
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500">📍</span>
                            <select
                                onChange={(e) => onLocationChange(e.target.value)}
                                className="bg-transparent text-white font-medium focus:outline-none w-full"
                            >
                                <option value="Ha Noi">Ha Noi</option>
                                <option value="Bac Ninh">Bac Ninh</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-1">
                        <Button className="w-full md:w-auto h-full aspect-square" variant="primary">GO</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
