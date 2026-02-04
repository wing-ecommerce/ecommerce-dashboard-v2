// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't need authentication
  const publicRoutes = ['/auth/login', '/auth/logout'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Static files and API routes - allow without check
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // For public routes, just allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, we can't check localStorage here (server-side)
  // So we'll let the ProtectedRoute component handle the client-side check
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};