-- Mosport Seed Data
-- Initial test data for events and venues

-- ═══════════════════════════════════════════════════
-- STEP 1: Insert Test Users (for venue owners)
-- ═══════════════════════════════════════════════════

INSERT INTO users (id, email, full_name, role, is_active)
VALUES 
    (gen_random_uuid(), 'owner1@mosport.app', 'Puku Cafe Owner', 'venue', true),
    (gen_random_uuid(), 'owner2@mosport.app', 'The Republic Owner', 'venue', true),
    (gen_random_uuid(), 'owner3@mosport.app', 'SportivO Owner', 'venue', true)
ON CONFLICT (email) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- STEP 2: Insert Venues with Search-Optimized Data
-- ═══════════════════════════════════════════════════

INSERT INTO venues (id, owner_id, name, slug, address, city, country, latitude, longitude, qoe_score, is_verified, tags)
VALUES
    -- Ha Noi Venues
    (
        gen_random_uuid(),
        (SELECT id FROM users WHERE email = 'owner1@mosport.app' LIMIT 1),
        'Puku Cafe & Bar',
        'puku-cafe-bar',
        '35 Hai Ba Trung, Hoan Kiem',
        'Ha Noi',
        'Vietnam',
        21.0285,
        105.8542,
        4.5,
        true,
        ARRAY['football', 'soccer', 'sports bar', 'live match', 'big screen']
    ),
    (
        gen_random_uuid(),
        (SELECT id FROM users WHERE email = 'owner2@mosport.app' LIMIT 1),
        'The Republic',
        'the-republic',
        '18 Tong Duy Tan, Hoan Kiem',
        'Ha Noi',
        'Vietnam',
        21.0245,
        105.8510,
        4.6,
        true,
        ARRAY['football', 'soccer', 'premier league', 'multi-screen', 'sports pub']
    ),
    (
        gen_random_uuid(),
        (SELECT id FROM users WHERE email = 'owner3@mosport.app' LIMIT 1),
        'SportivO',
        'sportivo',
        '52 To Ngoc Van, Tay Ho',
        'Ha Noi',
        'Vietnam',
        21.0650,
        105.8270,
        4.4,
        true,
        ARRAY['football', 'soccer', 'basketball', 'sports bar', 'late night']
    ),
    (
        gen_random_uuid(),
        (SELECT id FROM users WHERE email = 'owner1@mosport.app' LIMIT 1),
        'BOOM Bar',
        'boom-bar',
        '25 Hang Bai, Hoan Kiem',
        'Ha Noi',
        'Vietnam',
        21.0200,
        105.8560,
        4.2,
        false,
        ARRAY['football', 'soccer', 'live events', 'rooftop']
    ),
    (
        gen_random_uuid(),
        (SELECT id FROM users WHERE email = 'owner2@mosport.app' LIMIT 1),
        'O''Learys Sports Bar',
        'olearys-sports-bar',
        'Vincom Center, Ba Trieu',
        'Ha Noi',
        'Vietnam',
        21.0178,
        105.8467,
        4.7,
        true,
        ARRAY['football', 'soccer', 'nfl', 'nba', 'premium', 'giant led']
    ),
    
    -- Bac Ninh Venues
    (
        gen_random_uuid(),
        (SELECT id FROM users WHERE email = 'owner3@mosport.app' LIMIT 1),
        'Bac Ninh Sports Zone',
        'bac-ninh-sports-zone',
        '123 Ly Thai To, Tu Son',
        'Bac Ninh',
        'Vietnam',
        21.1200,
        106.1600,
        4.3,
        true,
        ARRAY['football', 'soccer', 'v-league', 'sports bar']
    ),
    (
        gen_random_uuid(),
        (SELECT id FROM users WHERE email = 'owner1@mosport.app' LIMIT 1),
        'Kinh Bac Arena',
        'kinh-bac-arena',
        '45 Nguyen Cao, Bac Ninh City',
        'Bac Ninh',
        'Vietnam',
        21.1850,
        106.0500,
        4.5,
        true,
        ARRAY['football', 'soccer', 'vietnamese football', 'live match']
    )
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- STEP 3: Insert Events (Upcoming Matches)
-- ═══════════════════════════════════════════════════

INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, end_time, status)
VALUES
    -- Today + upcoming events
    (
        gen_random_uuid(),
        'Vietnam vs Thailand',
        'AFF Cup',
        'football',
        'Vietnam',
        'Thailand',
        NOW() + INTERVAL '2 hours',
        NOW() + INTERVAL '4 hours',
        'scheduled'
    ),
    (
        gen_random_uuid(),
        'Hanoi FC vs CAHN',
        'V.League 1',
        'football',
        'Hanoi FC',
        'CAHN',
        NOW() + INTERVAL '1 day',
        NOW() + INTERVAL '1 day 2 hours',
        'scheduled'
    ),
    (
        gen_random_uuid(),
        'Man City vs Real Madrid',
        'Champions League',
        'football',
        'Man City',
        'Real Madrid',
        NOW() + INTERVAL '2 days',
        NOW() + INTERVAL '2 days 2 hours',
        'scheduled'
    ),
    (
        gen_random_uuid(),
        'Man Utd vs Liverpool',
        'Premier League',
        'football',
        'Man Utd',
        'Liverpool',
        NOW() + INTERVAL '3 days',
        NOW() + INTERVAL '3 days 2 hours',
        'scheduled'
    ),
    (
        gen_random_uuid(),
        'Nam Dinh vs Hai Phong',
        'V.League 1',
        'football',
        'Nam Dinh',
        'Hai Phong',
        NOW() + INTERVAL '4 days',
        NOW() + INTERVAL '4 days 2 hours',
        'scheduled'
    ),
    (
        gen_random_uuid(),
        'Lakers vs Warriors',
        'NBA',
        'basketball',
        'LA Lakers',
        'Golden State Warriors',
        NOW() + INTERVAL '1 day',
        NOW() + INTERVAL '1 day 3 hours',
        'scheduled'
    )
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════
-- STEP 4: Link Events to Venues (venue_events)
-- ═══════════════════════════════════════════════════

-- Link Vietnam vs Thailand to multiple venues
INSERT INTO venue_events (event_id, venue_id, verification_status, qoe_score, last_verified_at)
SELECT 
    e.id,
    v.id,
    'confirmed',
    v.qoe_score,
    NOW()
FROM events e
CROSS JOIN venues v
WHERE e.title = 'Vietnam vs Thailand'
AND v.city = 'Ha Noi'
ON CONFLICT DO NOTHING;

-- Link Premier League to sports bars
INSERT INTO venue_events (event_id, venue_id, verification_status, qoe_score, last_verified_at)
SELECT 
    e.id,
    v.id,
    'confirmed',
    v.qoe_score,
    NOW()
FROM events e
CROSS JOIN venues v
WHERE e.league = 'Premier League'
AND 'premier league' = ANY(v.tags)
ON CONFLICT DO NOTHING;

-- Link V.League events to Bac Ninh venues
INSERT INTO venue_events (event_id, venue_id, verification_status, qoe_score, last_verified_at)
SELECT 
    e.id,
    v.id,
    'predicted',
    v.qoe_score,
    NOW()
FROM events e
CROSS JOIN venues v
WHERE e.league = 'V.League 1'
AND v.city = 'Bac Ninh'
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════
-- VERIFICATION
-- ═══════════════════════════════════════════════════

-- Check inserted data
DO $$
BEGIN
    RAISE NOTICE 'Venues count: %', (SELECT count(*) FROM venues);
    RAISE NOTICE 'Events count: %', (SELECT count(*) FROM events);
    RAISE NOTICE 'Venue-Event links: %', (SELECT count(*) FROM venue_events);
END $$;
