import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Returns null if env vars are not configured (Supabase is optional)
export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null

export type Reading = {
  id?: string
  created_at?: string
  birth_date: string
  name: string
  life_path: number
  expression: number
  soul_urge: number
  personality: number
}

export async function saveReading(reading: Omit<Reading, 'id' | 'created_at'>) {
  if (!supabase) return null
  const { data, error } = await supabase.from('readings').insert(reading).select().single()
  if (error) console.error('Supabase save error:', error)
  return data
}

export async function getReadings(): Promise<Reading[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) console.error('Supabase fetch error:', error)
  return data ?? []
}
