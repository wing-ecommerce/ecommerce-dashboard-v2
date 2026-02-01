import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fake auth check function
function isLoggedIn(req: NextRequest) {
  // Check cookies / token
  const token = req.cookies.get("authToken");
  return !!token;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // Allow public assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  const loggedIn = isLoggedIn(req);

  // Redirect logic
  if (!loggedIn && pathname !== "/auth/login") {
    // Not logged in → force login
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (loggedIn && pathname === "/auth/login") {
    // Already logged in → go to admin dashboard
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"], // only check relevant routes
};
