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

// Calendar URLs loaded from environment variables (secrets)
// Support multiple URLs per accommodation for cross-platform sync
const CALENDAR_URLS: Record<string, string[]> = {
  "wooden-house": [
    Deno.env.get("AIRBNB_WOODEN_HOUSE_URL") || "",
    Deno.env.get("BOOKING_WOODEN_HOUSE_URL") || ""
  ].filter(url => url !== ""),
  "glamping-tent-1": [Deno.env.get("AIRBNB_TENT_1_URL") || ""].filter(url => url !== ""),
  "glamping-tent-2": [Deno.env.get("AIRBNB_TENT_2_URL") || ""].filter(url => url !== "")
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // API Key Authentication - Required for sync operations
  const apiKey = req.headers.get('X-API-Key') || req.headers.get('x-api-key');
  const expectedApiKey = Deno.env.get('SYNC_API_KEY');
  
  if (!expectedApiKey) {
    console.error('SYNC_API_KEY not configured in Edge Function secrets');
    return new Response(
      JSON.stringify({ success: false, error: 'Server configuration error: API key not set' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  if (!apiKey || apiKey !== expectedApiKey) {
    console.warn('Unauthorized sync attempt - invalid or missing API key');
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized - Valid API key required' }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  console.log('API key validated successfully, proceeding with calendar sync');

  // Check which accommodations have at least one URL configured
  const accommodationsWithUrls: string[] = [];
  const accommodationsWithoutUrls: string[] = [];
  
  for (const [accommodation, urls] of Object.entries(CALENDAR_URLS)) {
    if (urls.length > 0) {
      accommodationsWithUrls.push(accommodation);
      console.log(`${accommodation}: ${urls.length} iCal source(s) configured`);
    } else {
      accommodationsWithoutUrls.push(accommodation);
    }
  }
  
  if (accommodationsWithoutUrls.length > 0) {
    console.warn(`No calendar URLs configured for: ${accommodationsWithoutUrls.join(', ')}`);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const results: string[] = [];

  for (const [accommodationId, urls] of Object.entries(CALENDAR_URLS)) {
    // Skip if no URLs configured for this accommodation
    if (urls.length === 0) {
      results.push(`${accommodationId}: Skipped - no iCal URLs configured`);
      continue;
    }

    try {
      console.log(`Processing ${accommodationId} with ${urls.length} iCal source(s)`);
      
      // STEP 1: Delete ALL existing external bookings for this accommodation
      // This ensures unblocked dates in external platforms get removed from our database
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('accommodation_id', accommodationId)
        .eq('source', 'external');

      if (deleteError) {
        console.error(`Failed to delete old bookings for ${accommodationId}:`, deleteError);
      } else {
        console.log(`Deleted existing external bookings for ${accommodationId}`);
      }
      
      // STEP 2: Collect events from ALL iCal sources for this accommodation
      // Use a Set to deduplicate by date range (same dates from different platforms = one booking)
      const seenDates = new Set<string>();
      const eventsToInsert: Array<{
        accommodation_id: string;
        start_date: string;
        end_date: string;
        source: string;
        external_id: string;
      }> = [];
      
      for (let urlIndex = 0; urlIndex < urls.length; urlIndex++) {
        const url = urls[urlIndex];
        try {
          console.log(`Fetching iCal source ${urlIndex + 1}/${urls.length} for ${accommodationId}`);
          
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to download calendar: ${response.statusText}`);
          }
          const icsText = await response.text();

          // Parse the ICS content
          const events = await ical.async.parseICS(icsText);
          
          // Collect events from this source
          for (const key of Object.keys(events)) {
            const event = events[key] as ICalEvent;
            
            if (event.type === 'VEVENT' && event.start && event.end) {
              const startDate = new Date(event.start);
              const endDate = new Date(event.end);
              const startDateStr = startDate.toISOString().split('T')[0];
              const endDateStr = endDate.toISOString().split('T')[0];
              
              // Create unique key for deduplication (same date range = same booking)
              const dateKey = `${startDateStr}_${endDateStr}`;
              
              if (seenDates.has(dateKey)) {
                console.log(`Skipping duplicate: ${accommodationId} ${dateKey}`);
                continue;
              }
              seenDates.add(dateKey);
              
              console.log(`Event for ${accommodationId}: ${event.uid}, Start: ${startDateStr}, End: ${endDateStr}`);
              
              eventsToInsert.push({
                accommodation_id: accommodationId,
                start_date: startDateStr,
                end_date: endDateStr,
                source: 'external',
                external_id: event.uid || `${startDateStr}-${accommodationId}`
              });
            }
          }
        } catch (urlError) {
          const errorMessage = urlError instanceof Error ? urlError.message : String(urlError);
          console.error(`Failed to fetch iCal source ${urlIndex + 1} for ${accommodationId}:`, errorMessage);
          // Continue with other URLs even if one fails
        }
      }
      
      // STEP 3: Insert all deduplicated events
      let syncedCount = 0;
      for (const eventData of eventsToInsert) {
        const { error } = await supabase
          .from('bookings')
          .insert(eventData);

        if (error) {
          console.error(`Database error for ${accommodationId}:`, error);
        } else {
          syncedCount++;
        }
      }
      
      console.log(`Synced ${syncedCount} unique events for ${accommodationId} from ${urls.length} source(s)`);
      results.push(`${accommodationId}: Synced ${syncedCount} events from ${urls.length} iCal source(s)`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Failed to sync calendar for ${accommodationId}:`, errorMessage);
      results.push(`Failed: ${accommodationId} - ${errorMessage}`);
    }
  }

  return new Response(JSON.stringify({ success: true, logs: results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
