-- Mosport Pan-Asian Cities Seed Data
-- Expanding beyond Vietnam to major Asian cities
-- Version: 2.0 (Asian Expansion)

-- ═══════════════════════════════════════════════════
-- 🇻🇳 VIETNAM - Additional Cities
-- ═══════════════════════════════════════════════════

INSERT INTO venues (id, owner_id, name, slug, address, city, country, latitude, longitude, qoe_score, is_verified, tags)
VALUES
  -- Ho Chi Minh City
  (gen_random_uuid(), NULL, 'Yolo Sports Bar & Grill', 'yolo-sports-bar-saigon', '8A/1D1 Thai Van Lung, District 1', 'Ho Chi Minh City', 'Vietnam', 10.7769, 106.7009, 4.8, true, ARRAY['football', 'soccer', 'premier league', 'american sports']),
  (gen_random_uuid(), NULL, 'The View Rooftop Bar', 'the-view-rooftop-saigon', 'AB Tower, 76A Le Lai, District 1', 'Ho Chi Minh City', 'Vietnam', 10.7699, 106.6973, 4.6, true, ARRAY['football', 'rooftop', 'live match']),
  (gen_random_uuid(), NULL, 'Rogue Saigon', 'rogue-saigon', '20 Ly Tu Trong, District 1', 'Ho Chi Minh City', 'Vietnam', 10.7756, 106.7019, 4.7, true, ARRAY['football', 'craft beer', 'sports bar']),
  
  -- Da Nang
  (gen_random_uuid(), NULL, 'Golden Pine Pub', 'golden-pine-pub-danang', 'Son Tra District', 'Da Nang', 'Vietnam', 16.0838, 108.2208, 4.5, true, ARRAY['football', 'beach bar', 'live events']),
  (gen_random_uuid(), NULL, 'Sky 36 Sports Lounge', 'sky36-sports-danang', 'Hai Chau District', 'Da Nang', 'Vietnam', 16.0545, 108.2022, 4.6, true, ARRAY['football', 'rooftop', 'premium'])
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 🇹🇭 THAILAND
-- ═══════════════════════════════════════════════════

INSERT INTO venues (id, owner_id, name, slug, address, city, country, latitude, longitude, qoe_score, is_verified, tags)
VALUES
  -- Bangkok
  (gen_random_uuid(), NULL, 'Hooters Bangkok', 'hooters-bangkok-nana', '22/1 Sukhumvit Soi 4, Nana', 'Bangkok', 'Thailand', 13.7408, 100.5594, 4.7, true, ARRAY['football', 'nfl', 'nba', 'american sports']),
  (gen_random_uuid(), NULL, 'The Londoner Brew Pub', 'londoner-brew-pub-bangkok', 'Sukhumvit Soi 33', 'Bangkok', 'Thailand', 13.7398, 100.5693, 4.8, true, ARRAY['football', 'premier league', 'british pub']),
  (gen_random_uuid(), NULL, 'Bourbon Street Bar', 'bourbon-street-bangkok', 'Washington Square, Soi 22 Sukhumvit', 'Bangkok', 'Thailand', 13.7375, 100.5628, 4.5, true, ARRAY['football', 'american sports', 'live music']),
  (gen_random_uuid(), NULL, 'Soi 11 Sports Bar', 'soi-11-sports-bar', 'Sukhumvit Soi 11', 'Bangkok', 'Thailand', 13.7425, 100.5578, 4.6, true, ARRAY['football', 'boxing', 'muay thai']),
  
  -- Phuket
  (gen_random_uuid(), NULL, 'Aussie Bar Patong', 'aussie-bar-patong', 'Bangla Road, Patong', 'Phuket', 'Thailand', 7.8962, 98.2964, 4.4, true, ARRAY['football', 'rugby', 'beach bar']),
  (gen_random_uuid(), NULL, 'Two Black Sheep', 'two-black-sheep-phuket', 'Boat Avenue, Cherngtalay', 'Phuket', 'Thailand', 7.9965, 98.2967, 4.7, true, ARRAY['football', 'british pub', 'premier league']),
  
  -- Chiang Mai
  (gen_random_uuid(), NULL, 'UN Irish Pub', 'un-irish-pub-chiangmai', 'Old City', 'Chiang Mai', 'Thailand', 18.7883, 98.9853, 4.5, true, ARRAY['football', 'irish pub', 'live match']),
  (gen_random_uuid(), NULL, 'The Good View Bar', 'good-view-bar-chiangmai', 'Ping River', 'Chiang Mai', 'Thailand', 18.7765, 98.9925, 4.6, true, ARRAY['football', 'riverside', 'live music'])
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 🇸🇬 SINGAPORE
-- ═══════════════════════════════════════════════════

INSERT INTO venues (id, owner_id, name, slug, address, city, country, latitude, longitude, qoe_score, is_verified, tags)
VALUES
  (gen_random_uuid(), NULL, 'Hooters Singapore', 'hooters-singapore', 'Clarke Quay', 'Singapore', 'Singapore', 1.2897, 103.8467, 4.8, true, ARRAY['football', 'nfl', 'nba', 'american sports']),
  (gen_random_uuid(), NULL, 'Brewerkz', 'brewerkz-singapore', 'Riverside Point', 'Singapore', 'Singapore', 1.2928, 103.8467, 4.7, true, ARRAY['football', 'craft beer', 'riverside']),
  (gen_random_uuid(), NULL, 'Champions Bar', 'champions-bar-singapore', 'Marriott Tang Plaza, 320 Orchard Road', 'Singapore', 'Singapore', 1.3048, 103.8318, 4.9, true, ARRAY['football', 'premier league', 'rugby', 'cricket']),
  (gen_random_uuid(), NULL, 'Harry''s Bar', 'harrys-bar-singapore', 'Boat Quay', 'Singapore', 'Singapore', 1.2867, 103.8490, 4.6, true, ARRAY['football', 'live match', 'riverside']),
  (gen_random_uuid(), NULL, 'The Penny Black', 'penny-black-singapore', 'Boat Quay', 'Singapore', 'Singapore', 1.2865, 103.8495, 4.7, true, ARRAY['football', 'british pub', 'premier league'])
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 🇲🇾 MALAYSIA
-- ═══════════════════════════════════════════════════

INSERT INTO venues (id, owner_id, name, slug, address, city, country, latitude, longitude, qoe_score, is_verified, tags)
VALUES
  -- Kuala Lumpur
  (gen_random_uuid(), NULL, 'The Backyard', 'the-backyard-kl', 'TTDI', 'Kuala Lumpur', 'Malaysia', 3.1390, 101.6869, 4.6, true, ARRAY['football', 'sports bar', 'live match']),
  (gen_random_uuid(), NULL, 'Beach Club Cafe', 'beach-club-cafe-kl', 'KL City', 'Kuala Lumpur', 'Malaysia', 3.1478, 101.6953, 4.5, true, ARRAY['football', 'premier league', 'live events']),
  (gen_random_uuid(), NULL, 'Pool Club KL', 'pool-club-kl', 'Bukit Bintang', 'Kuala Lumpur', 'Malaysia', 3.1478, 101.7123, 4.7, true, ARRAY['football', 'rooftop', 'premium']),
  
  -- Penang
  (gen_random_uuid(), NULL, 'Slippery Senoritas', 'slippery-senoritas-penang', 'Batu Ferringhi', 'Penang', 'Malaysia', 5.4745, 100.2467, 4.4, true, ARRAY['football', 'beach bar', 'live music']),
  (gen_random_uuid(), NULL, 'G Hotel Kelawai Sports Bar', 'g-hotel-sports-bar-penang', 'Kelawai Road', 'Penang', 'Malaysia', 5.4308, 100.3089, 4.6, true, ARRAY['football', 'premium', 'hotel bar'])
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 🇵🇭 PHILIPPINES
-- ═══════════════════════════════════════════════════

INSERT INTO venues (id, owner_id, name, slug, address, city, country, latitude, longitude, qoe_score, is_verified, tags)
VALUES
  -- Manila
  (gen_random_uuid(), NULL, 'Draft Sports Bar', 'draft-sports-bar-manila', 'Poblacion, Makati', 'Manila', 'Philippines', 14.5547, 121.0244, 4.7, true, ARRAY['football', 'basketball', 'craft beer']),
  (gen_random_uuid(), NULL, 'The Brewery', 'the-brewery-bgc', 'BGC', 'Manila', 'Philippines', 14.5515, 121.0473, 4.6, true, ARRAY['football', 'american sports', 'live match']),
  (gen_random_uuid(), NULL, 'Handlebar', 'handlebar-poblacion', 'Poblacion', 'Manila', 'Philippines', 14.5550, 121.0237, 4.5, true, ARRAY['football', 'sports bar', 'nightlife']),
  
  -- Cebu
  (gen_random_uuid(), NULL, 'The Social', 'the-social-cebu', 'IT Park', 'Cebu', 'Philippines', 10.3274, 123.9061, 4.6, true, ARRAY['football', 'rooftop', 'live events']),
  (gen_random_uuid(), NULL, 'Ibiza Beach Club', 'ibiza-beach-club-cebu', 'Mactan', 'Cebu', 'Philippines', 10.2995, 123.9811, 4.5, true, ARRAY['football', 'beach club', 'live match'])
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 🇮🇩 INDONESIA
-- ═══════════════════════════════════════════════════

INSERT INTO venues (id, owner_id, name, slug, address, city, country, latitude, longitude, qoe_score, is_verified, tags)
VALUES
  -- Jakarta
  (gen_random_uuid(), NULL, 'Immigrant', 'immigrant-jakarta', 'SCBD', 'Jakarta', 'Indonesia', -6.2259, 106.8050, 4.7, true, ARRAY['football', 'rooftop', 'premium']),
  (gen_random_uuid(), NULL, 'Colosseum Club', 'colosseum-jakarta', 'Kemang', 'Jakarta', 'Indonesia', -6.2615, 106.8170, 4.6, true, ARRAY['football', 'nightlife', 'live events']),
  (gen_random_uuid(), NULL, 'The Goods Diner', 'the-goods-diner-jakarta', 'SCBD', 'Jakarta', 'Indonesia', -6.2263, 106.8048, 4.5, true, ARRAY['football', 'american diner', 'sports bar']),
  
  -- Bali
  (gen_random_uuid(), NULL, 'La Favela', 'la-favela-bali', 'Seminyak', 'Bali', 'Indonesia', -8.6897, 115.1638, 4.8, true, ARRAY['football', 'beach club', 'live music']),
  (gen_random_uuid(), NULL, 'Finns Beach Club', 'finns-beach-club-bali', 'Canggu', 'Bali', 'Indonesia', -8.6482, 115.1380, 4.7, true, ARRAY['football', 'beach club', 'premium']),
  (gen_random_uuid(), NULL, 'Down Under Bar', 'down-under-bar-bali', 'Kuta', 'Bali', 'Indonesia', -8.7184, 115.1686, 4.4, true, ARRAY['football', 'aussie bar', 'live match'])
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 🇰🇭 CAMBODIA
-- ═══════════════════════════════════════════════════

INSERT INTO venues (id, owner_id, name, slug, address, city, country, latitude, longitude, qoe_score, is_verified, tags)
VALUES
  -- Phnom Penh
  (gen_random_uuid(), NULL, 'The Gym Bar', 'the-gym-bar-phnompenh', 'Street 178', 'Phnom Penh', 'Cambodia', 11.5564, 104.9282, 4.5, true, ARRAY['football', 'sports bar', 'live match']),
  (gen_random_uuid(), NULL, 'Score Sports Bar', 'score-sports-bar-phnompenh', 'Street 104', 'Phnom Penh', 'Cambodia', 11.5625, 104.9245, 4.4, true, ARRAY['football', 'american sports', 'pool']),
  
  -- Siem Reap
  (gen_random_uuid(), NULL, 'Angkor What? Bar', 'angkor-what-bar', 'Pub Street', 'Siem Reap', 'Cambodia', 13.3633, 103.8564, 4.6, true, ARRAY['football', 'backpacker', 'pub street']),
  (gen_random_uuid(), NULL, 'Temple Club', 'temple-club-siemreap', 'Pub Street', 'Siem Reap', 'Cambodia', 13.3630, 103.8560, 4.5, true, ARRAY['football', 'nightlife', 'live events'])
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 🇹🇼 TAIWAN
-- ═══════════════════════════════════════════════════

INSERT INTO venues (id, owner_id, name, slug, address, city, country, latitude, longitude, qoe_score, is_verified, tags)
VALUES
  -- Taipei
  (gen_random_uuid(), NULL, 'Brass Monkey', 'brass-monkey-taipei', 'Xinyi District', 'Taipei', 'Taiwan', 25.0330, 121.5654, 4.8, true, ARRAY['football', 'premier league', 'expat bar']),
  (gen_random_uuid(), NULL, 'Mao Livehouse', 'mao-livehouse-taipei', 'Roosevelt Road', 'Taipei', 'Taiwan', 25.0175, 121.5345, 4.6, true, ARRAY['football', 'live music', 'indie']),
  (gen_random_uuid(), NULL, 'Alchemy', 'alchemy-taipei', 'Daan District', 'Taipei', 'Taiwan', 25.0330, 121.5440, 4.7, true, ARRAY['football', 'craft beer', 'sports bar']),
  (gen_random_uuid(), NULL, 'The Brass Monkey Taipei 101', 'brass-monkey-taipei101', 'Taipei 101 Area', 'Taipei', 'Taiwan', 25.0339, 121.5645, 4.8, true, ARRAY['football', 'premier league', 'premium']),
  (gen_random_uuid(), NULL, 'Sports Alley', 'sports-alley-taipei', 'Xinyi District', 'Taipei', 'Taiwan', 25.0420, 121.5675, 4.5, true, ARRAY['football', 'american sports', 'live match'])
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- VERIFICATION
-- ═══════════════════════════════════════════════════

DO $$
BEGIN
    RAISE NOTICE '✅ Asian Cities Seed Data Loaded';
    RAISE NOTICE 'Total Venues: %', (SELECT count(*) FROM venues);
    RAISE NOTICE 'Countries: %', (SELECT count(DISTINCT country) FROM venues);
    RAISE NOTICE 'Cities: %', (SELECT count(DISTINCT city) FROM venues);
    
    -- List all cities
    RAISE NOTICE 'City breakdown:';
    PERFORM city, country, count(*) 
    FROM venues 
    GROUP BY city, country 
    ORDER BY country, city;
END $$;
