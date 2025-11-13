// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Supabase credentials
const SUPABASE_URL = "https://ocosgliryitsfthqbzbq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jb3NnbGlyeWl0c2Z0aHFiemJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzQ5OTgsImV4cCI6MjA3ODQ1MDk5OH0.bALw0sCLawMTg7DLvcl_gDsMFN0JAxaIVGg12SJhzH4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
