// src/lib/supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wrcknousitrwfkukdgmr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2tub3VzaXRyd2ZrdWtkZ21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNzIyNDksImV4cCI6MjA1ODc0ODI0OX0.tb66Aw7mJ5AyTzNuqFMw5ohQDUSTPlyDRIIPnPh5eYE'

export const supabase = createClient(supabaseUrl, supabaseKey)
