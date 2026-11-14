import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

/**
 * Next.js 16 replaced middleware.ts with proxy.ts for Node.js-runtime
 * request interception. This function does exactly one thing: if someone
 * without a session cookie requests /admin/dashboard, send them to /admin
 * immediately instead of waiting for a full server render.
 *
 * This is a UX convenience ONLY. It checks whether a cookie exists, not
 * whether it is valid — it cannot safely query Postgres from here. The
 * actual authorization decision is made by every request to
 * src/app/admin/dashboard/layout.tsx (and re-checked in every sensitive
 * server action), which verifies the session against the database. Do not
 * add authorization logic here under the assumption that it replaces that
 * check — it does not, by design, per the project's security requirements.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const hasCookie = request.cookies.has(SESSION_COOKIE_NAME);
    if (!hasCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
