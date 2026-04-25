import { NextResponse, type NextRequest } from "next/server";

// Routes that require an authenticated session.
const PROTECTED_PREFIXES = ["/dashboard", "/agent", "/admin"];

// NextAuth v5 cookie names. Both forms exist depending on env (https vs http).
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!needsAuth) return NextResponse.next();

  const hasSession = SESSION_COOKIES.some((name) => req.cookies.get(name));
  if (hasSession) return NextResponse.next();

  // No session cookie → redirect to login with callback.
  // (Role-gated checks happen in Server Component layouts since middleware
  // can't query the DB on the Edge runtime with the SQL Server adapter.)
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    // Run on everything except static assets, API auth routes, and Next internals.
    "/((?!_next/|api/auth/|api/health/|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)",
  ],
};
