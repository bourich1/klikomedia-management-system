import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Client = {
  id: string
  full_name: string
  monthly_amount: number
  paid_amount: number
  remaining_amount: number
  service_start_date: string
  next_payment_due: string
  created_at: string
  updated_at: string
}