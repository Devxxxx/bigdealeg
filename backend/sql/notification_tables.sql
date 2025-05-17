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

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  related_entity_id UUID,
  related_entity_type TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Setup RLS policies
ALTER TABLE notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Token policies
CREATE POLICY "Users can manage their own tokens" 
  ON notification_tokens FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tokens" 
  ON notification_tokens FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Notification policies
CREATE POLICY "Users can view their own notifications" 
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" 
  ON notifications FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Check if update_timestamp function exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_timestamp') THEN
    -- Create update_timestamp function if it doesn't exist
    CREATE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END
$$;

-- Add timestamp triggers
DROP TRIGGER IF EXISTS set_timestamp_notification_tokens ON notification_tokens;
CREATE TRIGGER set_timestamp_notification_tokens
BEFORE UPDATE ON notification_tokens
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_notifications ON notifications;
CREATE TRIGGER set_timestamp_notifications
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
