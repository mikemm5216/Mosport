/**
 * API Client for Mosport Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    // Events
    async getEvents(params?: { city?: string; sport?: string; from?: string; to?: string }) {
        const query = new URLSearchParams(params as any).toString();
        return this.request(`/events${query ? `?${query}` : ''}`);
    }

    async getEvent(id: string) {
        return this.request(`/events/${id}`);
    }

    // Venues
    async getVenues(params?: { city?: string }) {
        const query = new URLSearchParams(params as any).toString();
        return this.request(`/venues${query ? `?${query}` : ''}`);
    }

    async getVenue(id: string) {
        return this.request(`/venues/${id}`);
    }

    async createVenue(data: any) {
        return this.request('/venues', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Auth
    async handleOAuthCallback(data: { code: string; provider: string; role: string }) {
        return this.request('/auth/callback', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST',
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    // ==================== Dashboard Features ====================

    // Favorites
    async createFavorite(data: { target_type: string; target_id?: string; sport?: string }) {
        return this.request('/favorites', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteFavorite(favoriteId: string) {
        return this.request(`/favorites/${favoriteId}`, {
            method: 'DELETE',
        });
    }

    async getMyFavorites() {
        return this.request('/favorites/me');
    }

    async checkIsFavorited(targetType: string, targetId: string) {
        return this.request(`/favorites/check/${targetType}/${targetId}`);
    }

    // Check-ins
    async createCheckIn(data: { venue_id: string; latitude: number; longitude: number; event_id?: string }) {
        return this.request('/checkins', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getMyCheckIns(limit: number = 50) {
        return this.request(`/checkins/me?limit=${limit}`);
    }

    async getCheckInStats() {
        return this.request('/checkins/stats');
    }

    // Analytics (Admin)
    async getPlatformKPI() {
        return this.request('/analytics/platform-kpi');
    }

    async getEventRankings(limit: number = 10) {
        return this.request(`/analytics/event-rankings?limit=${limit}`);
    }

    async getVenuePerformance(limit: number = 10) {
        return this.request(`/analytics/venue-performance?limit=${limit}`);
    }

    async getSportDistribution() {
        return this.request('/analytics/sport-distribution');
    }
}

export const apiClient = new ApiClient();

