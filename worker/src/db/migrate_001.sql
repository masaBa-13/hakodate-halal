ALTER TABLE shops ADD COLUMN submitter_type TEXT NOT NULL DEFAULT 'owner';
ALTER TABLE shops ADD COLUMN submitter_name TEXT;
ALTER TABLE shops ADD COLUMN submitter_email TEXT;
ALTER TABLE shops ADD COLUMN submitter_phone TEXT;
ALTER TABLE shops ADD COLUMN submitter_nickname TEXT;
