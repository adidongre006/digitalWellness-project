import { db, auditLogs } from "@/db";

/**
 * Append-only audit trail for sensitive admin actions. Never pass a
 * password, session token, or setup secret into `description` — this is
 * enforced by convention here (callers are reviewed), since the column is
 * free-text and cannot validate its own contents.
 */
export async function logAdminAction(params: {
  adminId: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  description: string;
}) {
  await db.insert(auditLogs).values({
    adminId: params.adminId,
    action: params.action,
    targetType: params.targetType ?? null,
    targetId: params.targetId ?? null,
    description: params.description,
  });
}
