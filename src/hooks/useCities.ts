// 動態載入城市列表 + 距離計算
import { useState, useEffect } from 'react';

interface City {
    name: string;
    country: string;
    country_code: string;
    flag_emoji: string;
    venue_count: number;
    latitude: number;
    longitude: number;
    distance_km?: number;
    is_nearby?: boolean;
}

interface UserLocation {
    latitude: number;
    longitude: number;
}

export const useCities = (userLocation: UserLocation | null) => {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCities();
    }, [userLocation]);

    const fetchCities = async () => {
        setLoading(true);
        setError(null);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

            // 帶上用戶位置參數
            const params = new URLSearchParams();
            if (userLocation) {
                params.append('lat', userLocation.latitude.toString());
                params.append('lng', userLocation.longitude.toString());
            }

            const response = await fetch(`${API_URL}/cities?${params}`);

            if (!response.ok) {
                throw new Error('Failed to fetch cities');
            }

            const data = await response.json();
            setCities(data.cities || []);
        } catch (err) {
            console.error('Error fetching cities:', err);
            setError(err instanceof Error ? err.message : '載入城市失敗');

            // Fallback: 使用靜態資料
            setCities(getStaticCities());
        } finally {
            setLoading(false);
        }
    };

    return { cities, loading, error, refetch: fetchCities };
};

// Fallback 靜態城市資料
function getStaticCities(): City[] {
    return [
        {
            name: 'Ha Noi',
            country: 'Vietnam',
            country_code: 'VN',
            flag_emoji: '🇻🇳',
            venue_count: 12,
            latitude: 21.0285,
            longitude: 105.8542
        },
        {
            name: 'Bangkok',
            country: 'Thailand',
            country_code: 'TH',
            flag_emoji: '🇹🇭',
            venue_count: 9,
            latitude: 13.7563,
            longitude: 100.5018
        },
        {
            name: 'Taipei',
            country: 'Taiwan',
            country_code: 'TW',
            flag_emoji: '🇹🇼',
            venue_count: 5,
            latitude: 25.0330,
            longitude: 121.5654
        },
        {
            name: 'Singapore',
            country: 'Singapore',
            country_code: 'SG',
            flag_emoji: '🇸🇬',
            venue_count: 5,
            latitude: 1.3521,
            longitude: 103.8198
        },
        {
            name: 'Tokyo',
            country: 'Japan',
            country_code: 'JP',
            flag_emoji: '🇯🇵',
            venue_count: 15,
            latitude: 35.6762,
            longitude: 139.6503
        }
    ];
}
