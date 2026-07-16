import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using the anon key.
// For inserts from server actions, this is sufficient.
// If you add Row Level Security policies, switch to the service role key.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export { supabase };
