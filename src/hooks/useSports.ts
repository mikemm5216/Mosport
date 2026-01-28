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
            name: '足球',
            icon: '⚽',
            event_count: 25
        },
        {
            id: 'basketball',
            name: '籃球',
            icon: '🏀',
            event_count: 8
        },
        {
            id: 'american-football',
            name: '美式足球',
            icon: '🏈',
            event_count: 5
        },
        {
            id: 'rugby',
            name: '橄欖球',
            icon: '🏉',
            event_count: 3
        }
    ];
}
