// Centralized Supabase client to avoid multiple instances
import { createClient } from '@supabase/supabase-js';

// Resolve Supabase credentials from environment
const envUrl = ((import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL) as string | undefined;
const envAnon = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string | undefined;

if (!envUrl || !envAnon) {
  throw new Error('Missing Supabase env: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

// Create single Supabase client instance
export const supabase = createClient(envUrl, envAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Also export the raw values for use in API request helpers
export const SUPABASE_URL = envUrl;
export const SUPABASE_ANON_KEY = envAnon;
