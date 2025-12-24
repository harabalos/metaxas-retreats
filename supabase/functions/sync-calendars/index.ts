import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import ical from "https://esm.sh/node-ical@0.16.1";

// -----------------------------------------------------------------------------
// CONFIGURATION: Replace these with your REAL Airbnb/Booking URLs
// -----------------------------------------------------------------------------
const CALENDAR_URLS = {
  "wooden-house": [
    "https://www.airbnb.gr/calendar/ical/1420445588586676264.ics?t=6f2c5caeee5e41f4a9bd3c78e721852a",
    // Add your Booking.com link here if you have one
  ],
  "glamping-tent-1": [
    "https://www.airbnb.gr/calendar/ical/936140564087838043.ics?t=ecb01c9e6b9743f9a25d06eee7b1b05d"
  ],
  "glamping-tent-2": [
    "https://www.airbnb.gr/calendar/ical/1424551364666564643.ics?t=e97ddb448df644c78328c55ebfd5654b"
  ]
};

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const results = [];

  for (const [accommodationId, urls] of Object.entries(CALENDAR_URLS)) {
    for (const url of urls) {
      try {
        // FIX: Manually fetch the file text using standard 'fetch'
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to download calendar: ${response.statusText}`);
        }
        const icsText = await response.text();

        // FIX: Use parseICS instead of fromURL
        const events = await ical.async.parseICS(icsText);
        
        // Process the events
        for (const event of Object.values(events)) {
          if (event.type === 'VEVENT' && event.start && event.end) {
            
            // Clean up the Dates (handle generic JS dates vs iCal dates)
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);

            const { error } = await supabase
              .from('bookings')
              .upsert({
                accommodation_id: accommodationId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                source: 'external',
                external_id: event.uid || `${startDate.toISOString()}-${accommodationId}`
              }, { onConflict: 'accommodation_id, external_id' });

            if (error) {
                console.error(`Database error for ${accommodationId}:`, error);
            }
          }
        }
        results.push(`Synced: ${url}`);
      } catch (err) {
        console.error(`Failed to sync ${url}:`, err);
        results.push(`Failed: ${url} - ${err.message}`);
      }
    }
  }

  return new Response(JSON.stringify({ success: true, logs: results }), {
    headers: { "Content-Type": "application/json" },
  });
});