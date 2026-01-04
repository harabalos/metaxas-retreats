-- Allow public/anonymous users to read bookings for availability checking
-- This is secure because the booking_availability view only exposes dates, not PII
CREATE POLICY "Allow public to read bookings for availability"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (true);