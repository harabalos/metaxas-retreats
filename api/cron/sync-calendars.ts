import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel serverless function triggered by cron every hour.
// Calls the Supabase sync-calendars edge function with the API key.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel automatically adds VERCEL_CRON_SECRET on cron requests
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const syncApiKey = process.env.SYNC_API_KEY;

  if (!supabaseUrl || !syncApiKey) {
    console.error('Missing SUPABASE_URL or SYNC_API_KEY env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/sync-calendars`, {
      method: 'POST',
      headers: {
        'X-API-Key': syncApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    console.log('Calendar sync triggered. Result:', JSON.stringify(data));
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Calendar sync failed:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
