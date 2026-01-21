-- Sample Data for Development
-- Run this AFTER schema.sql

-- HOT ZONE: Sample Users
INSERT INTO users (id, role, email, name, provider, is_guest) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'FAN', 'fan@mosport.app', 'Demo Fan', 'google', false),
  ('550e8400-e29b-41d4-a716-446655440002', 'VENUE', 'venue@mosport.app', 'Sports Bar Owner', 'facebook', false),
  ('550e8400-e29b-41d4-a716-446655440003', 'STAFF', 'staff@mosport.app', 'Mosport Admin', 'google', false);

-- Sample Venues (Hanoi)
INSERT INTO venues (id, owner_id, name, slug, address, city, country, latitude, longitude, qoe_score, is_verified) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'The Hanoi Social Club', 'hanoi-social-club', '6 Hoi Vu, Hoan Kiem', 'Ha Noi', 'Vietnam', 21.0285, 105.8542, 8.50, true),
  ('660e8400-e29b-41d4-a716-446655440002', NULL, 'The Rooftop Bar', 'rooftop-bar-hanoi', '7 Hang Be, Hoan Kiem', 'Ha Noi', 'Vietnam', 21.0300, 105.8520, 7.80, false),
  ('660e8400-e29b-41d4-a716-446655440003', NULL, 'GG Sports Lounge', 'gg-sports-lounge', '15 Xuan Dieu, Tay Ho', 'Ha Noi', 'Vietnam', 21.0600, 105.8250, 9.20, true);

-- Sample Events (Football)
INSERT INTO events (id, title, league, sport, team_a, team_b, start_time, status) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Vietnam vs Thailand', 'AFF Cup', 'football', 'Vietnam', 'Thailand', '2026-01-25 19:00:00+07', 'scheduled'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Man City vs Liverpool', 'Premier League', 'football', 'Manchester City', 'Liverpool', '2026-01-26 22:00:00+07', 'scheduled'),
  ('770e8400-e29b-41d4-a716-446655440003', 'Hanoi FC vs HAGL', 'V.League', 'football', 'Hanoi FC', 'Hoang Anh Gia Lai', '2026-01-28 18:00:00+07', 'scheduled');

-- Sample Venue-Event Matching
INSERT INTO venue_events (venue_id, event_id, verification_status, last_verified_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'authority', NOW()),
  ('660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 'confirmed', NOW() - INTERVAL '2 hours'),
  ('660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'predicted', NOW() - INTERVAL '7 days'),
  ('660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'authority', NOW());

-- Sample Trust Scores
INSERT INTO user_trust_scores (user_id, trust_score, sports_affinity, favorite_teams) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 8.50, '{"football": 9.2, "basketball": 4.5}', ARRAY['Vietnam NT', 'Manchester United']);

-- Sample DTSS Verifications
INSERT INTO dtss_verifications (venue_event_id, check_type, status, metadata) VALUES
  ((SELECT id FROM venue_events LIMIT 1), 'T-7', 'confirmed', '{"source": "google_places", "confidence": 0.85}'),
  ((SELECT id FROM venue_events LIMIT 1), 'T-24', 'confirmed', '{"source": "facebook_events", "confidence": 0.92}');
