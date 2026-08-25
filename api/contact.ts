import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

/**
 * Contact / booking-request form handler.
 *
 * Replaces the Supabase `submit-contact` edge function, which validated the
 * payload and forwarded it to Formspree. Formspree still delivers the email;
 * only the (best-effort, non-fatal) inquiries archive is gone with the database.
 */

const FORMSPREE_URL = 'https://formspree.io/f/mgoelyzg';

const contactFormSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).trim().toLowerCase(),
  phone: z.string().max(30).optional().or(z.literal('')),
  message: z.string().max(2000).optional().or(z.literal('')),
  specialRequests: z.string().max(2000).optional().or(z.literal('')),
  accommodation: z.string().max(200).optional(),
  checkIn: z.string().max(20).optional(),
  checkOut: z.string().max(20).optional(),
  guests: z.number().min(1).max(50).optional(),
  _subject: z.string().max(200).optional(),
});

// Best-effort speed bump only: serverless instances don't share this map, so a
// determined sender gets more than the cap. Formspree does the real limiting.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const recentRequests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = recentRequests.get(ip);
  if (!record || now > record.resetAt) {
    recentRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (record.count >= RATE_LIMIT_MAX) return true;
  record.count++;
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp =
    (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0]?.trim() ||
    'unknown';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  const parsed = contactFormSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }
  const data = parsed.data;

  const payload: Record<string, string | number> = {
    name: data.fullName,
    email: data.email,
    phone: data.phone || 'Not provided',
    message: data.message || data.specialRequests || 'None',
  };
  if (data.accommodation) payload.accommodation = data.accommodation;
  if (data.checkIn) payload.checkIn = data.checkIn;
  if (data.checkOut) payload.checkOut = data.checkOut;
  if (data.guests) payload.guests = data.guests;
  if (data._subject) payload._subject = data._subject;

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Formspree rejected the message: ${response.status} ${await response.text()}`);
      return res.status(502).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
