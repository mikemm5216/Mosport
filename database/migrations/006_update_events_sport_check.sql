-- 006_update_events_sport_check.sql

-- Drop existing check constraint
ALTER TABLE events
DROP CONSTRAINT IF EXISTS events_sport_check;

-- Add new check constraint with expanded list of V6.5 sports
ALTER TABLE events
ADD CONSTRAINT events_sport_check 
CHECK (sport IN (
    'football', 'soccer', 
    'basketball', 
    'baseball', 
    'volleyball', 
    'esports', 
    'american-football', 'nfl', -- Supporting both codes just in case
    'f1', 'formula-1',
    'badminton', 
    'tennis', 
    'table-tennis', 
    'cricket', 
    'muay-thai', 
    'martial-arts', 'mma',
    'rugby', 
    'golf', 
    'billiards',
    'hockey'
));
