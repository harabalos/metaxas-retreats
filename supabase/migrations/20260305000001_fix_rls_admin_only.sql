-- ============================================================
-- Security fix: restrict all write operations to admin only.
-- Replaces overly-permissive "any authenticated user" policies
-- with an is_admin() check bound to the owner's email.
-- ============================================================

-- Helper function in public schema (auth schema is restricted on Supabase).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT auth.jwt() ->> 'email' = 'metaxasretreats@gmail.com'
$$;

-- ── accommodations ────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow authenticated users to insert accommodations" ON public.accommodations;
DROP POLICY IF EXISTS "Allow authenticated users to update accommodations"  ON public.accommodations;
DROP POLICY IF EXISTS "Allow authenticated users to delete accommodations"  ON public.accommodations;

CREATE POLICY "Admin can insert accommodations"
  ON public.accommodations FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update accommodations"
  ON public.accommodations FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can delete accommodations"
  ON public.accommodations FOR DELETE
  USING (public.is_admin());

-- ── accommodation_prices ──────────────────────────────────────
DROP POLICY IF EXISTS "Allow authenticated users to insert prices" ON public.accommodation_prices;
DROP POLICY IF EXISTS "Allow authenticated users to update prices" ON public.accommodation_prices;
DROP POLICY IF EXISTS "Allow authenticated users to delete prices" ON public.accommodation_prices;

CREATE POLICY "Admin can insert prices"
  ON public.accommodation_prices FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update prices"
  ON public.accommodation_prices FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can delete prices"
  ON public.accommodation_prices FOR DELETE
  USING (public.is_admin());

-- ── calendar_sources ──────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated can manage calendar_sources" ON public.calendar_sources;

CREATE POLICY "Admin can manage calendar_sources"
  ON public.calendar_sources FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── settings ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated can manage settings" ON public.settings;

CREATE POLICY "Admin can manage settings"
  ON public.settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── inquiries ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated can manage inquiries" ON public.inquiries;

CREATE POLICY "Admin can manage inquiries"
  ON public.inquiries FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── bookings ──────────────────────────────────────────────────
-- Service role (edge functions) bypasses RLS entirely.
-- This policy only restricts direct user-facing API access.
DROP POLICY IF EXISTS "Admin can manage bookings" ON public.bookings;

CREATE POLICY "Admin can manage bookings"
  ON public.bookings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
