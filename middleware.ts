import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request)
  } catch (e) {
    console.error('[middleware] error:', e)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Run on /app/* routes only (protected)
    '/app/:path*',
  ],
}
