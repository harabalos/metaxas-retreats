import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Valid accommodation IDs - validates input to prevent enumeration attacks
const VALID_ACCOMMODATION_IDS = ["wooden-house", "glamping-tent-1", "glamping-tent-2"];

serve(async (req) => {
  const url = new URL(req.url);
  const accommodationId = url.searchParams.get("id");

  // Input validation
  if (!accommodationId) {
    console.warn('Export request missing accommodation ID');
    return new Response("Missing accommodation id", { status: 400 });
  }

  // Validate accommodation ID against whitelist to prevent enumeration
  if (!VALID_ACCOMMODATION_IDS.includes(accommodationId)) {
    console.warn(`Invalid accommodation ID requested: ${accommodationId}`);
    return new Response("Invalid accommodation id", { status: 400 });
  }

  // API key authentication - REQUIRED for access
  const apiKey = req.headers.get('X-API-Key') || req.headers.get('x-api-key');
  const expectedApiKey = Deno.env.get('SYNC_API_KEY');
  
  // Require API key to be configured
  if (!expectedApiKey) {
    console.error('SYNC_API_KEY not configured - calendar export disabled');
    return new Response('Server configuration error', { status: 500 });
  }
  
  // Validate API key
  if (!apiKey || apiKey !== expectedApiKey) {
    console.warn(`Unauthorized calendar export attempt for ${accommodationId} from ${req.headers.get('x-forwarded-for') || 'unknown'}`);
    return new Response('Unauthorized', { status: 401 });
  }
  
  console.log(`Authenticated calendar export for ${accommodationId}`);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // Get bookings from DB
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, start_date, end_date")
    .eq("accommodation_id", accommodationId);

  if (error) {
    console.error(`Database error fetching bookings for ${accommodationId}:`, error);
    return new Response("Error fetching bookings", { status: 500 });
  }

  console.log(`Exporting ${bookings?.length || 0} bookings for ${accommodationId}`);

  // Format as iCalendar (.ics)
  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Metaxas Retreats//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  bookings?.forEach((booking) => {
    // Format dates as YYYYMMDD
    const start = new Date(booking.start_date).toISOString().replace(/[-:]/g, "").split("T")[0];
    const end = new Date(booking.end_date).toISOString().replace(/[-:]/g, "").split("T")[0];

    icsContent.push(
      "BEGIN:VEVENT",
      `UID:${booking.id}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      "SUMMARY:Booked",
      "END:VEVENT"
    );
  });

  icsContent.push("END:VCALENDAR");

  return new Response(icsContent.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${accommodationId}.ics"`,
    },
  });
});
