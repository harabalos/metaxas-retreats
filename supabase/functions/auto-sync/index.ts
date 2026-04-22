import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Lightweight wrapper called by Vercel cron every hour.
// It simply invokes the sync-calendars function with the SYNC_API_KEY.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': 'https://metaxasretreats.gr' } });
  }

  // Validate cron secret so only our Vercel cron can call this
  const cronSecret = req.headers.get('x-cron-secret');
  const expectedSecret = Deno.env.get('CRON_SECRET');
  if (!expectedSecret || cronSecret !== expectedSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const syncApiKey = Deno.env.get("SYNC_API_KEY") ?? "";

  const response = await fetch(`${supabaseUrl}/functions/v1/sync-calendars`, {
    method: 'POST',
    headers: {
      'X-API-Key': syncApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  const result = await response.json();
  console.log('Auto-sync result:', JSON.stringify(result));

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
});
