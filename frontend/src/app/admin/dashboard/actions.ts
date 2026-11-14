"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, resources, resourceSources, guides } from "@/db";
import { eq, sql } from "drizzle-orm";
import { getCurrentAdmin } from "@/lib/auth/session";
import { hashPassword, verifyPassword, isPasswordStrongEnough } from "@/lib/auth/password";
import { destroyAllSessionsForAdmin } from "@/lib/auth/session";
import { adminUsers } from "@/db/schema";
import { logAdminAction } from "@/lib/auth/audit";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Every exported action below starts by re-verifying the session on the
 * server, even though the dashboard layout already redirects unauthenticated
 * browsers away. A server action can, in principle, be invoked directly
 * (e.g. a replayed request), so each sensitive mutation re-checks rather
 * than trusting that "the page that called me already checked."
 */
async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Not authenticated.");
  return admin;
}

const updateResourceSchema = z.object({
  id: z.string().min(1),
  pricing: z.enum(["Free", "Freemium", "Paid", "Open Source"]),
  officialWebsite: z.string().url(),
  officialDocsUrl: z.string().url(),
  limitationsText: z.string().min(1), // one limitation per line
  verifiedOn: z.string().min(1),
});

export async function updateResource(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = updateResourceSchema.safeParse({
    id: formData.get("id"),
    pricing: formData.get("pricing"),
    officialWebsite: formData.get("officialWebsite"),
    officialDocsUrl: formData.get("officialDocsUrl"),
    limitationsText: formData.get("limitationsText"),
    verifiedOn: formData.get("verifiedOn"),
  });
  if (!parsed.success) return { ok: false, error: "Please check every field — one or more look invalid." };

  const limitations = parsed.data.limitationsText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  await db
    .update(resources)
    .set({
      pricing: parsed.data.pricing,
      officialWebsite: parsed.data.officialWebsite,
      officialDocsUrl: parsed.data.officialDocsUrl,
      limitations,
      verifiedOn: new Date(parsed.data.verifiedOn),
      updatedAt: new Date(),
    })
    .where(eq(resources.id, parsed.data.id));

  await db.insert(resourceSources).values({
    resourceId: parsed.data.id,
    sourceType: "official_website",
    url: parsed.data.officialWebsite,
    dateChecked: new Date(parsed.data.verifiedOn),
    notes: `Updated by administrator ${admin.email} via dashboard.`,
  });

  await logAdminAction({
    adminId: admin.id,
    action: "resource.update",
    targetType: "resource",
    targetId: parsed.data.id,
    description: `Updated pricing/links/verification date for resource ${parsed.data.id}.`,
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/resources");
  revalidatePath("/comparison");
  return { ok: true };
}

const confirmDeleteSchema = z.object({
  id: z.string().min(1),
  confirmName: z.string().min(1),
});

export async function deleteResource(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = confirmDeleteSchema.safeParse({
    id: formData.get("id"),
    confirmName: formData.get("confirmName"),
  });
  if (!parsed.success) return { ok: false, error: "Missing confirmation." };

  const [existing] = await db.select().from(resources).where(eq(resources.id, parsed.data.id)).limit(1);
  if (!existing) return { ok: false, error: "Resource not found." };
  if (existing.name !== parsed.data.confirmName) {
    return { ok: false, error: "Confirmation text didn't match the resource name exactly." };
  }

  await db.delete(resources).where(eq(resources.id, parsed.data.id));

  await logAdminAction({
    adminId: admin.id,
    action: "resource.delete",
    targetType: "resource",
    targetId: parsed.data.id,
    description: `Deleted resource "${existing.name}" (${existing.id}). Catalog now deviates from the required count of ten until a replacement is added.`,
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/resources");
  revalidatePath("/comparison");
  return { ok: true };
}

const toggleGuideSchema = z.object({
  id: z.string().min(1),
  published: z.enum(["true", "false"]),
});

export async function toggleGuidePublished(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = toggleGuideSchema.safeParse({
    id: formData.get("id"),
    published: formData.get("published"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  await db
    .update(guides)
    .set({ published: parsed.data.published === "true", updatedAt: new Date() })
    .where(eq(guides.id, parsed.data.id));

  await logAdminAction({
    adminId: admin.id,
    action: "guide.toggle_published",
    targetType: "guide",
    targetId: parsed.data.id,
    description: `Set guide ${parsed.data.id} published=${parsed.data.published}.`,
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/guides");
  return { ok: true };
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(12),
});

export async function changeAdminPassword(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) return { ok: false, error: "Please fill in both password fields." };

  const [row] = await db.select().from(adminUsers).where(eq(adminUsers.id, admin.id)).limit(1);
  if (!row) return { ok: false, error: "Account not found." };

  const currentOk = await verifyPassword(parsed.data.currentPassword, row.passwordHash);
  if (!currentOk) return { ok: false, error: "Current password is incorrect." };

  const strength = isPasswordStrongEnough(parsed.data.newPassword);
  if (!strength.ok) return { ok: false, error: strength.reason! };

  const newHash = await hashPassword(parsed.data.newPassword);
  await db.update(adminUsers).set({ passwordHash: newHash }).where(eq(adminUsers.id, admin.id));

  // Changing the password invalidates every existing session, including
  // the one making this request — the admin will need to sign in again
  // with the new password. This limits the blast radius if the password
  // was changed because a session/device was compromised.
  await destroyAllSessionsForAdmin(admin.id);

  await logAdminAction({
    adminId: admin.id,
    action: "admin.password_change",
    description: `Administrator ${admin.email} changed their password. All sessions invalidated.`,
  });

  return { ok: true };
}

export async function getOverviewStats() {
  const [resourceCountRows, guideCountRows, latestVerification] = await Promise.all([
    db.select({ resourceCount: sql<number>`count(*)::int` }).from(resources),
    db.select({ guideCount: sql<number>`count(*)::int` }).from(guides),
    db.select({ verifiedOn: resources.verifiedOn, name: resources.name }).from(resources).orderBy(sql`${resources.verifiedOn} desc`).limit(1),
  ]);

  return {
    resourceCount: resourceCountRows[0]?.resourceCount ?? 0,
    guideCount: guideCountRows[0]?.guideCount ?? 0,
    categoryCount: 4, // screen-time, focus, sleep, privacy — fixed by design (section 9)
    lastVerification: latestVerification[0] ?? null,
  };
}
