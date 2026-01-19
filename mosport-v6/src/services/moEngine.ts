import { MOCK_EVENTS, MOCK_VENUES } from '../constants';
import { DecisionSignal, QoETagType, SportEvent, Venue } from '../types';

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

export const getDecisionSignals = async (locationFilter?: string): Promise<DecisionSignal[]> => {
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
