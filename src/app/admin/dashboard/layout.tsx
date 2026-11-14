import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Sparkles } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth/session";
import { logoutAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/**
 * THE authorization boundary for the entire /admin/dashboard subtree.
 * proxy.ts (see project root) also redirects unauthenticated requests away
 * from /admin/dashboard for snappier UX, but that check is cookie-presence
 * only and is NOT trusted as real authorization — this server-rendered
 * layout re-verifies the session against the database on every request,
 * which is what actually decides whether the dashboard renders at all.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");

  return (
    <div className="min-h-dvh bg-background-secondary">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-display text-base font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            </span>
            Admin Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">{admin.email}</span>
            <form action={logoutAdmin}>
              <Button type="submit" variant="secondary" size="sm">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
