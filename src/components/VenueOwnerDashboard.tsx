import { useState } from 'react';
import { VenueAnalyticsCharts } from './VenueAnalyticsCharts';
import { Button } from './Button';
import { Switch } from './ui/Switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';

export const VenueOwnerDashboard = () => {
    const [isLive, setIsLive] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState('');

    return (
        <div className="min-h-screen bg-mosport-black pb-20">
            <div className="p-6 max-w-6xl mx-auto space-y-8">

                {/* HEADER: MY VENUE PROFILE */}
                <div className="flex flex-col md:flex-row gap-6">

                    {/* LEFT: PROFILE CARD */}
                    <div className="w-full md:w-1/3 bg-gray-900 border border-white/10 rounded-xl p-6">
                        <div className="aspect-video bg-gray-800 rounded mb-4 overflow-hidden relative">
                            <img
                                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80"
                                className="object-cover w-full h-full opacity-60"
                                alt="Venue"
                            />
                            <div className="absolute bottom-2 left-2 font-bold text-xl text-white">Puku Bar</div>
                        </div>
                        <Button variant="outline" className="w-full mb-2">Edit Details</Button>
                        <div className="text-xs text-gray-500 text-center">Tier 1 Verified • Hanoi</div>
                    </div>

                    {/* RIGHT: THE SIGNAL BROADCASTER (CRITICAL FEATURE) */}
                    <div className="w-full md:w-2/3 bg-neutral-950 border border-blue-500/30 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10 text-9xl font-black select-none text-white">LIVE</div>

                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            📡 Signal Broadcaster
                        </h2>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400">What are you showing right now?</label>
                                <Select onValueChange={setSelectedMatch} value={selectedMatch}>
                                    <SelectTrigger className="bg-neutral-800 border-white/10 text-white">
                                        <SelectValue placeholder="Select Upcoming Match..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-900 border-white/10">
                                        <SelectItem value="match_1">⚽ Vietnam vs Thailand (19:00)</SelectItem>
                                        <SelectItem value="match_2">🏀 Lakers vs Warriors (Live)</SelectItem>
                                        <SelectItem value="match_3">🏎️ F1 Singapore GP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between bg-red-950/30 border border-red-500/20 p-4 rounded-lg mt-4">
                                <div className="flex flex-col">
                                    <span className="font-bold text-red-500">BROADCAST STATUS</span>
                                    <span className="text-xs text-red-400/70">
                                        {isLive ? 'Your venue is ranked #1 in Hanoi Feed.' : 'You are currently offline in the feed.'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-bold ${isLive ? 'text-white' : 'text-gray-500'}`}>
                                        {isLive ? 'ON AIR' : 'OFF AIR'}
                                    </span>
                                    <Switch
                                        checked={isLive}
                                        onCheckedChange={setIsLive}
                                        className={isLive ? 'bg-red-600' : ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ANALYTICS SECTION */}
                <div className="pt-4">
                    <h2 className="text-xl font-bold text-white mb-4">Performance Analytics</h2>
                    <VenueAnalyticsCharts />
                </div>
            </div>
        </div>
    );
};
