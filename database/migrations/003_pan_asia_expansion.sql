-- Mosport Migration 003: Pan-Asia Expansion
-- Adding fields to support multi-country venue data

-- ═══════════════════════════════════════════════════
-- STEP 1: Add new columns to venues table
-- ═══════════════════════════════════════════════════

ALTER TABLE venues
-- Geography Enhancement
ADD COLUMN IF NOT EXISTS district VARCHAR(50),                   -- e.g. "Sukhumvit", "Tay Ho", "Xinyi"
ADD COLUMN IF NOT EXISTS city_tier INTEGER DEFAULT 0,            -- 0: Crawl, 1: Pilot (operational)

-- Data Source & Localization
ADD COLUMN IF NOT EXISTS source_type VARCHAR(20) DEFAULT 'manual',    -- 'manual', 'ai_scraped', 'partner_api'
ADD COLUMN IF NOT EXISTS english_friendly BOOLEAN DEFAULT FALSE,      -- Critical for JP/KR/TW non-English venues
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';                    -- Array of string tags

-- ═══════════════════════════════════════════════════
-- STEP 2: Create indexes for new fields
-- ═══════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_venues_district ON venues(district);
CREATE INDEX IF NOT EXISTS idx_venues_city_tier ON venues(city_tier);
CREATE INDEX IF NOT EXISTS idx_venues_english_friendly ON venues(english_friendly);

-- Composite index for city + country searches
CREATE INDEX IF NOT EXISTS idx_venues_country_city ON venues(country, city);

-- ═══════════════════════════════════════════════════
-- STEP 3: Update existing venues metadata
-- ═══════════════════════════════════════════════════

-- Mark Vietnam cities as Tier 1 (Pilot cities)
UPDATE venues 
SET city_tier = 1
WHERE country = 'Vietnam' AND city IN ('Ha Noi', 'Bac Ninh');

-- Set all existing venues as manual source
UPDATE venues 
SET source_type = 'manual'
WHERE source_type IS NULL;

-- Mark venues in predominantly English-speaking cities as english_friendly
UPDATE venues 
SET english_friendly = TRUE
WHERE country IN ('Singapore') 
   OR city IN ('Bangkok', 'Manila', 'Kuala Lumpur', 'Taipei', 'Ho Chi Minh City');

-- ═══════════════════════════════════════════════════
-- STEP 4: Add comments for documentation
-- ═══════════════════════════════════════════════════

COMMENT ON COLUMN venues.district IS 'Sub-city area/neighborhood (e.g., Sukhumvit, Xinyi District)';
COMMENT ON COLUMN venues.city_tier IS 'Operational tier: 0=Not launched, 1=Pilot city, 2=Fully operational';
COMMENT ON COLUMN venues.source_type IS 'Data source: manual, ai_scraped, partner_api';
COMMENT ON COLUMN venues.english_friendly IS 'Whether venue staff/menu commonly use English';

-- ═══════════════════════════════════════════════════
-- VERIFICATION
-- ═══════════════════════════════════════════════════

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 003 completed';
    RAISE NOTICE 'New columns added: district, city_tier, source_type, english_friendly';
    RAISE NOTICE 'Tier 1 cities: %', (SELECT count(*) FROM venues WHERE city_tier = 1);
    RAISE NOTICE 'English-friendly venues: %', (SELECT count(*) FROM venues WHERE english_friendly = TRUE);
END $$;
