// Shared types for Channel Manager tabs

export interface AccommodationRow {
  id: string;
  slug: string;
  name: Record<string, string>;
  type: string;
  description: Record<string, string>;
  short_description: Record<string, string>;
  base_price: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  accommodation_prices: PriceRow[];
}

export interface PriceRow {
  id?: string;
  season: string;
  price: number;
  months: string;
}

export interface BookingRow {
  id: string;
  accommodation_id: string;
  source: string;
  start_date: string;
  end_date: string;
  external_id: string | null;
  created_at: string | null;
  // Extended fields
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  num_guests: number | null;
  total_price: number | null;
  payment_status: string | null;
  notes: string | null;
  booking_reference: string | null;
  platform_url: string | null;
}

export interface CalendarSource {
  id: string;
  accommodation_id: string;
  platform: string;
  ical_url: string;
  enabled: boolean;
  last_synced_at: string | null;
  last_sync_status: string | null;
  last_sync_count: number | null;
  last_sync_error: string | null;
  created_at: string;
}

export interface SyncLog {
  id: string;
  accommodation_id: string | null;
  platform: string | null;
  events_synced: number;
  status: string | null;
  error_message: string | null;
  synced_at: string;
}

export interface Inquiry {
  id: string;
  guest_name: string | null;
  email: string | null;
  phone: string | null;
  accommodation_id: string | null;
  check_in: string | null;
  check_out: string | null;
  num_guests: number | null;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string | null;
  updated_at: string;
}

export const SOURCE_LABELS: Record<string, string> = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  direct: 'Direct',
  manual: 'Manual Block',
  external: 'External',
};

export const SOURCE_COLORS: Record<string, string> = {
  airbnb: 'bg-pink-100 text-pink-800 border-pink-200',
  booking: 'bg-blue-100 text-blue-800 border-blue-200',
  direct: 'bg-green-100 text-green-800 border-green-200',
  manual: 'bg-gray-100 text-gray-700 border-gray-200',
  external: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const SOURCE_BG: Record<string, string> = {
  airbnb: 'bg-pink-200',
  booking: 'bg-blue-200',
  direct: 'bg-green-200',
  manual: 'bg-gray-300',
  external: 'bg-purple-200',
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  deposit_paid: 'bg-blue-100 text-blue-800',
  fully_paid: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  deposit_paid: 'Deposit Paid',
  fully_paid: 'Fully Paid',
  cancelled: 'Cancelled',
};

export const INQUIRY_STATUS_COLORS: Record<string, string> = {
  new: 'bg-red-100 text-red-800',
  replied: 'bg-yellow-100 text-yellow-800',
  converted: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
};

export function generateBookingRef(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `MR-${date}-${rand}`;
}
