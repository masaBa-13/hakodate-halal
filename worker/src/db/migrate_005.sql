-- Migration 005: add category and contact_email to reports table
ALTER TABLE reports ADD COLUMN category TEXT;
ALTER TABLE reports ADD COLUMN contact_email TEXT;
