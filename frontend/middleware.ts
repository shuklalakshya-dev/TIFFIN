import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Export the middleware function (this is required)
export function middleware(request: NextRequest) {
  // Get the pathname from the request URL
  const path = request.nextUrl.pathname;
  
  // Define admin paths that require authentication
  const isAdminPath = path.startsWith('/admin') && 
                     path !== '/admin/pin';
  
  // If the path is admin-related but not the pin authentication page
  if (isAdminPath) {
    // Check for admin authentication in cookies
    const adminAuthenticated = request.cookies.get('adminAuthenticated')?.value === 'true';
    
    if (!adminAuthenticated) {
      // Redirect to PIN authentication page
      return NextResponse.redirect(new URL('/admin/pin', request.url));
    }
  }
  
  return NextResponse.next();
}

// Optionally specify which paths this middleware applies to
export const config = {
  matcher: ['/admin/:path*'],
};
