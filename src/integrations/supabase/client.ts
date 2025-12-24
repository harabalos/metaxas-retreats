import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Safely get env vars
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log a warning if keys are missing (helps debugging)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase keys are missing! Check your .env file.");
}

// Create client with fallback to prevent crash
export const supabase = createClient<Database>(
  SUPABASE_URL || "https://placeholder.supabase.co", 
  SUPABASE_ANON_KEY || "placeholder"
);