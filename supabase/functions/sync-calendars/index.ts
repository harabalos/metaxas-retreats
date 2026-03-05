import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import ical from "https://esm.sh/node-ical@0.16.1";

interface ICalEvent {
  type: string;
  start?: Date | string;
  end?: Date | string;
  uid?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const expectedApiKey = Deno.env.get('SYNC_API_KEY');

  // Accept either X-API-Key (for cron) or valid Supabase JWT (for admin UI)
  const apiKey = req.headers.get('X-API-Key') || req.headers.get('x-api-key');
  const authHeader = req.headers.get('Authorization');

  let isAuthorized = false;

  if (expectedApiKey && apiKey === expectedApiKey) {
    isAuthorized = true;
  } else if (authHeader?.startsWith('Bearer ')) {
    // Validate Supabase JWT and verify caller is the admin
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const adminEmail = Deno.env.get("ADMIN_EMAIL") ?? "";
    const anonClient = createClient(supabaseUrl, anonKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await anonClient.auth.getUser(token);
    if (!error && user && adminEmail && user.email === adminEmail) isAuthorized = true;
  }

  if (!isAuthorized) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Parse optional accommodation_id filter from body
  let filterAccId: string | null = null;
  try {
    const body = await req.json();
    if (body?.accommodation_id) filterAccId = body.accommodation_id;
  } catch { /* no body or not JSON */ }

  // Load iCal sources from database (dynamic — no hardcoded URLs)
  let query = supabase.from('calendar_sources').select('*').eq('enabled', true);
  if (filterAccId) query = query.eq('accommodation_id', filterAccId);
  const { data: sources, error: sourcesError } = await query;

  if (sourcesError) {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to load calendar sources: ' + sourcesError.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!sources || sources.length === 0) {
    return new Response(
      JSON.stringify({ success: true, logs: ['No enabled calendar sources found.'] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Group sources by accommodation_id
  const byAcc: Record<string, typeof sources> = {};
  for (const source of sources) {
    if (!byAcc[source.accommodation_id]) byAcc[source.accommodation_id] = [];
    byAcc[source.accommodation_id].push(source);
  }

  const results: string[] = [];

  for (const [accommodationId, accSources] of Object.entries(byAcc)) {
    // Delete all existing external bookings for this accommodation
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('accommodation_id', accommodationId)
      .eq('source', 'external');

    if (deleteError) {
      console.error(`Failed to delete old bookings for ${accommodationId}:`, deleteError);
    }

    const seenDates = new Set<string>();
    const eventsToInsert: Array<{
      accommodation_id: string;
      start_date: string;
      end_date: string;
      source: string;
      external_id: string;
    }> = [];

    for (const src of accSources) {
      let syncedCount = 0;
      let syncError: string | null = null;

      try {
        const response = await fetch(src.ical_url);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const icsText = await response.text();
        const events = await ical.async.parseICS(icsText);

        for (const key of Object.keys(events)) {
          const event = events[key] as ICalEvent;
          if (event.type === 'VEVENT' && event.start && event.end) {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];
            const dateKey = `${startDateStr}_${endDateStr}`;

            if (seenDates.has(dateKey)) continue;
            seenDates.add(dateKey);

            eventsToInsert.push({
              accommodation_id: accommodationId,
              start_date: startDateStr,
              end_date: endDateStr,
              source: 'external',
              external_id: event.uid || `${startDateStr}-${accommodationId}`,
            });
            syncedCount++;
          }
        }

        // Update source status
        await supabase.from('calendar_sources').update({
          last_synced_at: new Date().toISOString(),
          last_sync_status: 'success',
          last_sync_count: syncedCount,
          last_sync_error: null,
        }).eq('id', src.id);

      } catch (err: unknown) {
        syncError = err instanceof Error ? err.message : String(err);
        console.error(`Failed to sync ${src.platform} for ${accommodationId}:`, syncError);

        // Update source with error
        await supabase.from('calendar_sources').update({
          last_synced_at: new Date().toISOString(),
          last_sync_status: 'error',
          last_sync_error: syncError,
        }).eq('id', src.id);
      }

      // Write to sync_logs
      await supabase.from('sync_logs').insert({
        accommodation_id: accommodationId,
        platform: src.platform,
        events_synced: syncedCount,
        status: syncError ? 'error' : 'success',
        error_message: syncError,
      });
    }

    // Insert all deduplicated events
    for (const eventData of eventsToInsert) {
      await supabase.from('bookings').insert(eventData);
    }

    results.push(`${accommodationId}: synced ${eventsToInsert.length} unique events from ${accSources.length} source(s)`);
  }

  return new Response(JSON.stringify({ success: true, logs: results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
