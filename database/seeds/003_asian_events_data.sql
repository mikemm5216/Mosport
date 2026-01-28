-- 003_asian_events_data.sql
-- Seed data for Asian & Global sports events with standardized League Codes

-- Clear existing events derived from previous seeds if any to avoid duplicates
-- (Optional, be careful in production)

-- ═══════════════════════════════════════════════════
-- Category A: Football (The Global King)
-- ═══════════════════════════════════════════════════

-- EPL: Man City vs Arsenal (The Big Clash)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Man City vs Arsenal', 'EPL', 'football', 'Man City', 'Arsenal', NOW() + INTERVAL '2 days' + INTERVAL '20 hours', 'scheduled', 1.0),
(gen_random_uuid(), 'Liverpool vs Man Utd', 'EPL', 'football', 'Liverpool', 'Man Utd', NOW() + INTERVAL '3 days' + INTERVAL '19 hours', 'scheduled', 1.0);

-- UCL: Real Madrid vs Bayern (Late Night in Asia)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Real Madrid vs Bayern Munich', 'UCL', 'football', 'Real Madrid', 'Bayern', NOW() + INTERVAL '5 days' + INTERVAL '3 hours', 'scheduled', 1.0);

-- J1 League (Japan)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Kawasaki Frontale vs Yokohama F. Marinos', 'J1_League', 'football', 'Kawasaki', 'Yokohama FM', NOW() + INTERVAL '1 day' + INTERVAL '18 hours', 'scheduled', 0.9);

-- K League 1 (Korea)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'FC Seoul vs Suwon Bluewings', 'K_League_1', 'football', 'FC Seoul', 'Suwon', NOW() + INTERVAL '1 day' + INTERVAL '18 hours', 'scheduled', 0.9);

-- AFF Cup (Regional)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Vietnam vs Thailand', 'AFF_Cup', 'football', 'Vietnam', 'Thailand', NOW() + INTERVAL '4 hours', 'live', 1.0);


-- ═══════════════════════════════════════════════════
-- Category B: Baseball (The East Asian Soul)
-- ═══════════════════════════════════════════════════

-- MLB: Dodgers (Ohtani) vs Yankees
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Dodgers vs Yankees', 'MLB', 'baseball', 'Dodgers', 'Yankees', NOW() + INTERVAL '1 day' + INTERVAL '8 hours', 'scheduled', 1.0);

-- NPB: Giants vs Tigers (Traditional Rivalry)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Yomiuri Giants vs Hanshin Tigers', 'NPB', 'baseball', 'Giants', 'Tigers', NOW() + INTERVAL '1 day' + INTERVAL '17 hours', 'scheduled', 0.9);

-- CPBL (Taiwan)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'CTBC Brothers vs Rakuten Monkeys', 'CPBL', 'baseball', 'CTBC Brothers', 'Rakuten Monkeys', NOW() + INTERVAL '2 days' + INTERVAL '17 hours', 'scheduled', 0.9);

-- ═══════════════════════════════════════════════════
-- Category C: Basketball (The Youth Magnet)
-- ═══════════════════════════════════════════════════

-- NBA: Lakers vs Warriors (Morning in Asia)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Lakers vs Warriors', 'NBA', 'basketball', 'Lakers', 'Warriors', NOW() + INTERVAL '1 day' + INTERVAL '9 hours', 'scheduled', 1.0),
(gen_random_uuid(), 'Celtics vs Heat', 'NBA', 'basketball', 'Celtics', 'Heat', NOW() + INTERVAL '1 day' + INTERVAL '7 hours', 'scheduled', 1.0);

-- PBA (Philippines)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Barangay Ginebra vs Magnolia', 'PBA', 'basketball', 'Ginebra', 'Magnolia', NOW() + INTERVAL '2 days' + INTERVAL '19 hours', 'scheduled', 0.9);

-- P.League+ (Taiwan)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Taipei Fubon Braves vs New Taipei Kings', 'P_League', 'basketball', 'Fubon Braves', 'Kings', NOW() + INTERVAL '3 days' + INTERVAL '19 hours', 'scheduled', 0.9);

-- ═══════════════════════════════════════════════════
-- Category D: North American Specials
-- ═══════════════════════════════════════════════════

-- NFL: Super Bowl (Example) or MNF
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Chiefs vs 49ers', 'NFL', 'american-football', 'Chiefs', '49ers', NOW() + INTERVAL '6 days' + INTERVAL '7 hours', 'scheduled', 1.0);

-- ═══════════════════════════════════════════════════
-- Category E: Racing & Others
-- ═══════════════════════════════════════════════════

-- F1: Singapore GP
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Singapore Grand Prix', 'F1', 'f1', 'F1', 'F1', NOW() + INTERVAL '10 days' + INTERVAL '20 hours', 'scheduled', 1.0);

-- Badminton: Malaysia Open
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status, confidence_score)
VALUES 
(gen_random_uuid(), 'Viktor Axelsen vs Lee Zii Jia', 'BWF', 'badminton', 'Axelsen', 'Lee Zii Jia', NOW() + INTERVAL '5 hours', 'live', 0.9);
