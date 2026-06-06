-- Migration 006: remove CHECK constraint on reports.target_type
-- (to support target_type='general' for app-level feedback)
CREATE TABLE reports_new (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  category TEXT,
  reason TEXT,
  contact_email TEXT,
  resolved INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
INSERT INTO reports_new SELECT id, target_type, target_id, category, reason, contact_email, resolved, created_at FROM reports;
DROP TABLE reports;
ALTER TABLE reports_new RENAME TO reports;
