// 動態載入運動類型
import { useState, useEffect } from 'react';

interface Sport {
    id: string;
    name: string;
    icon: string;
    event_count: number;
}

export const useSports = () => {
    const [sports, setSports] = useState<Sport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        setLoading(true);
        setError(null);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
            const response = await fetch(`${API_URL}/sports`);

            if (!response.ok) {
                throw new Error('Failed to fetch sports');
            }

            const data = await response.json();
            setSports(data.sports || []);
        } catch (err) {
            console.error('Error fetching sports:', err);
            setError(err instanceof Error ? err.message : '載入運動類型失敗');

            // Fallback: 使用靜態資料
            setSports(getStaticSports());
        } finally {
            setLoading(false);
        }
    };

    return { sports, loading, error, refetch: fetchSports };
};

// Fallback 靜態運動類型資料
function getStaticSports(): Sport[] {
    return [
        {
            id: 'football',
            name: 'Football',
            icon: '⚽',
            event_count: 25
        },
        {
            id: 'basketball',
            name: 'Basketball',
            icon: '🏀',
            event_count: 8
        },
        {
            id: 'baseball',
            name: 'Baseball',
            icon: '⚾',
            event_count: 6
        },
        {
            id: 'f1',
            name: 'F1 Racing',
            icon: '🏎️',
            event_count: 4
        },
        {
            id: 'tennis',
            name: 'Tennis',
            icon: '🎾',
            event_count: 3
        },
        {
            id: 'american-football',
            name: 'American Football',
            icon: '🏈',
            event_count: 5
        },
        {
            id: 'rugby',
            name: 'Rugby',
            icon: '🏉',
            event_count: 5
        },
        {
            id: 'mma',
            name: 'MMA / UFC',
            icon: '🥊',
            event_count: 4
        },
        {
            id: 'golf',
            name: 'Golf',
            icon: '⛳',
            event_count: 2
        },
        {
            id: 'cricket',
            name: 'Cricket',
            icon: '🏏',
            event_count: 6
        },
        {
            id: 'esports',
            name: 'Esports',
            icon: '🎮',
            event_count: 10
        }
    ];
}
