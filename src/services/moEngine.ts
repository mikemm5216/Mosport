import { MOCK_EVENTS, MOCK_VENUES } from '../constants';
import { DecisionSignal, QoETagType, SportEvent, Venue } from '../types';
import { apiClient } from './api';

const calculateMatchProbability = (event: SportEvent, venue: Venue) => {
    let score = 0.5;
    const hoursSinceVerify = (Date.now() - venue.lastVerified.getTime()) / (1000 * 60 * 60);

    if (hoursSinceVerify < 2) score += 0.3;
    else if (hoursSinceVerify < 24) score += 0.1;
    else score -= 0.1;

    const hasBigScreen = venue.tags.some(t => t.type === QoETagType.BROADCAST);
    const hasVibe = venue.tags.some(t => t.type === QoETagType.VIBE);

    if (hasBigScreen) score += 0.15;
    if (hasVibe) score += 0.05;

    const varianceString = event.id + venue.id;
    const varianceScore = (varianceString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20) / 100;
    score += varianceScore;

    return Math.min(Math.max(score, 0), 1);
};

const determineVerificationStatus = (prob: number) => {
    if (prob >= 0.85) return 'VERIFIED';
    if (prob >= 0.6) return 'ON_REQUEST';
    return 'UNVERIFIED';
};

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

        // If API returned data, return it. Otherwise fallback.
        if (signals.length > 0) {
            return signals;
        }

        // Fallback to mock if API returns empty (e.g. no events in DB yet)
        return getMockDecisionSignals(locationFilter);
    } catch (error) {
        console.warn('Failed to fetch from API, using mock data:', error);
        return getMockDecisionSignals(locationFilter);
    }
};

/**
 * Mock 資料處理（原有邏輯）
 */
const getMockDecisionSignals = async (locationFilter?: string): Promise<DecisionSignal[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const venueUsageCounter: Record<string, number> = {};

    const filteredVenues = locationFilter && locationFilter !== 'Near Current Loc'
        ? MOCK_VENUES.filter(v => v.location === locationFilter)
        : MOCK_VENUES;

    const signals = MOCK_EVENTS.map(event => {
        const matches = filteredVenues.map(venue => {
            let prob = calculateMatchProbability(event, venue);
            const usagePenalty = (venueUsageCounter[venue.id] || 0) * 0.15;
            prob = Math.max(0, prob - usagePenalty);

            return {
                venue,
                matchProbability: prob,
                verificationStatus: determineVerificationStatus(prob) as 'VERIFIED' | 'ON_REQUEST' | 'UNVERIFIED'
            };
        }).sort((a, b) => b.matchProbability - a.matchProbability);

        matches.slice(0, 3).forEach(match => {
            venueUsageCounter[match.venue.id] = (venueUsageCounter[match.venue.id] || 0) + 1;
        });

        return {
            eventId: event.id,
            event,
            matchedVenues: matches
        };
    });

    return signals;
};
