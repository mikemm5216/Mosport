import { MOCK_EVENTS, MOCK_VENUES } from '../constants';
import { DecisionSignal, SportEvent, Venue, QoETagType } from '../types';

/**
 * Layer B: The Mo Engine
 * 
 * Core Principle: Frontend Ignorance.
 * The UI does not calculate probabilities. It asks the Engine for "Signals".
 */

// Simulates the "Compare-only" Cache
const decisionCache: Map<string, DecisionSignal> = new Map();

/**
 * Logic to calculate Confidence Interval based on Verification Time and Tags
 */
const calculateMatchProbability = (event: SportEvent, venue: Venue): number => {
  let score = 0.5; // Base probability

  // T-Minus Verification Logic
  const hoursSinceVerify = (Date.now() - venue.lastVerified.getTime()) / (1000 * 60 * 60);
  
  // If verified recently (Active Signal)
  if (hoursSinceVerify < 2) score += 0.3;
  else if (hoursSinceVerify < 24) score += 0.1;
  else score -= 0.1;

  // QoE Tag Logic (Level 2 & 3)
  const hasBigScreen = venue.tags.some(t => t.type === QoETagType.BROADCAST);
  const hasVibe = venue.tags.some(t => t.type === QoETagType.VIBE);

  if (hasBigScreen) score += 0.15;
  if (hasVibe) score += 0.05;

  // VARIANCE: Add a deterministic random jitter based on Event ID + Venue ID
  // This ensures different events surface different "Best" venues for the demo.
  // In a real engine, this would be based on "Venue Schedule Affinity".
  const varianceString = event.id + venue.id;
  const varianceScore = (varianceString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20) / 100; // 0.00 to 0.20
  score += varianceScore;

  return Math.min(Math.max(score, 0), 1); // Clamp 0-1
};

const determineVerificationStatus = (prob: number): 'VERIFIED' | 'ON_REQUEST' | 'UNVERIFIED' => {
  if (prob >= 0.85) return 'VERIFIED';
  if (prob >= 0.6) return 'ON_REQUEST';
  return 'UNVERIFIED';
};

/**
 * MAIN PUBLIC API for Layer D
 * Returns actionable Decision Signals
 */
export const getDecisionSignals = async (): Promise<DecisionSignal[]> => {
  // Simulate network delay for "Real-time" feel
  await new Promise(resolve => setTimeout(resolve, 600));

  // "Feed Fairness" Logic:
  // Track how many times a venue has appeared in the top 3 slots across the generated list.
  // This prevents the same 4.8-star venue from dominating every single event card.
  const venueUsageCounter: Record<string, number> = {};

  const signals: DecisionSignal[] = MOCK_EVENTS.map(event => {
    // Generate matches
    const matches = MOCK_VENUES.map(venue => {
      let prob = calculateMatchProbability(event, venue);

      // PENALTY:
      // If this venue has already been a top recommendation for previous events in this batch,
      // apply a small penalty to its score for this event.
      // 0.15 penalty (15%) per previous appearance.
      const usagePenalty = (venueUsageCounter[venue.id] || 0) * 0.15;
      prob = Math.max(0, prob - usagePenalty);

      return {
        venue,
        matchProbability: prob,
        verificationStatus: determineVerificationStatus(prob)
      };
    }).sort((a, b) => b.matchProbability - a.matchProbability);

    // Update usage counters for the top 3 winners of this event
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