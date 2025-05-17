-- Create notification tokens table
CREATE TABLE IF NOT EXISTS notification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'web',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, token)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_tokens_user_id ON notification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_tokens_token ON notification_tokens(token);

-- Add status field to notifications table if it doesn't already exist
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent';

-- Setup RLS policies
ALTER TABLE notification_tokens ENABLE ROW LEVEL SECURITY;

-- Token policies
CREATE POLICY "Users can manage their own tokens" 
  ON notification_tokens FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tokens" 
  ON notification_tokens FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Check if update_timestamp function exists
DO $
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_timestamp') THEN
    -- Create update_timestamp function if it doesn't exist
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $ LANGUAGE plpgsql;
  END IF;
END
$;

-- Add timestamp trigger
DROP TRIGGER IF EXISTS set_timestamp_notification_tokens ON notification_tokens;
CREATE TRIGGER set_timestamp_notification_tokens
BEFORE UPDATE ON notification_tokens
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
