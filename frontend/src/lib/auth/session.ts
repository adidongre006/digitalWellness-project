import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { db, adminSessions, adminUsers } from "@/db";
import { and, eq, gt } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "dwh_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

/**
 * The cookie holds a random opaque token. Only a SHA-256 hash of that token
 * is ever stored in Postgres (adminSessions.tokenHash), the same pattern
 * used for the password hash: a stolen database row cannot be replayed as a
 * valid cookie, because the attacker would need the original random token,
 * not just its hash.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(adminId: string, meta: { userAgent?: string; ipAddress?: string }) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(adminSessions).values({
    adminId,
    tokenHash: hashToken(token),
    userAgent: meta.userAgent ?? null,
    ipAddress: meta.ipAddress ?? null,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { token, expiresAt };
}

/**
 * The single server-side source of truth for "is this request an
 * authenticated admin." Every admin route and every sensitive server
 * action calls this directly — proxy.ts only provides a redirect for UX
 * and must never be trusted as the real authorization boundary.
 */
export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const rows = await db
    .select({
      sessionId: adminSessions.id,
      adminId: adminUsers.id,
      email: adminUsers.email,
      expiresAt: adminSessions.expiresAt,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.adminId, adminUsers.id))
    .where(and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, new Date())))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return { id: row.adminId, email: row.email, sessionId: row.sessionId };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashToken(token)));
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Invalidate every session for an admin (used on password change). */
export async function destroyAllSessionsForAdmin(adminId: string) {
  await db.delete(adminSessions).where(eq(adminSessions.adminId, adminId));
}
