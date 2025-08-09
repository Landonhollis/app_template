import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// Change URL and anon key for each project made with template. Do not use these keys for a new project, a new SupaBase project must be made.
const supabaseUrl = 'https://fmltpympngdnuzsnktsf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtbHRweW1wbmdkbnV6c25rdHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzA4NDgsImV4cCI6MjA3MDAwNjg0OH0.1iqMb_89w23SYYgRwGo4VK-Cp_i611XrEFcILW1ZW5Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})