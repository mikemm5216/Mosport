// Layer D: User Personas
export enum UserRole {
  FAN = 'FAN',      // #2E5296 - Data Consumer
  VENUE = 'VENUE',  // #D62470 - Signal Source
  STAFF = 'STAFF'   // #FFFFFF - Ground Truth
}

// Layer B: QoE (Quality of Experience)
export enum QoETagType {
  SURVIVAL = 'SURVIVAL', // Level 1: Open/Closed
  BROADCAST = 'BROADCAST', // Level 2: Has Signal
  VIBE = 'VIBE' // Level 3: Atmosphere
}

export interface QoETag {
  id: string;
  type: QoETagType;
  label: string; // e.g., "Big Screen", "Sound ON"
  confidence: number; // 0.0 to 1.0 (Confidence Interval)
}

// Layer A -> B: Raw Data to Entity
export interface Venue {
  id: string;
  name: string;
  location: string;
  distance?: string;
  rating: number; // 0-5
  tags: QoETag[];
  imageUrl: string;
  lastVerified: Date; // T-Minus check
  googleMapUrl?: string; // Optional: Direct link to specific map entity
}

export interface SportEvent {
  id: string;
  title: string;
  league: string;
  startTime: Date;
  teamA: string;
  teamB: string;
  isHot: boolean; // Triggers T-Minus high freq checks
}

// Layer C: Decision Output
// The Frontend only receives this "Signal", it doesn't know raw data logic.
export interface DecisionSignal {
  eventId: string;
  event: SportEvent;
  matchedVenues: {
    venue: Venue;
    matchProbability: number; // The Engine's output
    verificationStatus: 'VERIFIED' | 'ON_REQUEST' | 'UNVERIFIED';
  }[];
}