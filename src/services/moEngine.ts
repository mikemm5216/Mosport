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
        const [eventsData, venuesData] = await Promise.all([
            apiClient.getEvents({ city: locationFilter !== 'Near Current Loc' ? locationFilter : undefined }),
            apiClient.getVenues({ city: locationFilter !== 'Near Current Loc' ? locationFilter : undefined }),
        ]);

        // TODO: 將 API 資料轉換為前端格式
        // 目前先使用 Mock 資料進行計算
        console.log('API Data:', { events: eventsData, venues: venuesData });

        // 暫時 fallback 到 mock 資料
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
