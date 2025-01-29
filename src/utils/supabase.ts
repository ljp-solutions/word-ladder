import { createClient } from '@supabase/supabase-js';

// Load from environment variables (keep keys secure!)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
