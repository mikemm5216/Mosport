import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { VenueListRow } from '../../components/venue/VenueListRow';
import { apiClient } from '../../services/api';
import { UserRole } from '../../types';
import { Users, TrendingUp, Award, Activity } from 'lucide-react';

export const FanDashboard: React.FC = () => {
    const [favoriteVenues, setFavoriteVenues] = React.useState<any[]>([]);
    const [favoriteEvents, setFavoriteEvents] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await apiClient.getMyFavorites() as any;

                // 1. Process Venues
                if (data && data.venues) {
                    const formattedVenues = data.venues.map((item: any) => ({
                        id: item.venue.id,
                        name: item.venue.name,
                        city: item.venue.city,
                        dist: 'Saved',
                        rating: item.venue.rating || 4.5,
                        tags: item.venue.tags || [],
                        is_live: false,
                        verified: true,
                        is_saved_by_user: true,
                        matchData: null
                    }));
                    setFavoriteVenues(formattedVenues);
                }

                // 2. Process Events
                // Assuming API returns { events: [ { favorite_id, event: { ... } } ] }
                if (data && data.events) {
                    const formattedEvents = data.events.map((item: any) => ({
                        id: item.event.id,
                        title: item.event.title,
                        league: item.event.league,
                        startTime: item.event.startTime,
                        teamA: item.event.teamA,
                        teamB: item.event.teamB,
                        sport: item.event.sport
                    }));
                    setFavoriteEvents(formattedEvents);
                }

            } catch (error) {
                console.error('Failed to fetch favorites', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <DashboardLayout role={UserRole.FAN}>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back! 🎉</h1>
                    <p className="mt-1 text-gray-400">Discover upcoming matches and your favorite venues</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Mosport Points"
                        value="1,250"
                        change={15}
                        icon={<Award className="h-6 w-6" />}
                        color="yellow"
                        subtitle="Bronze Tier"
                    />
                    <StatCard
                        title="Saved Matches"
                        value="8"
                        icon={<Activity className="h-6 w-6" />}
                        color="blue"
                        subtitle="This week"
                    />
                    <StatCard
                        title="Favorite Venues"
                        value={favoriteVenues.length.toString()}
                        icon={<Users className="h-6 w-6" />}
                        color="green"
                    />
                    <StatCard
                        title="Check-ins"
                        value="23"
                        change={5}
                        icon={<TrendingUp className="h-6 w-6" />}
                        color="purple"
                        subtitle="This month"
                    />
                </div>

                {/* My Favorites Section */}
                <div>
                    {/* Saved Matches Section */}
                    <h2 className="text-2xl font-bold text-white mb-4">My Saved Matches 🏆</h2>
                    {loading ? (
                        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center text-gray-400 mb-8">
                            Loading matches...
                        </div>
                    ) : favoriteEvents.length > 0 ? (
                        <div className="space-y-4 mb-8">
                            {favoriteEvents.map(event => (
                                // Re-using DecisionCard or a simplified EventRow would be ideal.
                                // For now, let's create a simple card to list them, or if we have a component.
                                // We don't have a standalone 'EventRow', but DecisionCard is heavy.
                                // Let's verify if we can import DecisionCard safely. 
                                // Actually, `DecisionCard` expects a `DecisionSignal`. 
                                // We might need to construct a fake signal or just render a simple card.
                                // Let's render a simple card for now to verify data.
                                <div key={event.id} className="bg-mosport-card rounded-xl border border-gray-800 p-4 flex justify-between items-center hover:border-gray-700 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded">
                                                {event.league}
                                            </span>
                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-900/20 px-2 py-0.5 rounded border border-blue-900/30">
                                                📅 {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </span>
                                        </div>
                                        <h3 className="text-md font-bold text-white">
                                            {event.teamA} <span className="text-gray-500 mx-1">vs</span> {event.teamB}
                                        </h3>
                                    </div>
                                    <div>
                                        {/* We could add an 'Unsave' button here later */}
                                        <span className="text-2xl">❤️</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 opacity-70 mb-8">
                            <p className="text-gray-400 text-center py-8">
                                No saved matches yet.
                            </p>
                        </div>
                    )}

                    <h2 className="text-2xl font-bold text-white mb-4">My Favorite Venues ⭐</h2>
                    {loading ? (
                        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center text-gray-400">
                            Loading venues...
                        </div>
                    ) : favoriteVenues.length > 0 ? (
                        <div className="space-y-0">
                            {favoriteVenues.map(venue => (
                                <VenueListRow key={venue.id} venue={venue} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 opacity-70">
                            <p className="text-gray-400 text-center py-8">
                                No favorite venues yet. Go explore!
                            </p>
                        </div>
                    )}
                </div>

                {/* Nearby Venues Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Nearby Venues 📍</h2>
                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                        <p className="text-gray-400 text-center py-8">
                            附近正在轉播的場地將顯示在這裡
                        </p>
                    </div>
                </div>

                {/* My Wallet Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">My Wallet 💰</h2>
                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">My Vouchers</h3>
                                <p className="text-gray-400 text-sm">No active vouchers</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Recent Transactions</h3>
                                <p className="text-gray-400 text-sm">No recent activity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
