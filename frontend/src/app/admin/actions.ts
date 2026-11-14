"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, adminUsers } from "@/db";
import { eq, sql } from "drizzle-orm";
import { hashPassword, verifyPassword, isPasswordStrongEnough } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { isRateLimited, recordLoginAttempt } from "@/lib/auth/rate-limit";
import { logAdminAction } from "@/lib/auth/audit";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function clientIp(): Promise<string> {
  const h = await headers();
  // Vercel/most proxies set x-forwarded-for; fall back to a constant so
  // rate-limiting still functions (conservatively) in local dev.
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/**
 * Initial admin setup is allowed ONLY when:
 *   (a) zero admin accounts currently exist, AND
 *   (b) the caller supplies ADMIN_INITIAL_SETUP_SECRET, a private,
 *       deployment-time-only environment variable never exposed to the
 *       client and never committed to source control.
 * Once the first admin is created, this path permanently closes — see the
 * count check below, which runs on every call, not just at deploy time.
 */
const setupSchema = z.object({
  setupSecret: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(12),
});

export async function setupInitialAdmin(formData: FormData): Promise<ActionResult> {
  const parsed = setupSchema.safeParse({
    setupSecret: formData.get("setupSecret"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { ok: false, error: "Please fill in every field correctly." };

  const expectedSecret = process.env.ADMIN_INITIAL_SETUP_SECRET;
  if (!expectedSecret) {
    return { ok: false, error: "Initial setup is not configured on this deployment." };
  }
  if (parsed.data.setupSecret !== expectedSecret) {
    return { ok: false, error: "Incorrect setup secret." };
  }

  const existingAdminCount = await db.select({ count: sql<number>`count(*)::int` }).from(adminUsers);
  if ((existingAdminCount[0]?.count ?? 0) > 0) {
    return { ok: false, error: "An administrator already exists. Initial setup is closed." };
  }

  const strength = isPasswordStrongEnough(parsed.data.password);
  if (!strength.ok) return { ok: false, error: strength.reason! };

  const passwordHash = await hashPassword(parsed.data.password);
  const createdRows = await db
    .insert(adminUsers)
    .values({ email: parsed.data.email.toLowerCase(), passwordHash })
    .returning({ id: adminUsers.id });
  const created = createdRows[0];
  if (!created) {
    return { ok: false, error: "Could not create the administrator account. Please try again." };
  }

  await logAdminAction({
    adminId: created.id,
    action: "admin.initial_setup",
    targetType: "admin_user",
    targetId: created.id,
    description: `Initial administrator account created for ${parsed.data.email}.`,
  });

  redirect("/admin?setup=complete");
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginAdmin(formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { ok: false, error: "Enter a valid email and password." };

  const ip = await clientIp();

  if (await isRateLimited(ip, parsed.data.email)) {
    return { ok: false, error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, parsed.data.email.toLowerCase()))
    .limit(1);
  const admin = rows[0];

  // Always run verifyPassword, even against a dummy hash when no account
  // exists, so response timing doesn't reveal whether the email is valid.
  const DUMMY_HASH =
    "$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHRzb21lc2FsdA$Y2xvdWRmbGFyZWlzbm90YXJlYWxoYXNo";
  const passwordOk = await verifyPassword(parsed.data.password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !passwordOk) {
    await recordLoginAttempt(ip, parsed.data.email, false);
    return { ok: false, error: "Incorrect email or password." };
  }

  await recordLoginAttempt(ip, parsed.data.email, true);
  const h = await headers();
  await createSession(admin.id, { userAgent: h.get("user-agent") ?? undefined, ipAddress: ip });
  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, admin.id));
  await logAdminAction({
    adminId: admin.id,
    action: "admin.login",
    description: `Administrator ${admin.email} logged in.`,
  });

  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  await destroySession();
  redirect("/admin");
}

export async function adminAccountExists(): Promise<boolean> {
  const rows = await db.select({ count: sql<number>`count(*)::int` }).from(adminUsers);
  return (rows[0]?.count ?? 0) > 0;
}
