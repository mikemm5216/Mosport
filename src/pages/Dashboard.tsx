import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_VERSION } from '../constants';
import { DecisionSignal, UserRole } from '../types';
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
    // ... existing ...

    onSortChange = { setSortBy }
        />
            )}

<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8 safe-bottom">

    {/* V6.2 WBC Campaign Banner */}
    {currentRole === UserRole.FAN && (
        <MajorEventBanner
            eventName="WBC 2026: Taipei Pool"
            hypeText="Team Taiwan 🇹🇼 takes on the world! Catch every strike live at validated audio-enabled venues."
            ctaText="Find Official Parties"
            onCtaClick={() => {
                setSearchTerm('WBC');
                setSportFilter('Baseball');
            }}
        />
    )}

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

                return displaySignals.length > 0 ? (
                    displaySignals.map(signal => (
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
                );
            })()}
        </div>
    )}
</main>

{/* AuthModal for Lazy Login */ }
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
        </div >
    );
};
