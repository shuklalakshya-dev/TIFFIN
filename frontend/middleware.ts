import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // only protect /admin routes except the PIN entry page
  if (pathname.startsWith('/admin') && pathname !== '/admin/pin') {
    const pin = req.cookies.get('adminPin')?.value
    if (pin !== 'admin123') {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/pin'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
