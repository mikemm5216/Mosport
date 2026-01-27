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
}

export const apiClient = new ApiClient();
