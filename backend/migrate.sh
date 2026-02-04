#!/bin/bash
# Migration script for Mo Engine search system
# This will be executed on Railway startup

echo "🔧 Running Mo Engine migration..."

psql $DATABASE_URL <<'EOSQL'
-- Enable pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add search columns (existing)
ALTER TABLE venues ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE venues ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS current_dtss_status VARCHAR(10) DEFAULT 'NONE';

-- ==================== Dashboard Features Migration ====================

-- Update User table with points and tier
ALTER TABLE users ADD COLUMN IF NOT EXISTS mosport_points INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'Bronze';

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL, -- 'event', 'venue', 'sport'
    target_id UUID,
    sport VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_favorite_user ON favorites(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_favorite_unique ON favorites(user_id, target_type, target_id, sport);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    points_earned INTEGER DEFAULT 10,
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_checkin_user ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkin_venue ON check_ins(venue_id);
CREATE INDEX IF NOT EXISTS idx_checkin_timestamp ON check_ins(checked_in_at);

-- Create mosport_transactions table
CREATE TABLE IF NOT EXISTS mosport_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'check_in', 'review', 'favorite', 'redeem'
    points_change INTEGER NOT NULL,
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transaction_user ON mosport_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_created ON mosport_transactions(created_at);

-- Create vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    discount VARCHAR(100) NOT NULL,
    qr_code VARCHAR(255) UNIQUE,
    condition TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    is_redeemed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voucher_user ON vouchers(user_id);
CREATE INDEX IF NOT EXISTS idx_voucher_venue ON vouchers(venue_id);
CREATE INDEX IF NOT EXISTS idx_voucher_qr ON vouchers(qr_code);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    condition VARCHAR(255),
    discount VARCHAR(100) NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    target_audience VARCHAR(20) DEFAULT 'all',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promotion_venue ON promotions(venue_id);
CREATE INDEX IF NOT EXISTS idx_promotion_active ON promotions(is_active);

-- Create broadcaster_sessions table
CREATE TABLE IF NOT EXISTS broadcaster_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'LIVE',
    signal_strength INTEGER,
    live_audience INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_broadcaster_venue ON broadcaster_sessions(venue_id);
CREATE INDEX IF NOT EXISTS idx_broadcaster_event ON broadcaster_sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_broadcaster_status ON broadcaster_sessions(status);

-- ==================== Existing Search Triggers ====================

-- Create trigger function for auto-updating search_vector
CREATE OR REPLACE FUNCTION venues_search_trigger() RETURNS trigger AS $$
BEGIN
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

-- Create indexes for fast search
CREATE INDEX IF NOT EXISTS venues_search_idx ON venues USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS venues_name_trgm_idx ON venues USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS venues_tags_idx ON venues USING GIN (tags);
CREATE INDEX IF NOT EXISTS venues_dtss_status_idx ON venues(current_dtss_status);

-- V6.2 WBC Data
ALTER TABLE venues ADD COLUMN IF NOT EXISTS event_tags TEXT[] DEFAULT '{}';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS fan_base VARCHAR(255);


EOSQL

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully"
else
    echo "⚠️ Migration failed, but continuing..."
fi

