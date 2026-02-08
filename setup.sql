-- Bowling Availability App - Database Setup
-- Run this file to set up your PostgreSQL database

-- 1. Create tables
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  rotation_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE match_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_date DATE NOT NULL UNIQUE,
  bye_player_id UUID REFERENCES players(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_day_id UUID REFERENCES match_days(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_day_id, player_id)
);

-- 2. Create indexes
CREATE INDEX idx_match_days_date ON match_days(match_date);
CREATE INDEX idx_availability_match_day ON availability(match_day_id);
CREATE INDEX idx_availability_player ON availability(player_id);

-- 3. Insert initial players
INSERT INTO players (name, rotation_order) VALUES
  ('Jeff', 1),
  ('Neil', 2),
  ('Peter', 3),
  ('Tim', 4),
  ('Jay', 5);

-- Done! Your database is ready.
