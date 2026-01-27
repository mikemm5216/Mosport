#!/bin/bash
# Migration script for Mo Engine search system
# This will be executed on Railway startup

echo "🔧 Running Mo Engine migration..."

psql $DATABASE_URL << 'EOSQL'
-- Enable pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add search columns
ALTER TABLE venues ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE venues ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS current_dtss_status VARCHAR(10) DEFAULT 'NONE';

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

EOSQL

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully"
else
    echo "⚠️ Migration failed, but continuing..."
fi
