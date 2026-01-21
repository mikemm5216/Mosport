-- Mosport Database Schema (Neon PostgreSQL)
-- Deployment: AWS Singapore (ap-southeast-1)
-- Architecture: Hot Zone / Vault / Dump

-- ═══════════════════════════════════════════════════
-- HOT ZONE: Base Data (Public Profile Info)
-- ═══════════════════════════════════════════════════

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(10) NOT NULL CHECK (role IN ('FAN', 'VENUE', 'STAFF')),
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  picture_url TEXT,
  provider VARCHAR(20) CHECK (provider IN ('google', 'facebook', 'zalo')),
  is_guest BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Venues Table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  description TEXT,
  phone VARCHAR(50),
  website_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  qoe_score DECIMAL(3, 2) DEFAULT 0.00 CHECK (qoe_score >= 0 AND qoe_score <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_venues_location ON venues(latitude, longitude);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  league VARCHAR(100) NOT NULL,
  sport VARCHAR(50) NOT NULL CHECK (sport IN ('football', 'basketball', 'baseball', 'volleyball', 'esports')),
  team_a VARCHAR(100) NOT NULL,
  team_b VARCHAR(100) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')),
  external_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_sport ON events(sport);
CREATE INDEX idx_events_league ON events(league);

-- Venue-Event Matching (Broadcasting Schedule)
CREATE TABLE IF NOT EXISTS venue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  verification_status VARCHAR(20) DEFAULT 'predicted' CHECK (verification_status IN ('predicted', 'confirmed', 'authority')),
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(venue_id, event_id)
);

CREATE INDEX idx_venue_events_venue ON venue_events(venue_id);
CREATE INDEX idx_venue_events_event ON venue_events(event_id);
CREATE INDEX idx_venue_events_status ON venue_events(verification_status);

-- ═══════════════════════════════════════════════════
-- VAULT: Encrypted Sensitive Data
-- ═══════════════════════════════════════════════════

-- OAuth Tokens (AES-256 Encrypted)
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL,
  -- Note: In production, use pgcrypto extension for field-level encryption
  -- e.g., access_token BYTEA (encrypted with AES-256-GCM)
  access_token_encrypted TEXT NOT NULL, -- Placeholder for encrypted token
  refresh_token_encrypted TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

CREATE INDEX idx_oauth_tokens_user ON oauth_tokens(user_id);

-- ═══════════════════════════════════════════════════
-- DUMP: Social Index Cache (Auto-Deleted)
-- ═══════════════════════════════════════════════════

-- Social Posts Cache (ON DELETE CASCADE from users)
CREATE TABLE IF NOT EXISTS social_posts_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL,
  post_content TEXT,
  post_url TEXT,
  posted_at TIMESTAMPTZ,
  keywords TEXT[], -- Array of extracted keywords
  ttl_expires_at TIMESTAMPTZ NOT NULL, -- Auto-cleanup trigger
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_social_cache_user ON social_posts_cache(user_id);
CREATE INDEX idx_social_cache_venue ON social_posts_cache(venue_id);
CREATE INDEX idx_social_cache_ttl ON social_posts_cache(ttl_expires_at);

-- Auto-cleanup function for TTL
CREATE OR REPLACE FUNCTION cleanup_expired_social_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM social_posts_cache WHERE ttl_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════
-- ANALYTICS & TRUST SCORING
-- ═══════════════════════════════════════════════════

-- User Trust Score (based on Social Analyzer)
CREATE TABLE IF NOT EXISTS user_trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trust_score DECIMAL(3, 2) DEFAULT 0.00 CHECK (trust_score >= 0 AND trust_score <= 10),
  sports_affinity JSONB, -- { "football": 8.5, "basketball": 3.2 }
  favorite_teams TEXT[],
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_trust_scores_user ON user_trust_scores(user_id);

-- DTSS Verification Logs (T-7, T-24, T-1)
CREATE TABLE IF NOT EXISTS dtss_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_event_id UUID NOT NULL REFERENCES venue_events(id) ON DELETE CASCADE,
  check_type VARCHAR(10) NOT NULL CHECK (check_type IN ('T-7', 'T-24', 'T-1')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('confirmed', 'rejected', 'pending')),
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB -- Additional verification data
);

CREATE INDEX idx_dtss_venue_event ON dtss_verifications(venue_event_id);
CREATE INDEX idx_dtss_check_type ON dtss_verifications(check_type);

-- ═══════════════════════════════════════════════════
-- TRIGGERS FOR UPDATED_AT
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oauth_tokens_updated_at BEFORE UPDATE ON oauth_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
