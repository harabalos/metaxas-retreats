import { createClient } from '@supabase/supabase-js';

// Hardcoded values - safe to expose (anon key is public)
const SUPABASE_URL = "https://qpncbejlnmdqppoutyfs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwbmNiZWpsbm1kcXBwb3V0eWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDQ4NzgsImV4cCI6MjA4MTcyMDg3OH0.i0FRHiY9CDhGtrHsgQS6lfrgPk_gqNudleqfRlp1obQ";

// Create untyped client to avoid type issues with auto-generated types
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
