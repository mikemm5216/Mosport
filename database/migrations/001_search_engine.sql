-- Mo Engine Search Migration
-- PostgreSQL Full-Text Search (FTS) + Trigram Setup
-- 
-- This enables:
-- 1. Full-text search on venue names and tags
-- 2. Fuzzy matching for typos (e.g., "Mancehster" -> "Manchester")
-- 3. Automatic search_vector updates via triggers

-- ═══════════════════════════════════════════════════
-- STEP 1: Enable Extensions
-- ═══════════════════════════════════════════════════

-- pg_trgm: Trigram-based fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ═══════════════════════════════════════════════════
-- STEP 2: Add Search Columns to Venues
-- ═══════════════════════════════════════════════════

-- Add tags column (e.g., ['football', 'sports bar', 'live events'])
ALTER TABLE venues ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add search_vector column (automatically generated from name + tags)
ALTER TABLE venues ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- ═══════════════════════════════════════════════════
-- STEP 3: Create Trigger to Auto-Update search_vector
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION venues_search_trigger() RETURNS trigger AS $$
BEGIN
  -- Combine venue name (weight A = highest) and tags (weight B)
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(new.tags, ' '), '')), 'B');
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to venues table
DROP TRIGGER IF EXISTS tsvectorupdate ON venues;
CREATE TRIGGER tsvectorupdate 
  BEFORE INSERT OR UPDATE ON venues
  FOR EACH ROW 
  EXECUTE FUNCTION venues_search_trigger();

-- ═══════════════════════════════════════════════════
-- STEP 4: Create Indexes for Fast Search
-- ═══════════════════════════════════════════════════

-- GIN index for full-text search (search_vector)
CREATE INDEX IF NOT EXISTS venues_search_idx ON venues USING GIN (search_vector);

-- GIN index for trigram fuzzy search on name
CREATE INDEX IF NOT EXISTS venues_name_trgm_idx ON venues USING GIN (name gin_trgm_ops);

-- Array index for tags
CREATE INDEX IF NOT EXISTS venues_tags_idx ON venues USING GIN (tags);

-- ═══════════════════════════════════════════════════
-- STEP 5: Update Existing Rows
-- ═══════════════════════════════════════════════════

-- Force update all existing venues to populate search_vector
UPDATE venues SET updated_at = NOW();

-- ═══════════════════════════════════════════════════
-- STEP 6: Add DTSS Status to Venues (for LiveSignal)
-- ═══════════════════════════════════════════════════

-- This column will store the current DTSS status for quick lookup
-- Values: 'NONE', 'T-7', 'T-24', 'T-1'
ALTER TABLE venues ADD COLUMN IF NOT EXISTS current_dtss_status VARCHAR(10) DEFAULT 'NONE';
CREATE INDEX IF NOT EXISTS venues_dtss_status_idx ON venues(current_dtss_status);

-- ═══════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ═══════════════════════════════════════════════════

-- Test full-text search:
-- SELECT name, ts_rank(search_vector, websearch_to_tsquery('english', 'football')) as rank
-- FROM venues
-- WHERE search_vector @@ websearch_to_tsquery('english', 'football')
-- ORDER BY rank DESC;

-- Test fuzzy search:
-- SELECT name, similarity(name, 'Mancehster') as sim
-- FROM venues
-- WHERE name % 'Mancehster'
-- ORDER BY sim DESC;
