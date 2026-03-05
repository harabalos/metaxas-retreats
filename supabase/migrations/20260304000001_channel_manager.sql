-- ============================================================
-- Channel Manager Migration
-- Adds new tables and extends bookings for the owner portal
-- ============================================================

-- Extend bookings table with guest + payment info
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS guest_name text,
  ADD COLUMN IF NOT EXISTS guest_email text,
  ADD COLUMN IF NOT EXISTS guest_phone text,
  ADD COLUMN IF NOT EXISTS num_guests integer,
  ADD COLUMN IF NOT EXISTS total_price numeric,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS booking_reference text,
  ADD COLUMN IF NOT EXISTS platform_url text;

-- Index for faster calendar queries
CREATE INDEX IF NOT EXISTS bookings_accommodation_dates_idx
  ON bookings (accommodation_id, start_date, end_date);

-- ── calendar_sources ──────────────────────────────────────
-- Stores iCal feed URLs per accommodation per platform
-- Replaces hardcoded env vars in sync-calendars edge function
CREATE TABLE IF NOT EXISTS calendar_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accommodation_id text NOT NULL,
  platform text NOT NULL,  -- 'airbnb' | 'booking' | 'vrbo' | 'other'
  ical_url text NOT NULL,
  enabled boolean DEFAULT true,
  last_synced_at timestamptz,
  last_sync_status text,   -- 'success' | 'error' | 'pending'
  last_sync_count integer,
  last_sync_error text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can manage calendar_sources"
  ON calendar_sources FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── sync_logs ─────────────────────────────────────────────
-- History of every sync run
CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accommodation_id text,
  platform text,
  events_synced integer DEFAULT 0,
  status text,             -- 'success' | 'error'
  error_message text,
  synced_at timestamptz DEFAULT now()
);

ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read sync_logs"
  ON sync_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role (edge functions) can insert
CREATE POLICY "Service role can insert sync_logs"
  ON sync_logs FOR INSERT
  WITH CHECK (true);

-- ── inquiries ─────────────────────────────────────────────
-- Stores all contact/booking form submissions
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text,
  email text,
  phone text,
  accommodation_id text,
  check_in text,
  check_out text,
  num_guests integer,
  message text,
  status text DEFAULT 'new',  -- 'new' | 'replied' | 'converted' | 'closed'
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can manage inquiries"
  ON inquiries FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Anyone can insert (from contact form via edge function)
CREATE POLICY "Anyone can insert inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- ── settings ──────────────────────────────────────────────
-- Owner-configurable key-value store (contact info, bank details, etc.)
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can manage settings"
  ON settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Seed default setting keys so they appear in the UI
INSERT INTO settings (key, value) VALUES
  ('contact_phone_1', '+30 6973219980'),
  ('contact_phone_2', ''),
  ('contact_email', 'metaxasretreats@gmail.com'),
  ('contact_whatsapp_1', '+306973219980'),
  ('contact_whatsapp_2', ''),
  ('contact_address', 'Poros, Mikros Gialos, Lefkada, Greece'),
  ('bank_name', 'Piraeus Bank'),
  ('bank_holder', ''),
  ('bank_iban', 'GR16 0172 2020 0052 2012 9152 477'),
  ('bank_bic', 'PIRBGRAA'),
  ('bank_note', 'Please use your full name and check-in date as payment reference.'),
  ('notification_email', 'metaxasretreats@gmail.com')
ON CONFLICT (key) DO NOTHING;
