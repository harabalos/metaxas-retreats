import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import ical from "https://esm.sh/node-ical@0.16.1";

// Type for iCal events
interface ICalEvent {
  type: string;
  start?: Date | string;
  end?: Date | string;
  uid?: string;
}

// CONFIGURATION: Replace these with your REAL Airbnb/Booking URLs
const CALENDAR_URLS: Record<string, string[]> = {
  "wooden-house": [
    "https://www.airbnb.gr/calendar/ical/1420445588586676264.ics?t=6f2c5caeee5e41f4a9bd3c78e721852a",
  ],
  "glamping-tent-1": [
    "https://www.airbnb.gr/calendar/ical/936140564087838043.ics?t=ecb01c9e6b9743f9a25d06eee7b1b05d"
  ],
  "glamping-tent-2": [
    "https://www.airbnb.gr/calendar/ical/1424551364666564643.ics?t=e97ddb448df644c78328c55ebfd5654b"
  ]
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const results: string[] = [];

  for (const [accommodationId, urls] of Object.entries(CALENDAR_URLS)) {
    for (const url of urls) {
      try {
        console.log(`Fetching calendar for ${accommodationId}: ${url}`);
        
        // STEP 1: Delete ALL existing external bookings for this accommodation
        // This ensures unblocked dates in Airbnb get removed from our database
        const { error: deleteError, count: deletedCount } = await supabase
          .from('bookings')
          .delete()
          .eq('accommodation_id', accommodationId)
          .eq('source', 'external')
          .select('*', { count: 'exact', head: true });

        if (deleteError) {
          console.error(`Failed to delete old bookings for ${accommodationId}:`, deleteError);
        } else {
          console.log(`Deleted existing external bookings for ${accommodationId}`);
        }
        
        // STEP 2: Fetch fresh data from Airbnb
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to download calendar: ${response.statusText}`);
        }
        const icsText = await response.text();

        // Parse the ICS content
        const events = await ical.async.parseICS(icsText);
        
        let syncedCount = 0;
        
        // STEP 3: Insert fresh bookings from Airbnb
        for (const key of Object.keys(events)) {
          const event = events[key] as ICalEvent;
          
          if (event.type === 'VEVENT' && event.start && event.end) {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            
            // Log each event for debugging
            console.log(`Event for ${accommodationId}: ${event.uid}, Start: ${startDate.toISOString().split('T')[0]}, End: ${endDate.toISOString().split('T')[0]}`);

            const { error } = await supabase
              .from('bookings')
              .insert({
                accommodation_id: accommodationId,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                source: 'external',
                external_id: event.uid || `${startDate.toISOString()}-${accommodationId}`
              });

            if (error) {
              console.error(`Database error for ${accommodationId}:`, error);
            } else {
              syncedCount++;
            }
          }
        }
        
        console.log(`Synced ${syncedCount} events for ${accommodationId}`);
        results.push(`${accommodationId}: Cleared old data, synced ${syncedCount} fresh events`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Failed to sync ${url}:`, errorMessage);
        results.push(`Failed: ${url} - ${errorMessage}`);
      }
    }
  }

  return new Response(JSON.stringify({ success: true, logs: results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
