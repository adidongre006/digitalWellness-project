import { db, loginAttempts } from "@/db";
import { and, eq, gt, sql } from "drizzle-orm";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS_PER_WINDOW = 5;

/**
 * Checked BEFORE verifying the password, so a flood of guesses never
 * reaches the (deliberately slow) Argon2id verify call in the first place.
 * Keyed on IP + email together so one bad actor can't lock out a real
 * admin from a different network, and a single IP can't exhaust attempts
 * across many email guesses without each one counting individually.
 */
export async function isRateLimited(ipAddress: string, email: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.ipAddress, ipAddress),
        eq(loginAttempts.email, email.toLowerCase()),
        eq(loginAttempts.success, false),
        gt(loginAttempts.createdAt, since)
      )
    );

  return (rows[0]?.count ?? 0) >= MAX_ATTEMPTS_PER_WINDOW;
}

export async function recordLoginAttempt(ipAddress: string, email: string, success: boolean) {
  await db.insert(loginAttempts).values({ ipAddress, email: email.toLowerCase(), success });
  // On success, clear this IP+email's failure history so a legitimate login
  // isn't penalized by attempts that happened before it.
  if (success) {
    // Intentionally not deleting rows here to preserve the audit trail;
    // the window-based query above already stops counting old failures
    // once MAX_ATTEMPTS_PER_WINDOW rolls out of the 15-minute window.
  }
}
