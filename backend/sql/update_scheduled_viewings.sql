-- This script updates the scheduled_viewings table to support the multi-step property viewing process

-- Step 1: Modify the CHECK constraint to allow our new status values
ALTER TABLE scheduled_viewings 
DROP CONSTRAINT scheduled_viewings_status_check;

ALTER TABLE scheduled_viewings 
ADD CONSTRAINT scheduled_viewings_status_check 
CHECK (status IN ('pending', 'requested', 'options_sent', 'slot_selected', 'confirmed', 'cancelled', 'completed'));

-- Step 2: Add new columns for the proposed and selected slots
ALTER TABLE scheduled_viewings 
ADD COLUMN IF NOT EXISTS proposed_dates TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS proposed_times TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS selected_date DATE,
ADD COLUMN IF NOT EXISTS selected_time TEXT;

-- Step 3: Update existing status values (Convert 'pending' to 'requested')
UPDATE scheduled_viewings
SET status = 'requested'
WHERE status = 'pending';

-- Step 4: Create a comment explaining the new status flow
COMMENT ON COLUMN scheduled_viewings.status IS 'Status of the viewing: requested -> options_sent -> slot_selected -> confirmed -> completed/cancelled';

-- Step 5: Create an index on the status column for faster filtering
CREATE INDEX IF NOT EXISTS idx_scheduled_viewings_status ON scheduled_viewings(status);

-- Step 6: Create activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Step 7: Add triggers to track status changes
CREATE OR REPLACE FUNCTION log_viewing_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO activity_logs (
            user_id,
            action_type,
            entity_type,
            entity_id,
            details,
            created_at
        ) VALUES (
            NEW.user_id,
            'status_change',
            'scheduled_viewing',
            NEW.id,
            json_build_object('from_status', OLD.status, 'to_status', NEW.status),
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'viewing_status_change_trigger'
    ) THEN
        CREATE TRIGGER viewing_status_change_trigger
        AFTER UPDATE ON scheduled_viewings
        FOR EACH ROW
        WHEN (OLD.status IS DISTINCT FROM NEW.status)
        EXECUTE FUNCTION log_viewing_status_change();
    END IF;
END $$;