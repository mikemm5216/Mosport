-- 005_add_event_confidence_score.sql

-- Add confidence_score column to events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3, 2) DEFAULT 0.00;

-- Optional: Add index if we plan to sort/filter by confidence often
CREATE INDEX IF NOT EXISTS idx_events_confidence ON events(confidence_score);
