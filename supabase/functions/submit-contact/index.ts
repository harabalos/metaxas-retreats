import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Server-side validation schema matching client-side
const contactFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .trim()
    .toLowerCase(),
  
  phone: z.string()
    .max(30, 'Phone number too long')
    .optional()
    .or(z.literal('')),
  
  message: z.string()
    .max(2000, 'Message must be less than 2000 characters')
    .optional()
    .or(z.literal('')),

  specialRequests: z.string()
    .max(2000, 'Message must be less than 2000 characters')
    .optional()
    .or(z.literal('')),
  
  // Additional booking-specific fields
  accommodation: z.string().max(200).optional(),
  checkIn: z.string().max(20).optional(),
  checkOut: z.string().max(20).optional(),
  guests: z.number().min(1).max(50).optional(),
  _subject: z.string().max(200).optional(),
});

const FORMSPREE_URL = 'https://formspree.io/f/mgoelyzg';

// Simple in-memory rate limiting (per function instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }
  
  record.count++;
  return false;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    
    if (isRateLimited(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse and validate request body
    const body = await req.json();
    
    // Server-side validation
    const validationResult = contactFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      console.warn(`Validation failed: ${firstError.message} - IP: ${clientIP}`);
      return new Response(JSON.stringify({ error: firstError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const validatedData = validationResult.data;
    
    // Build the payload for Formspree
    const formspreePayload: Record<string, string | number> = {
      name: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone || 'Not provided',
    };
    
    // Add message or special requests
    if (validatedData.message) {
      formspreePayload.message = validatedData.message;
    } else if (validatedData.specialRequests) {
      formspreePayload.message = validatedData.specialRequests;
    } else {
      formspreePayload.message = 'None';
    }
    
    // Add booking-specific fields if present
    if (validatedData.accommodation) {
      formspreePayload.accommodation = validatedData.accommodation;
    }
    if (validatedData.checkIn) {
      formspreePayload.checkIn = validatedData.checkIn;
    }
    if (validatedData.checkOut) {
      formspreePayload.checkOut = validatedData.checkOut;
    }
    if (validatedData.guests) {
      formspreePayload.guests = validatedData.guests;
    }
    if (validatedData._subject) {
      formspreePayload._subject = validatedData._subject;
    }

    console.log(`Processing contact form submission from ${clientIP}`);

    // Forward validated data to Formspree
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formspreePayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Formspree error: ${response.status} - ${errorText}`);
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Contact form submitted successfully from ${clientIP}`);
    
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
