
// src/lib/venue-images.ts

const VIBE_IMAGE_MAP: Record<string, string[]> = {
    'hanoi': [
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1574602305307-b3b3a602319e?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80'
    ],
    'bac ninh': [
        'https://images.unsplash.com/photo-1510000000000?auto=format&fit=crop&w=400&q=80', // Placeholder pattern from generator
        'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80'
    ],
    'tokyo': [
        'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1552332386-f8dd00d59143?auto=format&fit=crop&w=400&q=80'
    ],
    'osaka': [
        'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80'
    ],
    'bangkok': [
        'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=400&q=80', // Party vibe
        'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=400&q=80', // Crowded pub
        'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80', // Sports focus
        'https://images.unsplash.com/photo-1542396601-dca920ea2807?auto=format&fit=crop&w=400&q=80', // Screens
        'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=400&q=80', // Neon
    ],
    'singapore': [
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80', // Rooftop/High end
        'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=400&q=80', // Lounge
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80', // Outdoor classy
        'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=400&q=80', // Craft beer
        'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=400&q=80', // Modern
    ],
    'taipei': [
        'https://images.unsplash.com/photo-1552332386-f8dd00d59143?auto=format&fit=crop&w=400&q=80', // Cozy classic
        'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=400&q=80', // Dark moody
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80', // Pool table
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80', // Bar counter
        'https://images.unsplash.com/photo-1574602305307-b3b3a602319e?auto=format&fit=crop&w=400&q=80', // Warm light
    ],
    // Fallback for general western chains or unknown cities
    'default': [
        'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80' // Ensure at least one default exists
    ]
};

/**
 * Deterministically gets a vibe image based on venue ID (so it doesn't change on refresh)
 * or Randomly if preferred.
 */
export const getVibeImage = (city: string | null): string => {
    const key = city?.toLowerCase() || 'default';
    const pool = VIBE_IMAGE_MAP[key] || VIBE_IMAGE_MAP['default'];

    // Returns a random image from the pool
    return pool[Math.floor(Math.random() * pool.length)];
};
