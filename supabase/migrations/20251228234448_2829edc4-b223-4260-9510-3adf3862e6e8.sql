-- Drop the authenticated read policy that's too permissive
DROP POLICY IF EXISTS "Authenticated can read bookings for management" ON bookings;

-- Create a more restrictive policy for authenticated users
-- Only allow reading if they will eventually have a user_id match (future feature)
-- For now, only service role can read full booking data
-- Authenticated users will use the view for availability checks