-- ============================================
-- APEX10 INITIAL MIGRATION
-- Creates all tables for the application
-- ============================================

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  website TEXT,
  whitepaper TEXT,
  coingecko_id TEXT,
  logo_url TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Rankings table
CREATE TABLE IF NOT EXISTS rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  overall_score REAL NOT NULL,
  potential_score REAL NOT NULL,
  utility_score REAL NOT NULL,
  developer_score REAL NOT NULL,
  adoption_score REAL NOT NULL,
  risk_level TEXT NOT NULL,
  strengths TEXT,
  weaknesses TEXT,
  analysis_notes TEXT,
  ranked_at INTEGER DEFAULT (unixepoch())
);

-- Security content table
CREATE TABLE IF NOT EXISTS security_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT,
  "order" INTEGER DEFAULT 0,
  metadata TEXT,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Users table (Phase 2)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  preferences TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  last_login_at INTEGER
);

-- Watchlists table
CREATE TABLE IF NOT EXISTS watchlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  notes TEXT,
  alert_price REAL,
  added_at INTEGER DEFAULT (unixepoch())
);

-- Price snapshots table
CREATE TABLE IF NOT EXISTS price_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  price_usd REAL NOT NULL,
  market_cap REAL,
  volume_24h REAL,
  change_24h REAL,
  change_7d REAL,
  snapshot_at INTEGER DEFAULT (unixepoch())
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_rankings_asset_id ON rankings(asset_id);
CREATE INDEX IF NOT EXISTS idx_rankings_rank ON rankings(rank);
CREATE INDEX IF NOT EXISTS idx_security_content_type ON security_content(type);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_asset_id ON price_snapshots(asset_id);
