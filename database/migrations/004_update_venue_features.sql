-- 004_update_venue_features.sql
-- Update venue features JSONB with V6.5 Global Sports League Matrix data

-- ═══════════════════════════════════════════════════
-- VIETNAM (Hanoi/HCMC) - Premier League & NBA Focus
-- ═══════════════════════════════════════════════════

-- Puku Cafe & Bar (Hanoi) - 24/7 Sports Bar
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["EPL", "NBA", "F1", "Rugby_Union", "AFL"],
        "special_hours": {
            "open_early_for_nba": true,
            "open_early_for_nfl": true,
            "open_late_for_ucl": true
        },
        "amenities": {
            "breakfast_available": true,
            "audio_priority": "EPL"
        }
    }'::jsonb
) WHERE name = 'Puku Cafe & Bar';

-- The Republic (Hanoi) - Golf & Football
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["EPL", "Golf", "F1", "Rugby_Union"],
        "special_hours": {
            "open_early_for_nba": false,
            "open_early_for_nfl": false,
            "open_late_for_ucl": true
        },
        "amenities": {
            "breakfast_available": false,
            "audio_priority": "EPL"
        }
    }'::jsonb
) WHERE name = 'The Republic';

-- O''Learys Sports Bar (Hanoi) - General Sports
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["EPL", "Bundesliga", "UCL", "F1"],
        "special_hours": {
            "open_early_for_nba": false,
            "open_early_for_nfl": false,
            "open_late_for_ucl": true
        },
        "amenities": {
            "breakfast_available": false,
            "audio_priority": "EPL"
        }
    }'::jsonb
) WHERE name LIKE 'O%Learys%';

-- ═══════════════════════════════════════════════════
-- THAILAND (Bangkok) - EPL, F1, Muay Thai
-- ═══════════════════════════════════════════════════

-- The Sportsman Sports Bar (Bangkok) - The Big One
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["EPL", "NBA", "NFL", "F1", "UCL", "Muay_Thai", "Rugby_Union"],
        "special_hours": {
            "open_early_for_nba": true,
            "open_early_for_nfl": true,
            "open_late_for_ucl": true
        },
        "amenities": {
            "breakfast_available": true,
            "audio_priority": "EPL"
        }
    }'::jsonb
) WHERE name = 'The Sportsman Sports Bar';

-- ═══════════════════════════════════════════════════
-- SINGAPORE - F1, Cricket, Rugby
-- ═══════════════════════════════════════════════════

-- Harry''s (General Chain)
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["EPL", "F1", "Cricket", "Rugby_Union"],
        "special_hours": {
            "open_early_for_nba": false,
            "open_early_for_nfl": false,
            "open_late_for_ucl": false
        },
        "amenities": {
            "breakfast_available": false,
            "audio_priority": "F1"
        }
    }'::jsonb
) WHERE name LIKE 'Harry%';

-- Muddy Murphy''s - Rugby Focus
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["Rugby_Union", "EPL", "Six_Nations"],
        "special_hours": {
            "open_early_for_nba": false,
            "open_early_for_nfl": false,
            "open_late_for_ucl": true
        },
        "amenities": {
            "breakfast_available": true,
            "audio_priority": "Rugby_Union"
        }
    }'::jsonb
) WHERE name = 'Muddy Murphy''s Irish Pub';

-- ═══════════════════════════════════════════════════
-- TAIWAN (Taipei) - Baseball (CPBL/MLB/NPB) & Basketball
-- ═══════════════════════════════════════════════════

-- Brass Monkey (Taipei) - Expat Hub
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["EPL", "NBA", "NFL", "Rugby_Union", "CPBL", "MLB", "World_Cup"],
        "special_hours": {
            "open_early_for_nba": true,
            "open_early_for_nfl": true,
            "open_late_for_ucl": true
        },
        "amenities": {
            "breakfast_available": true,
            "audio_priority": "EPL"
        }
    }'::jsonb
) WHERE name = 'Brass Monkey';

-- On Tap (Taipei) - EPL & Pub Sports
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["EPL", "UCL", "Rugby_Union", "F1"],
        "special_hours": {
            "open_early_for_nba": false,
            "open_early_for_nfl": false,
            "open_late_for_ucl": true
        },
        "amenities": {
            "breakfast_available": false,
            "audio_priority": "EPL"
        }
    }'::jsonb
) WHERE name = 'On Tap';

-- Hooters Xinyi (Taipei) - NBA/MLB Focus
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["NBA", "MLB", "CPBL", "NFL"],
        "special_hours": {
            "open_early_for_nba": true,
            "open_early_for_nfl": true,
            "open_late_for_ucl": false
        },
        "amenities": {
            "breakfast_available": false,
            "audio_priority": "NBA"
        }
    }'::jsonb
) WHERE name LIKE 'Hooters%';

-- Da Bar (Taipei)
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["CPBL", "MLB", "NPB", "NBA"],
        "special_hours": {
            "open_early_for_nba": true,
            "open_early_for_nfl": false,
            "open_late_for_ucl": false
        },
        "amenities": {
            "breakfast_available": false,
            "audio_priority": "MLB"
        }
    }'::jsonb
) WHERE name = 'Da Bar';

-- ═══════════════════════════════════════════════════
-- JAPAN (Tokyo) - Baseball (NPB/MLB) & Soccer
-- ═══════════════════════════════════════════════════
-- Note: Assuming these venues might be added in future or partially match 'HUB'
UPDATE venues 
SET features = jsonb_set(
    COALESCE(features, '{}'::jsonb),
    '{broadcast_capabilities}',
    '{
        "supported_leagues": ["NPB", "MLB", "J1_League", "EPL", "Samurai_Japan"],
        "special_hours": {
            "open_early_for_nba": false,
            "open_early_for_nfl": false,
            "open_late_for_ucl": true
        },
        "amenities": {
            "breakfast_available": false,
            "audio_priority": "NPB"
        }
    }'::jsonb
) WHERE name LIKE 'HUB%';
