import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // Protected routes
  const protectedRoutes = ['/notes'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Public routes that should redirect to /notes if authenticated
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Check localStorage token (for mock mode)
  // Since we can't access localStorage in middleware, we'll check cookies or headers
  const authHeader = request.headers.get('authorization');
  const hasToken = token || authHeader;

  if (isProtectedRoute && !hasToken) {
    // Check if there's a token in localStorage by redirecting to a check page
    // For now, we'll allow access since we're using localStorage in mock mode
    return NextResponse.next();
  }

  if (isPublicRoute && hasToken) {
    return NextResponse.redirect(new URL('/notes', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/login', '/register'],
};
