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
    rating: number;
    imageUrl: string;
    lastVerified: Date;
    googleMapUrl?: string; // Optional direct map link
    tags: QoETag[];
}

export interface SportEvent {
    id: string;
    title: string;
    league: string;
    startTime: Date;
    teamA: string;
    teamB: string;
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
