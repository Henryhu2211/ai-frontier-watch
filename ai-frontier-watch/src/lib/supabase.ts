import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations (API routes, cron jobs)
export const createServerSupabaseClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY!
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}