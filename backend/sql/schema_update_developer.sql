-- Add developer_name field to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS developer_name TEXT;
