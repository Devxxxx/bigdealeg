-- Add new fields to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS project_name TEXT,
ADD COLUMN IF NOT EXISTS compound_name TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS geo_location POINT;

-- Create property_images table with image_type column
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('property', 'master_plan', 'compound')),
  is_featured BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for property images
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_type ON property_images(image_type);

-- Row Level Security (RLS) Policies for property_images
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Property images policies
CREATE POLICY "Anyone can view property images" 
  ON property_images FOR SELECT USING (true);

CREATE POLICY "Sales ops and admins can manage property images" 
  ON property_images FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Sales ops and admins can update property images" 
  ON property_images FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

CREATE POLICY "Sales ops and admins can delete property images" 
  ON property_images FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('sales_ops', 'admin'))
  );

-- Add timestamp trigger for property_images
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON property_images
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
