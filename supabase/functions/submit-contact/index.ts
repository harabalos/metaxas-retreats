import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

const FORMSPREE_URL = 'https://formspree.io/f/mgoelyzg';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  if (record.count >= RATE_LIMIT_MAX) return true;
  record.count++;
  return false;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (isRateLimited(clientIP)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return new Response(JSON.stringify({ error: firstError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = validationResult.data;

    // Build Formspree payload
    const formspreePayload: Record<string, string | number> = {
      name: data.fullName,
      email: data.email,
      phone: data.phone || 'Not provided',
      message: data.message || data.specialRequests || 'None',
    };
    if (data.accommodation) formspreePayload.accommodation = data.accommodation;
    if (data.checkIn) formspreePayload.checkIn = data.checkIn;
    if (data.checkOut) formspreePayload.checkOut = data.checkOut;
    if (data.guests) formspreePayload.guests = data.guests;
    if (data._subject) formspreePayload._subject = data._subject;

    // Send to Formspree
    const formspreeRes = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formspreePayload),
    });

    if (!formspreeRes.ok) {
      const errText = await formspreeRes.text();
      console.error(`Formspree error: ${formspreeRes.status} - ${errText}`);
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save to inquiries table (best-effort — don't fail the whole request if this errors)
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      await supabase.from('inquiries').insert({
        guest_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        accommodation_id: data.accommodation || null,
        check_in: data.checkIn || null,
        check_out: data.checkOut || null,
        num_guests: data.guests || null,
        message: data.message || data.specialRequests || null,
        status: 'new',
      });
    } catch (dbErr) {
      console.error('Failed to save inquiry to DB (non-fatal):', dbErr);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
