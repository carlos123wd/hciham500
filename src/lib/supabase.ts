import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocosgliryitsfthqbzbq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jb3NnbGlyeWl0c2Z0aHFiemJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzQ5OTgsImV4cCI6MjA3ODQ1MDk5OH0.bALw0sCLawMTg7DLvcl_gDsMFN0JAxaIVGg12SJhzH4'

export const supabase = createClient(supabaseUrl, supabaseKey)
