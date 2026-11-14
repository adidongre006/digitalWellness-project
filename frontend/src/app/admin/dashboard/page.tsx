import { db, resources, guides, auditLogs } from "@/db";
import { desc } from "drizzle-orm";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { getOverviewStats } from "./actions";

export default async function DashboardPage() {
  // Defense in depth: the layout already guards this subtree, but a page
  // that touches admin-scoped data checks for itself rather than assuming
  // the layout above it was never bypassed or refactored incorrectly.
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");

  const [resourceRows, guideRows, auditRows, overview] = await Promise.all([
    db.select().from(resources).orderBy(resources.name),
    db.select().from(guides).orderBy(guides.title),
    db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(25),
    getOverviewStats(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Manage the resource catalog, guides, and your account.</p>
      <div className="mt-8">
        <DashboardShell
          resources={resourceRows}
          guides={guideRows}
          auditLogs={auditRows}
          overview={overview}
          adminEmail={admin.email}
        />
      </div>
    </div>
  );
}
