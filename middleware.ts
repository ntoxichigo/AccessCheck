import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/scan'
]);

export default clerkMiddleware((auth, req) => {
  // For API routes that use auth(), we need to let Clerk handle the request
  // even if we don't enforce protection here
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // For protected routes, you can add auth enforcement if needed
  if (isProtectedRoute(req)) {
    // Optional: add auth.protect() here if you want to enforce auth in middleware
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
