// Database Schema Type Definitions

import { UserRole } from '../types';

// ==================== Users ====================

export type UserTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
export type OAuthProvider = 'google' | 'facebook' | 'zalo';

export interface User {
    id: string;
    email: string;
    name?: string;
    pictureUrl?: string;
    role: UserRole;
    provider: OAuthProvider;
    providerId: string;
    mosportPoints: number;
    tier: UserTier;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== Venues ====================

export type VenueTier = 'verified' | 'unverified';

export interface Venue {
    id: string;
    ownerId: string;
    name: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    phone?: string;
    capacity?: number;
    facilities: string[];
    operatingHours: Record<string, string>;
    tier: VenueTier;
    photos: string[];
    avgRating: number;
    totalReviews: number;
    totalCheckIns: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== Events ====================

export interface Event {
    id: string;
    title: string;
    sport: string;
    league?: string;
    teamA?: string;
    teamB?: string;
    startTime: Date;
    endTime?: Date;
    isHot: boolean;
    totalFavorites: number;
    totalBroadcasts: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== Check-ins ====================

export interface CheckIn {
    id: string;
    userId: string;
    venueId: string;
    eventId: string;
    latitude: number;
    longitude: number;
    pointsEarned: number;
    checkedInAt: Date;
}

// ==================== Favorites ====================

export type FavoriteTargetType = 'event' | 'venue' | 'sport';

export interface Favorite {
    id: string;
    userId: string;
    targetType: FavoriteTargetType;
    targetId?: string;
    sport?: string;
    createdAt: Date;
}

// ==================== Vouchers ====================

export interface Voucher {
    id: string;
    venueId: string;
    userId: string;
    title: string;
    discount: string;
    qrCode: string;
    condition?: string;
    expiresAt: Date;
    redeemedAt?: Date;
    isRedeemed: boolean;
    createdAt: Date;
}

// ==================== Mosport Transactions ====================

export type TransactionType = 'check_in' | 'review' | 'favorite' | 'redeem';

export interface MosportTransaction {
    id: string;
    userId: string;
    type: TransactionType;
    pointsChange: number;
    description?: string;
    referenceId?: string;
    createdAt: Date;
}

// ==================== Promotions ====================

export type PromotionAudience = 'all' | 'favorites' | 'nearby';

export interface Promotion {
    id: string;
    venueId: string;
    title: string;
    condition?: string;
    discount: string;
    validFrom: Date;
    validUntil: Date;
    targetAudience: PromotionAudience;
    isActive: boolean;
    createdAt: Date;
}

// ==================== Broadcaster Sessions ====================

export type BroadcastStatus = 'LIVE' | 'OFF-AIR';

export interface BroadcasterSession {
    id: string;
    venueId: string;
    eventId: string;
    status: BroadcastStatus;
    signalStrength: number;
    liveAudience: number;
    startedAt: Date;
    endedAt?: Date;
}

// ==================== Analytics Types ====================

export interface UserFavorites {
    savedMatches: Event[];
    favoriteVenues: Venue[];
    favoriteSports: string[];
}

export interface UserWallet {
    mosportPoints: number;
    vouchers: Voucher[];
    checkInHistory: CheckIn[];
    tier: UserTier;
}

export interface VenueSchedule {
    recommendedMatches: Event[];
    confirmedBroadcasts: Event[];
    calendar: {
        date: Date;
        matches: Event[];
        estimatedCrowd: number;
    }[];
}

export interface PlatformKPI {
    users: {
        total: number;
        dau: number;
        mau: number;
        growth: {
            daily: number;
            weekly: number;
            monthly: number;
        };
    };
    venues: {
        total: number;
        active: number;
        verified: number;
        pending: number;
    };
    conversionFunnel: {
        appOpens: number;
        searches: number;
        checkIns: number;
        conversionRate: number;
    };
}

export interface EventAnalytics {
    topFavoritedMatches: {
        event: Event;
        favoritedBy: number;
        checkIns: number;
        venues: number;
    }[];
    sportDistribution: {
        sport: string;
        fans: number;
        percentage: number;
    }[];
    trendingMatches: {
        event: Event;
        growthRate: number;
    }[];
}

export interface VenuePerformance {
    topPopular: {
        venue: Venue;
        favoritedBy: number;
        avgRating: number;
    }[];
    topTraffic: {
        venue: Venue;
        weeklyCheckIns: number;
        growthRate: number;
    }[];
    topMarketing: {
        venue: Venue;
        vouchersIssued: number;
        redemptionRate: number;
        roi: number;
    }[];
}
