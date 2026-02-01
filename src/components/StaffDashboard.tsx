import { useState } from 'react';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';

interface Event {
    id: string;
    title: string;
    league: string;
    time: string;
    source: string;
    status: string;
}

export const StaffDashboard = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    // --- FEATURE 1: REALISTIC MOCK CRAWLER ---
    const handleTriggerScrape = () => {
        setIsScanning(true);

        // Simulate network delay for "Realism"
        setTimeout(() => {
            const simulatedNewEvents: Event[] = [
                { id: 'e1', title: 'Manchester City vs Arsenal', league: 'EPL', time: 'Today 20:00', source: 'FlashScore', status: 'DRAFT' },
                { id: 'e2', title: 'Lakers @ Warriors', league: 'NBA', time: 'Tomorrow 09:30', source: 'ESPN', status: 'DRAFT' },
                { id: 'e3', title: 'Vietnam vs Thailand', league: 'AFF Cup', time: 'Fri 19:00', source: 'Local News', status: 'DRAFT' }
            ];
            setEvents(prev => [...simulatedNewEvents, ...prev]);
            setIsScanning(false);
            alert("🕷️ AI Scrape Complete: 3 High-Priority Matches Found!");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-mosport-black pb-20">
            <div className="p-6 max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Staff Command Center</h1>

                {/* SECTION A: EVENT OPS */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Event Intelligence</CardTitle>
                        <Button
                            onClick={handleTriggerScrape}
                            disabled={isScanning}
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                        >
                            {isScanning ? '🕷️ Scanning Sources...' : '🕷️ Trigger AI Scrape'}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {events.length === 0 ? (
                                <p className="text-gray-500 text-sm">No new signals detected.</p>
                            ) : (
                                events.map(evt => (
                                    <div key={evt.id} className="flex items-center justify-between p-3 bg-black/40 rounded border border-white/5">
                                        <div>
                                            <div className="font-bold text-gray-200">{evt.title}</div>
                                            <div className="text-xs text-gray-400">{evt.league} • {evt.time}</div>
                                        </div>
                                        <Badge variant="warning">
                                            {evt.source}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION B: VENUE VERIFICATION (TIERED) */}
                <Card>
                    <CardHeader><CardTitle>Pending Verifications</CardTitle></CardHeader>
                    <CardContent>
                        {/* Mock Pending Venue */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-black/40 rounded">
                            <div>
                                <h3 className="font-bold text-white">The Moose & Roo</h3>
                                <p className="text-sm text-gray-400">Hanoi • Submitted 2h ago</p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button variant="outline" className="text-xs px-3 py-1 border-red-500 text-red-500 hover:bg-red-500/10">
                                    Reject
                                </Button>
                                <Button variant="secondary" className="text-xs px-3 py-1">
                                    List as Tier 2
                                </Button>
                                <Button className="text-xs px-3 py-1 bg-green-600 hover:bg-green-500">
                                    Verify Tier 1
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
