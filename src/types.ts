export enum UserRole {
    FAN = 'FAN',
    VENUE = 'VENUE',
    STAFF = 'STAFF'
}

export enum QoETagType {
    SURVIVAL = 'SURVIVAL',
    BROADCAST = 'BROADCAST',
    VIBE = 'VIBE'
}

export interface QoETag {
    id: string;
    type: QoETagType;
    label: string;
    confidence: number;
}

export interface Venue {
    id: string;
    name: string;
    location: string;
    distance: string;
    latitude?: number;
    longitude?: number;
    rating: number;
    imageUrl: string;
    lastVerified: Date;
    googleMapUrl?: string; // Optional direct map link
    tags: QoETag[];
    features: VenueFeatures; // V6.5 Data Architecture
}

export interface VenueFeatures {
    broadcast_capabilities?: {
        supported_leagues: string[];
        special_hours: {
            open_early_for_nba: boolean;
            open_early_for_nfl: boolean;
            open_late_for_ucl: boolean;
        };
        amenities: {
            breakfast_available: boolean;
            audio_priority: string;
        };
    };
}

export interface SportEvent {
    id: string;
    title: string;
    league: string;
    startTime: Date;
    teamA: string;
    teamB: string;
    sport: string;
    isHot: boolean;
}

export interface DecisionSignal {
    eventId: string;
    event: SportEvent;
    matchedVenues: {
        venue: Venue;
        matchProbability: number;
        verificationStatus: 'VERIFIED' | 'ON_REQUEST' | 'UNVERIFIED';
    }[];
}
