CREATE TABLE IF NOT EXISTS owners (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS shops (
  id TEXT PRIMARY KEY,
  owner_id TEXT REFERENCES owners(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('food', 'stay', 'shop', 'other')),
  halal_level TEXT NOT NULL CHECK(halal_level IN ('certified', 'friendly', 'pork_free', 'inquire')),
  has_prayer_space INTEGER DEFAULT 0,
  opening_hours TEXT,
  comment_ja TEXT,
  comment_en TEXT,
  comment_ms TEXT,
  comment_id TEXT,
  comment_bn TEXT,
  main_photo_url TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES shops(id),
  photo_url TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL CHECK(target_type IN ('shop', 'photo')),
  target_id TEXT NOT NULL,
  reason TEXT,
  resolved INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
