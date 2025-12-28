-- Fix the SECURITY DEFINER view issue by explicitly setting SECURITY INVOKER
DROP VIEW IF EXISTS public.booking_availability;

CREATE VIEW public.booking_availability 
WITH (security_invoker = true) AS
  SELECT 
    accommodation_id,
    start_date,
    end_date
  FROM bookings;

-- Re-grant permissions
GRANT SELECT ON public.booking_availability TO anon;
GRANT SELECT ON public.booking_availability TO authenticated;