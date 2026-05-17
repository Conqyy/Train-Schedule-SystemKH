/* ===================================================================
   Supabase Client
   Initializes a single Supabase client instance for the entire app.
   Reads connection details from environment variables.
   =================================================================== */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase environment variables are missing.\n" +
    "   The app will fall back to local mock data.\n" +
    "   To enable Supabase, create a .env.local file with:\n" +
    "     NEXT_PUBLIC_SUPABASE_URL=your-url\n" +
    "     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key"
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

/**
 * Returns true if Supabase is properly configured with real credentials.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl) && Boolean(supabaseAnonKey);
}
