import { DecisionSignal } from '../types';
import { apiClient } from './api';



/**
 * 從後端 API 取得賽事與場館資料，並計算 Decision Signals
 * Fallback 到 Mock 資料如果 API 失敗
 */
export const getDecisionSignals = async (locationFilter?: string): Promise<DecisionSignal[]> => {
    try {
        // 嘗試從真實 API 取得資料
        const [eventsData] = await Promise.all([
            apiClient.getEvents({ city: locationFilter !== 'Near Current Loc' ? locationFilter : undefined }) as Promise<any[]>,
            // Venue fetching removed as it was unused and causing build error
        ]);

        // Transform API data to DecisionSignal structure
        const signals: DecisionSignal[] = eventsData.map((e: any) => ({
            eventId: e.id,
            event: {
                id: e.id,
                title: e.title,
                league: e.league,
                sport: e.sport || 'Football', // Default to Football if missing
                startTime: new Date(e.start_time),
                teamA: e.team_a,
                teamB: e.team_b,
                isHot: e.status === 'live' // simple logic for now
            },
            matchedVenues: (e.venues || []).map((v: any) => {
                // Calculate a pseudo probability if not provided by backend yet
                // For now relying on verification status if available
                let prob = 0.5;
                if (v.verification_status === 'confirmed') prob = 1.0;
                else if (v.verification_status === 'authority') prob = 1.0;
                else if (v.verification_status === 'predicted') prob = 0.7;

                let status: 'VERIFIED' | 'ON_REQUEST' | 'UNVERIFIED' = 'UNVERIFIED';
                const vStatus = v.verification_status || '';

                if (vStatus === 'authority' || vStatus === 'confirmed') {
                    status = 'VERIFIED';
                } else if (vStatus === 'predicted') {
                    status = 'UNVERIFIED'; // or ON_REQUEST depending on logic
                }

                // Map backend VenueEvent structure to frontend Venue
                // Backend Schema: properties are inside 'venue' object due to VenueEvent nesting
                // But simplified if needed. "v" is VenueEventSchema
                const venueData = v.venue || {};

                return {
                    venue: {
                        id: venueData.id || v.venue_id,
                        name: venueData.name || 'Unknown Venue',
                        location: venueData.city || 'Unknown City',
                        distance: '2.5 km', // Placeholder/Calc
                        rating: venueData.qoe_score || 0,
                        imageUrl: 'https://images.unsplash.com/photo-1542396601-dca920ea2807?auto=format&fit=crop&q=80',
                        lastVerified: new Date(),
                        tags: [],
                        features: venueData.features || {}
                    },
                    matchProbability: prob,
                    verificationStatus: status
                };
            })
        }));

        console.log('Processed API Signals:', signals);

        // If API returned data, return it. Otherwise return empty.
        return signals;
    } catch (error) {
        console.error('Failed to fetch from API:', error);
        return [];
    }
};



