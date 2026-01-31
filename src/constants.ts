import { QoETagType, UserRole, Venue } from './types';

export const APP_NAME = "MOSPORT";
export const APP_VERSION = "V7.0 Beta (Standalone)";
export const FALLBACK_VENUE_IMAGE = "https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80";

const generateBacNinhVenues = () => {
    const names = [
        "Bac Ninh Sports Zone", "Kinh Bac Arena", "Tu Son Goal Bar", "V-Pub Bac Ninh", "The 99 Club",
        "Bac Ninh Victory", "Red River Taproom", "Lim Stadium Cafe", "Dabaco Sports Lounge", "Phoenix Bar",
        "Bac Ninh Corner", "Green Field Pub", "Scoreboard BN", "Halftime Bac Ninh", "Penalty Spot BN",
        "Ultra Fan Zone", "Bac Ninh Brew", "Goal Line Cafe", "Striker's Den", "Defender's Pub",
        "Midfield Lounge", "Winger's Bar", "Keeper's Castle", "The Whistle Stop", "Extra Time BN",
        "Shootout Lounge", "Trophy Room BN", "Champions Corner", "League Leader", "Relegation Battle Bar"
    ];

    return names.map((name, idx) => ({
        id: `bn${idx}`,
        name: name,
        location: 'Bac Ninh',
        distance: `${(Math.random() * 10 + 20).toFixed(1)} km`,
        rating: 4.0 + (Math.random() * 0.9),
        imageUrl: `https://images.unsplash.com/photo-${1510000000000 + idx}?auto=format&fit=crop&w=400&q=80`,
        lastVerified: new Date(),
        googleMapUrl: 'https://maps.google.com/?q=Bac+Ninh',
        tags: [
            { id: `tbn${idx}`, type: QoETagType.BROADCAST, label: 'Live Match', confidence: 0.95 }
        ]
    }));
};

export const MOCK_VENUES: Venue[] = [
    {
        id: 'v1',
        name: 'Puku Cafe & Bar',
        location: 'Ha Noi',
        distance: '0.5 km',
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        googleMapUrl: 'https://maps.app.goo.gl/Zykrr4jQGyEvPuNS8',
        tags: [
            { id: 't1', type: QoETagType.BROADCAST, label: 'Big Screen', confidence: 0.98 },
            { id: 't2', type: QoETagType.VIBE, label: 'Sound ON', confidence: 0.95 }
        ],
        features: {
            broadcast_capabilities: {
                supported_leagues: ['nba'],
                special_hours: {
                    open_early_for_nba: true,
                    open_early_for_nfl: false,
                    open_late_for_ucl: false
                },
                amenities: {
                    breakfast_available: true,
                    audio_priority: 'main'
                }
            }
        }
    },
    {
        id: 'v2',
        name: 'The Republic',
        location: 'Ha Noi',
        distance: '3.2 km',
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 't3', type: QoETagType.BROADCAST, label: 'Multi-Screen', confidence: 0.92 },
            { id: 't4', type: QoETagType.VIBE, label: 'Rowdy', confidence: 0.85 }
        ],
        features: {}
    },
    {
        id: 'v3',
        name: 'SportivO',
        location: 'Ha Noi',
        distance: '0.8 km',
        rating: 4.4,
        imageUrl: 'https://images.unsplash.com/photo-1574602305307-b3b3a602319e?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(Date.now() - 86400000),
        tags: [
            { id: 't5', type: QoETagType.SURVIVAL, label: 'Open Late', confidence: 0.99 }
        ],
        features: {}
    },
    {
        id: 'v4',
        name: 'BOOM Bar',
        location: 'Ha Noi',
        distance: '1.1 km',
        rating: 4.2,
        imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(Date.now() - 3600000),
        tags: [],
        features: {}
    },
    {
        id: 'v5',
        name: "O'Learys Sports Bar",
        location: 'Ha Noi',
        distance: '2.5 km',
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 't6', type: QoETagType.BROADCAST, label: 'Giant LED', confidence: 0.99 },
            { id: 't7', type: QoETagType.VIBE, label: 'Premium', confidence: 0.90 }
        ],
        features: {}
    },
    {
        id: 'v6',
        name: 'The Moose & Roo',
        location: 'Ha Noi',
        distance: '1.5 km',
        rating: 4.3,
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(Date.now() - 7200000),
        tags: [
            { id: 't8', type: QoETagType.VIBE, label: 'Chill', confidence: 0.88 },
            { id: 't9', type: QoETagType.SURVIVAL, label: 'Great Food', confidence: 0.95 }
        ],
        features: {}
    },
    {
        id: 'v7',
        name: 'Pasteur Street Brewing',
        location: 'Ha Noi',
        distance: '0.3 km',
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 't10', type: QoETagType.VIBE, label: 'Craft Beer', confidence: 0.97 },
            { id: 't11', type: QoETagType.BROADCAST, label: 'Projector', confidence: 0.85 }
        ],
        features: {}
    },
    {
        id: 'v8',
        name: '7 Bridges Brewing',
        location: 'Ha Noi',
        distance: '4.0 km',
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(Date.now() - 12000000),
        tags: [
            { id: 't12', type: QoETagType.VIBE, label: 'Rooftop', confidence: 0.94 }
        ],
        features: {}
    },
    // Tokyo Venues
    {
        id: 'v_tokyo_1',
        name: 'HUB British Pub',
        location: 'Tokyo',
        distance: '0.2 km',
        rating: 4.2,
        imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 'tt1', type: QoETagType.BROADCAST, label: 'Live Sports', confidence: 0.9 },
            { id: 'tt2', type: QoETagType.VIBE, label: 'Social', confidence: 0.85 }
        ],
        features: {}
    },
    {
        id: 'v_tokyo_2',
        name: 'FootNik Ebisu',
        location: 'Tokyo',
        distance: '1.5 km',
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00d59143?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 'tt3', type: QoETagType.BROADCAST, label: 'Big Screen', confidence: 0.95 },
            { id: 'tt4', type: QoETagType.SURVIVAL, label: 'Great Food', confidence: 0.9 }
        ],
        features: {}
    },
    // Osaka Venues
    {
        id: 'v_osaka_1',
        name: 'Coolabah Sports Bar',
        location: 'Osaka',
        distance: '0.8 km',
        rating: 4.4,
        imageUrl: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 'to1', type: QoETagType.BROADCAST, label: 'Live Rugby', confidence: 0.92 },
            { id: 'to2', type: QoETagType.VIBE, label: 'Friendly', confidence: 0.88 }
        ],
        features: {}
    },
    {
        id: 'v_osaka_2',
        name: 'Balabushka',
        location: 'Osaka',
        distance: '1.2 km',
        rating: 4.3,
        imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 'to3', type: QoETagType.VIBE, label: 'Pool Table', confidence: 0.9 },
            { id: 'to4', type: QoETagType.SURVIVAL, label: 'Late Night', confidence: 0.95 }
        ],
        features: {}
    },
    ...generateBacNinhVenues().map(v => ({ ...v, features: {} })),
    // Bangkok Venues
    {
        id: 'v_bkk_1',
        name: 'The Sportsman',
        location: 'Bangkok',
        distance: '1.2 km',
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1542396601-dca920ea2807?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 'tb1', type: QoETagType.BROADCAST, label: 'Live PL', confidence: 0.95 },
            { id: 'tb2', type: QoETagType.SURVIVAL, label: 'Pool', confidence: 0.90 }
        ],
        features: {}
    },
    // Taipei Venues
    {
        id: 'v_tpe_1',
        name: 'The Brass Monkey',
        location: 'Taipei',
        distance: '0.5 km',
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 'ttpe1', type: QoETagType.BROADCAST, label: 'Rugby', confidence: 0.95 },
            { id: 'ttpe2', type: QoETagType.VIBE, label: 'Expats', confidence: 0.88 }
        ],
        features: {}
    },
    {
        id: 'v_tpe_2',
        name: 'On Tap',
        location: 'Taipei',
        distance: '2.0 km',
        rating: 4.3,
        imageUrl: 'https://images.unsplash.com/photo-1574602305307-b3b3a602319e?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 'ttpe3', type: QoETagType.BROADCAST, label: 'Live Football', confidence: 0.92 }
        ],
        features: {}
    },
    // Singapore Venues
    {
        id: 'v_sg_1',
        name: "Harry's Boat Quay",
        location: 'Singapore',
        distance: '1.0 km',
        rating: 4.4,
        imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=400&q=80',
        lastVerified: new Date(),
        tags: [
            { id: 'tsg1', type: QoETagType.VIBE, label: 'River View', confidence: 0.90 }
        ],
        features: {}
    }
];

export const MOCK_EVENTS = [
    {
        id: 'e1',
        title: 'Vietnam vs Thailand',
        league: 'AFF Cup',
        sport: 'Football',
        startTime: new Date(new Date().setHours(19, 30, 0, 0)),
        teamA: 'Vietnam',
        teamB: 'Thailand',
        isHot: true
    },
    {
        id: 'e2',
        title: 'Hanoi FC vs CAHN',
        league: 'V.League 1',
        sport: 'Football',
        startTime: new Date(new Date().setHours(19, 15, 0, 0)),
        teamA: 'Hanoi FC',
        teamB: 'CAHN',
        isHot: true
    },
    {
        id: 'e3',
        title: 'Man City vs Real Madrid',
        league: 'Champions League',
        sport: 'Football',
        startTime: new Date(new Date().setHours(2, 0, 0, 0)),
        teamA: 'Man City',
        teamB: 'Real Madrid',
        isHot: true
    },
    {
        id: 'e4',
        title: 'Nam Dinh vs Hai Phong',
        league: 'V.League 1',
        sport: 'Football',
        startTime: new Date(new Date().setHours(18, 0, 0, 0)),
        teamA: 'Nam Dinh',
        teamB: 'Hai Phong',
        isHot: false
    },
    {
        id: 'e5',
        title: 'Man Utd vs Liverpool',
        league: 'Premier League',
        sport: 'Football',
        startTime: new Date(new Date().setHours(22, 30, 0, 0)),
        teamA: 'Man Utd',
        teamB: 'Liverpool',
        isHot: true
    },
    {
        id: 'e6',
        title: 'Chiefs vs 49ers',
        league: 'NFL',
        sport: 'American Football',
        startTime: new Date('2026-02-09T06:30:00'),
        teamA: 'Kansas City Chiefs',
        teamB: 'San Francisco 49ers',
        isHot: true
    },
    {
        id: 'e7',
        title: 'Japan vs USA',
        league: 'WBC',
        sport: 'Baseball',
        startTime: new Date('2026-03-21T19:00:00'),
        teamA: 'Japan',
        teamB: 'USA',
        isHot: true
    },
    {
        id: 'e8',
        title: 'Dominican Rep vs Venezuela',
        league: 'WBC',
        sport: 'Baseball',
        startTime: new Date('2026-03-14T12:00:00'),
        teamA: 'Dominican Republic',
        teamB: 'Venezuela',
        isHot: false
    },
    {
        id: 'e9',
        title: 'Lakers vs Warriors',
        league: 'NBA',
        sport: 'Basketball',
        startTime: new Date(new Date().setHours(10, 0, 0, 0)),
        teamA: 'Lakers',
        teamB: 'Warriors',
        isHot: true
    },
    {
        id: 'e10',
        title: 'Djokovic vs Alcaraz',
        league: 'Wimbledon',
        sport: 'Tennis',
        startTime: new Date(new Date().setHours(20, 0, 0, 0)),
        teamA: 'Djokovic',
        teamB: 'Alcaraz',
        isHot: true
    },
    {
        id: 'e11',
        title: 'Bahrain Grand Prix',
        league: 'F1',
        sport: 'F1 Racing',
        startTime: new Date('2026-03-02T22:00:00'),
        teamA: 'Red Bull',
        teamB: 'Ferrari',
        isHot: true
    },
    // New Matches
    {
        id: 'e12',
        title: 'Saudi Arabian Grand Prix',
        league: 'F1',
        sport: 'F1 Racing',
        startTime: new Date('2026-03-09T22:00:00'),
        teamA: 'Mercedes',
        teamB: 'McLaren',
        isHot: true
    },
    {
        id: 'e13',
        title: 'Hanshin Tigers vs Yomiuri Giants',
        league: 'NPB',
        sport: 'Baseball',
        startTime: new Date(new Date().setHours(18, 0, 0, 0)),
        teamA: 'Hanshin Tigers',
        teamB: 'Yomiuri Giants',
        isHot: true
    },
    {
        id: 'e14',
        title: 'UFC 300: McGregor vs Chandler',
        league: 'UFC',
        sport: 'MMA',
        startTime: new Date('2026-04-13T22:00:00'),
        teamA: 'McGregor',
        teamB: 'Chandler',
        isHot: true
    },
    {
        id: 'e15',
        title: 'The Masters: Final Round',
        league: 'PGA Tour',
        sport: 'Golf',
        startTime: new Date('2026-04-12T14:00:00'),
        teamA: 'Scheffler',
        teamB: 'McIlroy',
        isHot: true
    },
    {
        id: 'e16',
        title: 'India vs Australia',
        league: 'Test Cricket',
        sport: 'Cricket',
        startTime: new Date('2026-03-01T09:30:00'),
        teamA: 'India',
        teamB: 'Australia',
        isHot: true
    },
    {
        id: 'e17',
        title: 'T1 vs Gen.G',
        league: 'LCK',
        sport: 'Esports',
        startTime: new Date(new Date().setHours(17, 0, 0, 0)),
        teamA: 'T1',
        teamB: 'Gen.G',
        isHot: true
    },
    {
        id: 'e18',
        title: 'All Blacks vs Springboks',
        league: 'Rugby Championship',
        sport: 'Rugby',
        startTime: new Date('2026-08-08T19:00:00'),
        teamA: 'New Zealand',
        teamB: 'South Africa',
        isHot: true
    }
];

export const ROLE_THEMES = {
    [UserRole.FAN]: {
        primary: 'text-mosport-fan',
        bg: 'bg-mosport-fan',
        border: 'border-mosport-fan',
        hover: 'hover:bg-blue-800'
    },
    [UserRole.VENUE]: {
        primary: 'text-mosport-venue',
        bg: 'bg-mosport-venue',
        border: 'border-mosport-venue',
        hover: 'hover:bg-pink-800'
    },
    [UserRole.STAFF]: {
        primary: 'text-purple-400',
        bg: 'bg-purple-600',
        border: 'border-purple-500',
        hover: 'hover:bg-purple-700'
    }
};

export const VLEAGUE_TEAM_LINKS: Record<string, string> = {
    'Hanoi FC': 'https://www.facebook.com/officialhanoifc/?locale=vi_VN',
    'HNFC': 'https://www.facebook.com/officialhanoifc/?locale=vi_VN',
    'CAHN': 'https://www.facebook.com/CAHNFCVN/',
    'Cong An Ha Noi FC': 'https://www.facebook.com/CAHNFCVN/',
    'The Cong - Viettel': 'https://www.facebook.com/thecongviettelfc/?locale=vi_VN',
    'Viettel': 'https://www.facebook.com/thecongviettelfc/?locale=vi_VN',
    'Hai Phong': 'https://www.facebook.com/haiphongfootballclub',
    'Hai Phong FC': 'https://www.facebook.com/haiphongfootballclub',
    'Nam Dinh': 'https://www.facebook.com/ThepXanhNamDinhFC/',
    'Thep Xanh Nam Dinh': 'https://www.facebook.com/ThepXanhNamDinhFC/',
    'Dong A Thanh Hoa': 'https://www.facebook.com/DongAThanhHoaFootballClub',
    'Thanh Hoa': 'https://www.facebook.com/DongAThanhHoaFootballClub',
    'LPBank HAGL': 'https://www.facebook.com/haglfc.clb',
    'HAGL': 'https://www.facebook.com/haglfc.clb',
    'Song Lam Nghe An': 'https://www.facebook.com/SLNAFC',
    'SLNA': 'https://www.facebook.com/SLNAFC',
    'Becamex Binh Duong': 'https://www.facebook.com/becamextphochiminhfc',
    'Binh Duong': 'https://www.facebook.com/becamextphochiminhfc',
    'Ho Chi Minh City FC': 'https://www.facebook.com/hcmcfootballclub/?locale=vi_VN',
    'HCMC': 'https://www.facebook.com/hcmcfootballclub/?locale=vi_VN',
    'TP. HCM': 'https://www.facebook.com/hcmcfootballclub/?locale=vi_VN',
    'SHB Da Nang': 'https://www.facebook.com/shbdanang.official/',
    'Da Nang': 'https://www.facebook.com/shbdanang.official/',
    'Hong Linh Ha Tinh': 'https://www.facebook.com/HongLinhHaTinhOfficial/',
    'Ha Tinh': 'https://www.facebook.com/HongLinhHaTinhOfficial/',
    'Quang Nam FC': 'https://www.facebook.com/quangnamfc1997/?locale=vi_VN',
    'Quang Nam': 'https://www.facebook.com/quangnamfc1997/?locale=vi_VN',
};
