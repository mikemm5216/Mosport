// GPS 位置偵測 Hook
import { useState, useEffect } from 'react';

interface UserLocation {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
}

export const useUserLocation = () => {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. 讀取快取
        const cached = localStorage.getItem('user_location');
        if (cached) {
            try {
                setLocation(JSON.parse(cached));
                setLoading(false);
                return;
            } catch (e) {
                localStorage.removeItem('user_location');
            }
        }

        // 2. 請求瀏覽器定位
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setLocation(coords);
                    localStorage.setItem('user_location', JSON.stringify(coords));
                    setLoading(false);
                },
                (err) => {
                    console.warn('Geolocation failed:', err);
                    setError(err.message);
                    // Fallback: IP-based location
                    fetchLocationByIP();
                },
                { timeout: 10000, enableHighAccuracy: false }
            );
        } else {
            fetchLocationByIP();
        }
    }, []);

    const fetchLocationByIP = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const coords = {
                latitude: data.latitude,
                longitude: data.longitude,
                city: data.city,
                country: data.country_name
            };
            setLocation(coords);
            localStorage.setItem('user_location', JSON.stringify(coords));
        } catch (e) {
            console.error('IP geolocation failed:', e);
            setError('無法取得位置');
        } finally {
            setLoading(false);
        }
    };

    const requestLocation = () => {
        setLoading(true);
        setError(null);
        localStorage.removeItem('user_location');

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setLocation(coords);
                    localStorage.setItem('user_location', JSON.stringify(coords));
                    setLoading(false);
                },
                (err) => {
                    setError(err.message);
                    setLoading(false);
                }
            );
        }
    };

    return { location, loading, error, requestLocation };
};
