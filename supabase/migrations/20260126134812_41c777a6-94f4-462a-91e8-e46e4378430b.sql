-- The booking_availability view needs to access bookings table data
-- but we don't want anon/authenticated to access bookings directly
-- 
-- Solution: Use SECURITY DEFINER on the view to bypass RLS
-- First, drop and recreate the view with security_definer

DROP VIEW IF EXISTS public.booking_availability;

CREATE VIEW public.booking_availability
WITH (security_invoker = false) AS
SELECT 
    accommodation_id,
    start_date,
    end_date
FROM public.bookings;

-- Grant SELECT on the view to anon and authenticated
GRANT SELECT ON public.booking_availability TO anon;
GRANT SELECT ON public.booking_availability TO authenticated;