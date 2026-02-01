import { VenueListRow } from '../components/venue/VenueListRow';
import { AuthModal } from '../components/AuthModal';
import { useLoginModal } from '../stores/useLoginModal';
import { useAuthStore } from '../stores/useAuthStore';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';

// Mock data with AI Match Intelligence
const mockVenues = [
    {
        id: 'v1',
        name: 'The Highlander Pub',
        city: 'Hanoi',
        dist: '1.2 km',
        rating: 4.8,
        tags: ['Big Screen', '4K Quality', 'Late Night'],
        is_live: true,
        verified: true,
        is_saved_by_user: false,
        matchData: {
            eventName: 'Manchester City vs Arsenal',
            hypeText: 'Title decider! Top 2 clash in the race for Premier League glory.',
            h2hRecord: 'Last 5: City 3W, Arsenal 1W, 1D',
            newsLink: 'https://www.bbc.com/sport/football'
        }
    },
    {
        id: 'v2',
        name: 'Puku Sports Bar',
        city: 'Ho Chi Minh',
        dist: '0.8 km',
        rating: 4.6,
        tags: ['Pool Table', 'Craft Beer', 'WiFi'],
        is_live: false,
        verified: true,
        is_saved_by_user: true,
        matchData: {
            eventName: 'Lakers @ Warriors',
            hypeText: 'Western Conference showdown! LeBron returns to Chase Center.',
            h2hRecord: 'This season: Warriors 1-0',
            newsLink: 'https://www.espn.com/nba'
        }
    },
    {
        id: 'v3',
        name: 'The Republic Sports Cafe',
        city: 'Bangkok',
        dist: '2.5 km',
        rating: 4.4,
        tags: ['Rooftop', 'Happy Hour', 'Thai Food'],
        is_live: false,
        verified: false,
        is_saved_by_user: false,
        matchData: null
    }
];

export const VenueListDemo = () => {
    const { isOpen, closeLoginModal, onSuccessCallback } = useLoginModal();
    const { setUser, setGuest } = useAuthStore();
    const navigate = useNavigate();

    const handleLoginAs = (role: UserRole) => {
        setGuest(role);
        closeLoginModal();

        // Execute success callback if exists (from Heart button click)
        if (onSuccessCallback) {
            onSuccessCallback();
        }
    };

    return (
        <div className="min-h-screen bg-mosport-black p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Mosport Venue List</h1>
                <p className="text-gray-400 mb-8">RemoteOK-style list with AI Match Intelligence</p>

                <div className="space-y-0">
                    {mockVenues.map(venue => (
                        <VenueListRow key={venue.id} venue={venue} />
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-950/20 border border-blue-500/30 rounded-xl">
                    <h3 className="text-sm font-bold text-blue-300 mb-2">🧪 Demo Features</h3>
                    <ul className="text-xs text-gray-300 space-y-1">
                        <li>• <strong>LIVE Status</strong>: First venue shows live match with red border & pulsing badge</li>
                        <li>• <strong>Match Scoop</strong>: AI-generated hype text, H2H records, and news links</li>
                        <li>• <strong>Lazy Login</strong>: Click ❤️ button to test login modal (works when not logged in)</li>
                        <li>• <strong>Responsive</strong>: Mobile-first design, adapts to all screen sizes</li>
                    </ul>
                </div>
            </div>

            {/* AuthModal Integration */}
            <AuthModal
                isOpen={isOpen}
                onClose={closeLoginModal}
                onLoginAs={handleLoginAs}
            />
        </div>
    );
};
