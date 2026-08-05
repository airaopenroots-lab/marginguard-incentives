import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Simple in-memory rate limiter for the prototype
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const BASE_PATH = ""; // no basePath

// Cache the landing page HTML at startup
let landingPageCache: string | null = null;
function getLandingPage(): string {
  if (!landingPageCache) {
    landingPageCache = readFileSync(join(process.cwd(), "public", "index.html"), "utf-8");
  }
  return landingPageCache;
}

export default async function middleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const now = Date.now();
  const { pathname } = req.nextUrl;

  // CRITICAL: pass through all auth API routes and static assets immediately — do NOT call auth()
  console.log(`[proxy] ${req.method} ${pathname} (basePath=${BASE_PATH})`);
  
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Rate limiting for API routes (non-auth) and Server Actions
  if (pathname.startsWith("/api") || req.headers.get("next-action")) {
    const windowMs = 60000;
    const limit = 60;
    const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    if (now - rateData.lastReset > windowMs) {
      rateData.count = 0;
      rateData.lastReset = now;
    }
    rateData.count++;
    rateLimitMap.set(ip, rateData);
    if (rateData.count > limit) {
      return new NextResponse("Rate limit exceeded. Try again in a minute.", { status: 429 });
    }
  }

  // Manual auth check
  const session = await auth();
  const isLoggedIn = !!session;

  // ── Landing page (public, unauthenticated only) ──
  // Serve static public/index.html when hitting the root without basePath
  if (!isLoggedIn && (pathname === "/" || pathname === "/index.html")) {
    return new NextResponse(getLandingPage(), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // ── Auth routes: keep them accessible ──
  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isAuthPage = isLoginPage || isSignupPage;

  // Allow unauthenticated access to auth pages
  if (!isLoggedIn && isAuthPage) {
    return NextResponse.next();
  }

  // ── Redirect unauthenticated users to login ──
  if (!isLoggedIn) {
    const loginUrl = new URL(`${BASE_PATH}/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect authenticated users away from auth pages ──
  if (isLoggedIn && isAuthPage) {
    const homeUrl = new URL(`${BASE_PATH}/deal-approval`, req.url);
    return NextResponse.redirect(homeUrl);
  }

  // ── Root path for authenticated users: redirect to deal-approval ──
  if (isLoggedIn && (pathname === "/" || pathname === "/index.html")) {
    const homeUrl = new URL(`${BASE_PATH}/deal-approval`, req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/auth (auth routes)
     * - /_next/static (static files)
     * - /_next/image (image optimization)
     * - /favicon.ico (favicon)
     * Include the root path explicitly
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).+)",
    "/",
  ],
};
