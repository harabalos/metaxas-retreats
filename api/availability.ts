import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Live availability for the public booking calendar.
 *
 * The browser can't read the Airbnb iCal exports itself (CORS), but a
 * serverless function can. The CDN cache headers below mean Airbnb sees at most
 * one request per revalidation window no matter how much traffic the site gets,
 * so no database or cron job is needed to hold a copy of the calendar.
 *
 * Airbnb is the source of truth: direct bookings are blocked there by hand, so
 * its feed already contains every unavailable night.
 */

// The two glamping tents are identical units behind one public listing, so
// "glamping-tent" reads both feeds and is unavailable only when BOTH are booked.
const FEEDS: Record<string, (string | undefined)[]> = {
  'wooden-house': [process.env.ICAL_WOODEN_HOUSE],
  'glamping-tent-1': [process.env.ICAL_TENT_1],
  'glamping-tent-2': [process.env.ICAL_TENT_2],
  'glamping-tent': [process.env.ICAL_TENT_1, process.env.ICAL_TENT_2],
};

const FETCH_TIMEOUT_MS = 8000;

/** Pull the date ranges out of an iCal feed's VEVENTs. */
export function parseIcalRanges(ics: string): { start: string; end: string }[] {
  // RFC 5545 folds long lines onto continuation lines starting with a space/tab.
  const unfolded = ics.replace(/\r?\n[ \t]/g, '');
  const ranges: { start: string; end: string }[] = [];

  for (const chunk of unfolded.split('BEGIN:VEVENT').slice(1)) {
    const block = chunk.split('END:VEVENT')[0];
    const start = readDate(block, 'DTSTART');
    const end = readDate(block, 'DTEND');
    if (start && end) ranges.push({ start, end });
  }
  return ranges;
}

/** `DTSTART;VALUE=DATE:20260728` or `DTSTART:20260728T140000Z` → `2026-07-28`. */
function readDate(block: string, prop: 'DTSTART' | 'DTEND'): string | null {
  const match = block.match(new RegExp(`^${prop}[^:\\r\\n]*:(\\d{8})`, 'm'));
  if (!match) return null;
  const [, d] = match;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

/** Every night from start (inclusive) to end (exclusive) — end is checkout day. */
export function nightsIn(start: string, end: string): string[] {
  const nights: string[] = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const checkout = new Date(`${end}T00:00:00Z`);
  // UTC throughout so the day never drifts with the server's timezone.
  while (cursor < checkout) {
    nights.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return nights;
}

/** Nights where every unit is taken — for a single unit that's just "booked". */
export function blockedNights(feeds: string[]): string[] {
  const bookedUnits = new Map<string, number>();

  for (const ics of feeds) {
    // Dedupe within a feed first: two overlapping events on one unit must not
    // count as two units being booked.
    const nights = new Set<string>();
    for (const range of parseIcalRanges(ics)) {
      for (const night of nightsIn(range.start, range.end)) nights.add(night);
    }
    for (const night of nights) {
      bookedUnits.set(night, (bookedUnits.get(night) ?? 0) + 1);
    }
  }

  return [...bookedUnits.entries()]
    .filter(([, units]) => units >= feeds.length)
    .map(([night]) => night)
    .sort();
}

async function fetchIcal(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'MetaxasRetreats/1.0 (+https://www.metaxasretreats.gr)' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} from calendar feed`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = String(req.query.id ?? '');
  const configured = FEEDS[id];

  if (!configured) {
    return res.status(400).json({ error: 'unknown_accommodation' });
  }

  const feeds = configured.filter((url): url is string => Boolean(url));
  if (feeds.length !== configured.length) {
    console.error(`Missing iCal env var(s) for "${id}"`);
    return res.status(500).json({ error: 'feed_not_configured' });
  }

  try {
    const documents = await Promise.all(feeds.map(fetchIcal));
    const blockedDates = blockedNights(documents);

    // Serve from the CDN for 30 minutes, and keep serving the last good copy for
    // a day while revalidating so a slow or failing Airbnb never reaches guests.
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
    return res.status(200).json({ blockedDates, units: feeds.length });
  } catch (error) {
    // Don't guess. Claiming "free" risks a double booking and claiming "booked"
    // loses a real one, so tell the client the calendar is unknown right now.
    console.error(`Availability lookup failed for "${id}":`, error);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ error: 'upstream_unavailable' });
  }
}
