-- Remove the overly permissive public SELECT policy on bookings table
-- This policy exposes external_id (booking.com reservation IDs) to the public
DROP POLICY IF EXISTS "Allow public to read bookings for availability" ON public.bookings;

-- Create a new restrictive policy that only allows reading via the booking_availability view
-- The booking_availability view uses security_invoker=on and only exposes non-sensitive columns
-- We need to allow SELECT for the view to work, but restrict it to only the columns needed

-- Instead of public access, we deny direct SELECT on bookings table
-- and rely on the booking_availability view which already filters columns
CREATE POLICY "Deny direct public select on bookings"
  ON public.bookings
  FOR SELECT
  TO anon
  USING (false);

-- Allow authenticated users (if any) to only see their own bookings through the view
-- For now, since there's no auth, we also deny authenticated direct access
CREATE POLICY "Deny direct authenticated select on bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (false);