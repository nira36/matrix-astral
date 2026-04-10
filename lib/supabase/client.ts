import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// Fallback values allow Next.js static page generation to succeed at build time
// (when env vars aren't available). The client won't work without real values,
// but these pages are protected by middleware and will never render without auth.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
}
