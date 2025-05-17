
-- Complete BigDealEgypt Database Schema
-- This script creates the entire database schema with all tables, constraints, and policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'sales_ops', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER IF NOT EXISTS on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Chalet', 'Duplex', 'Office', 'Shop', 'Land')),
  location TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price > 0),
  bedrooms TEXT,
  bathrooms TEXT,
  area_size NUMERIC CHECK (area_size > 0),
  features JSONB DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  image_urls TEXT[],
  featured_image TEXT,
  created_by UUID REFERENCES profiles(id),
  verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Property request fields table (for dynamic form fields)
CREATE TABLE IF NOT EXISTS property_request_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_name TEXT NOT NULL UNIQUE,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'select', 'checkbox', 'textarea')),
  is_required BOOLEAN DEFAULT false,
  field_span TEXT DEFAULT 'full' CHECK (field_span IN ('full', 'half', 'third')),
  "order" INTEGER NOT NULL,
  placeholder TEXT,
  help_text TEXT,
  options TEXT, -- Comma-separated options for select fields
  min_value NUMERIC,
  max_value NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Property requests table
CREATE TABLE IF NOT EXISTS property_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Chalet', 'Duplex', 'Office', 'Shop', 'Land')),
  location TEXT NOT NULL,
  min_price NUMERIC NOT NULL CHECK (min_price >= 0),
  max_price NUMERIC NOT NULL CHECK (max_price > 0),
  bedrooms TEXT,
  bathrooms TEXT,
  area_size NUMERIC CHECK (area_size > 0),
  additional_features TEXT,
  custom_fields JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'closed', 'new', 'in_progress', 'matched', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES profiles(id),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Ensure max price is greater than min price
  CONSTRAINT check_price_range CHECK (max_price > min_price)
);

-- Create saved_properties table
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, property_id)
);

-- Create request status history table
CREATE TABLE IF NOT EXISTS request_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES property_requests(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  notes TEXT,
  is_private BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scheduled viewings table
CREATE TABLE IF NOT EXISTS scheduled_viewings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  request_id UUID REFERENCES property_requests(id),
  preferred_dates JSONB, -- Array of dates
  preferred_times JSONB, -- Array of time slots
  viewing_date DATE, -- Confirmed date
  viewing_time TEXT, -- Confirmed time
  notes TEXT,
  private_notes TEXT, -- Only visible to sales/admin
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT true,
  request_updates BOOLEAN DEFAULT true,
  viewing_reminders BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('property_request', 'viewing_scheduled', 'message', 'system', 'property_match')),
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  entity_id UUID,
  entity_type TEXT
);

-- Add index for faster queries by user for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Create conversations table for messages
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create property_features table
CREATE TABLE IF NOT EXISTS property_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create property_matches table
CREATE TABLE IF NOT EXISTS property_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES property_requests(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  match_score DECIMAL(5, 2) NOT NULL, -- Percentage match score
  is_viewed BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('suggested', 'accepted', 'rejected')) DEFAULT 'suggested',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (request_id, property_id)
);

-- Utility function for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
DO $$
DECLARE
  tables TEXT[] := ARRAY['profiles', 'properties', 'property_request_fields', 'property_requests', 
                        'scheduled_viewings', 'user_settings', 'conversations', 'property_matches'];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_timestamp ON %I;
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    ', t, t);
  END LOOP;
END
$$;

-- Utility function to automatically create user settings
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id) 
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user settings
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
AFTER INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION create_user_settings();

-- Function to find matching properties for a request
CREATE OR REPLACE FUNCTION find_property_matches(request_id UUID)
RETURNS TABLE (
  property_id UUID,
  title TEXT,
  property_type TEXT,
  location TEXT,
  price NUMERIC,
  match_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH request AS (
    SELECT * FROM property_requests WHERE id = request_id
  )
  SELECT 
    p.id,
    p.title,
    p.property_type,
    p.location,
    p.price,
    CASE 
      WHEN p.property_type = (SELECT property_type FROM request) THEN 25
      ELSE 0
    END +
    CASE 
      WHEN p.location = (SELECT location FROM request) THEN 25
      ELSE 0
    END +
    CASE 
      WHEN p.price BETWEEN (SELECT min_price FROM request) AND (SELECT max_price FROM request) THEN 25
      ELSE 0
    END +
    CASE 
      WHEN p.bedrooms = (SELECT bedrooms FROM request) OR (SELECT bedrooms FROM request) IS NULL THEN 15
      ELSE 0
    END +
    CASE 
      WHEN p.bathrooms = (SELECT bathrooms FROM request) OR (SELECT bathrooms FROM request) IS NULL THEN 10
      ELSE 0
    END AS match_score
  FROM 
    properties p
  WHERE 
    p.available = true
  ORDER BY 
    match_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to count unread notifications
CREATE OR REPLACE FUNCTION count_unread_notifications(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*) 
  INTO unread_count
  FROM notifications
  WHERE user_id = user_uuid AND is_read = false;
  
  RETURN unread_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix property requests UUID function
CREATE OR REPLACE FUNCTION fix_property_requests_user_id()
RETURNS TEXT AS $$
DECLARE
  inconsistent_records INTEGER;
  fixed_records INTEGER;
BEGIN
  -- Check if we have any inconsistent UUID formats
  SELECT COUNT(*)
  INTO inconsistent_records
  FROM property_requests
  WHERE user_id::TEXT != user_id::UUID::TEXT;
  
  -- If we have inconsistent records, let's fix them
  IF inconsistent_records > 0 THEN
    -- Update the records to ensure UUID consistency
    WITH updated AS (
      UPDATE property_requests
      SET user_id = user_id::UUID
      WHERE user_id::TEXT != user_id::UUID::TEXT
      RETURNING *
    )
    SELECT COUNT(*) INTO fixed_records FROM updated;
    
    RETURN 'Fixed ' || fixed_records || ' records with inconsistent UUID formats';
  ELSE
    RETURN 'No inconsistent UUID formats found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Debug view for property requests
CREATE OR REPLACE VIEW debug_property_requests AS
SELECT 
  pr.id,
  pr.user_id,
  pr.title,
  pr.property_type,
  pr.status,
  pr.created_at,
  p.email as user_email,
  p.name as user_name,
  user_id::TEXT as user_id_text,
  user_id::UUID::TEXT as user_id_uuid_text
FROM 
  property_requests pr
LEFT JOIN
  profiles p ON pr.user_id = p.id;

-- Function to get property requests by email
CREATE OR REPLACE FUNCTION get_property_requests_by_email(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_agg(data)
  INTO result
  FROM (
    SELECT 
      pr.*
    FROM 
      property_requests pr
    JOIN
      profiles p ON pr.user_id = p.id
    WHERE 
      p.email = user_email
    ORDER BY 
      pr.created_at DESC
  ) data;
  
  RETURN COALESCE(result, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for improved performance
CREATE INDEX IF NOT EXISTS idx_property_requests_status ON property_requests(status);
CREATE INDEX IF NOT EXISTS idx_property_requests_user_id ON property_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_property_requests_assigned_to ON property_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_available ON properties(available);
CREATE INDEX IF NOT EXISTS idx_scheduled_viewings_status ON scheduled_viewings(status);
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_property_matches_request_id ON property_matches(request_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_request_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_matches ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profiles" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can insert profiles" 
  ON profiles FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can delete profiles" 
  ON profiles FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Properties policies
CREATE POLICY "Properties are viewable by everyone" 
  ON properties FOR SELECT USING (true);

CREATE POLICY "Sales ops and admins can insert properties" 
  ON properties FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Sales ops and admins can update properties" 
  ON properties FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Admins can delete properties" 
  ON properties FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Property features policies
CREATE POLICY "Anyone can view property features" 
  ON property_features FOR SELECT USING (true);

CREATE POLICY "Sales ops and admins can manage property features" 
  ON property_features FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Sales ops and admins can update property features" 
  ON property_features FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Sales ops and admins can delete property features" 
  ON property_features FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

-- Property request fields policies
CREATE POLICY "Everyone can view request fields" 
  ON property_request_fields FOR SELECT USING (true);

CREATE POLICY "Admins can insert request fields" 
  ON property_request_fields FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can update request fields" 
  ON property_request_fields FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can delete request fields" 
  ON property_request_fields FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Property requests policies
CREATE POLICY "Users can view their own requests" 
  ON property_requests FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Users can insert their own requests" 
  ON property_requests FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update their own requests" 
  ON property_requests FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Users can delete their own requests, admins can delete any" 
  ON property_requests FOR DELETE USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Property matches policies
CREATE POLICY "Users can view matches for their requests" 
  ON property_matches FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM property_requests WHERE id = request_id
    ) OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Sales ops and admins can insert matches" 
  ON property_matches FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Users can update match status for their requests" 
  ON property_matches FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM property_requests WHERE id = request_id
    ) OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

-- Request status history policies
CREATE POLICY "Users can view non-private status history" 
  ON request_status_history FOR SELECT USING (
    (NOT is_private AND 
     auth.uid() IN (
       SELECT user_id FROM property_requests WHERE id = request_id
     )
    ) OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Sales ops and admins can insert status history" 
  ON request_status_history FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

-- Scheduled viewings policies
CREATE POLICY "Users can view their own viewings" 
  ON scheduled_viewings FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Users can request viewings" 
  ON scheduled_viewings FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update their own pending viewings" 
  ON scheduled_viewings FOR UPDATE USING (
    (auth.uid() = user_id AND status = 'pending') OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

-- User settings policies
CREATE POLICY "Users can view their own settings" 
  ON user_settings FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Users can update their own settings" 
  ON user_settings FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update their own settings" 
  ON user_settings FOR UPDATE USING (
    auth.uid() = user_id
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON notifications FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
  ON notifications FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "System and admins can insert notifications" 
  ON notifications FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') OR 
    auth.uid() = user_id
  );

-- Conversations policies
CREATE POLICY "Users can view their own conversations" 
  ON conversations FOR SELECT USING (
    auth.uid() = customer_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Users can create their own conversations" 
  ON conversations FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own conversations" 
  ON conversations FOR UPDATE USING (
    auth.uid() = customer_id OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

-- Messages policies
CREATE POLICY "Users can view their own messages" 
  ON messages FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin'))
  );

CREATE POLICY "Users can send messages" 
  ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark messages as read" 
  ON messages FOR UPDATE USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Saved properties policies
CREATE POLICY "Users can view their own saved properties" 
  ON saved_properties FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved properties" 
  ON saved_properties FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved properties" 
  ON saved_properties FOR DELETE USING (auth.uid() = user_id);
