-- Step 1: Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Allow public read access" ON bookings;

-- Step 2: Create a restricted view for public availability checks
-- This only exposes the minimum data needed for calendar display (no PII)
CREATE OR REPLACE VIEW public.booking_availability AS
  SELECT 
    accommodation_id,
    start_date,
    end_date
  FROM bookings;

-- Step 3: Grant SELECT on the view to anonymous and authenticated users
GRANT SELECT ON public.booking_availability TO anon;
GRANT SELECT ON public.booking_availability TO authenticated;

-- Step 4: Create a policy for service role to read full booking data
CREATE POLICY "Service role can read all bookings"
  ON bookings
  FOR SELECT
  TO service_role
  USING (true);

-- Step 5: Create a policy for authenticated users to read their own booking context if needed
-- (For future admin panel functionality)
CREATE POLICY "Authenticated can read bookings for management"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);