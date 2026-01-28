-- Mosport V6.1 Migration Script
-- Identity & Entry Flow Alignment

-- 1. Enable pgcrypto for UUID generation if not exists (good practice for guest_id if we switch later)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Venues Table Extension
-- Adding JSONB columns for flexible features/vibes and social signals
ALTER TABLE venues
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS vibes JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS verified_status BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS social_count INTEGER DEFAULT 0;

-- 3. Users Table Extension (Role System)
-- Adding role for RBAC and oauth_provider for Identity
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'fan',
ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(20);

-- 4. Audit & Log Schema (Internal Verification)
-- For B2B Data License logic and internal audit
CREATE TABLE IF NOT EXISTS verification_logs (
  id SERIAL PRIMARY KEY,
  venue_id UUID,  -- Changed from INTEGER to UUID for consistency
  action VARCHAR(50), -- approve / revoke / suspend
  operator_id UUID,  -- Changed from INTEGER to UUID, refers to a User with 'staff' role
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_logs_venue ON verification_logs(venue_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verification_logs_operator ON verification_logs(operator_id);

-- Indexing for performance (Mo Engine V2.1)
-- "Live Status (dtss_status = T-1)" and "Verified Venue" are top ranking factors
CREATE INDEX IF NOT EXISTS idx_venues_verified ON venues(verified_status);
-- JSONB GIN indexes for fast tag searching
CREATE INDEX IF NOT EXISTS idx_venues_features ON venues USING GIN (features);
CREATE INDEX IF NOT EXISTS idx_venues_vibes ON venues USING GIN (vibes);

-- 5. Comment on columns for documentation
COMMENT ON COLUMN venues.features IS 'Flexible storage for venue amenities (e.g., {"big_screen": true})';
COMMENT ON COLUMN venues.social_count IS 'Derived signal from external sources (reset/updated dynamically)';
COMMENT ON TABLE verification_logs IS 'Immutable log of all verification actions for due diligence';
