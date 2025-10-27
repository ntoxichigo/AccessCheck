import { NextResponse } from "next/server";

// Temporarily disable auth enforcement in middleware to avoid runtime
// issues with auth().protect across edge/Node contexts. API routes and
// pages perform their own checks and fall back safely.
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
