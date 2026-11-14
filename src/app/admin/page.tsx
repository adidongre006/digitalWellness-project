import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth/session";
import { adminAccountExists } from "./actions";
import { LoginForm } from "@/components/admin/login-form";
import { SetupForm } from "@/components/admin/setup-form";

// Never indexed, never linked from public navigation (see SiteNav's comment).
export const metadata = {
  title: "Administrator Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // If a valid session already exists, skip straight to the dashboard.
  // This still goes through the same server-side session check the
  // dashboard layout itself uses — no separate, weaker check here.
  const current = await getCurrentAdmin();
  if (current) redirect("/admin/dashboard");

  const hasAdmin = await adminAccountExists();

  return (
    <div className="ambient-glow flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold">
            {hasAdmin ? "Welcome Back, Administrator" : "Set Up Your Administrator Account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasAdmin
              ? "Secure access to your Digital Wellness Resource Hub."
              : "This runs once. After it completes, this form disappears for good."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {hasAdmin ? <LoginForm /> : <SetupForm />}
        </div>
      </div>
    </div>
  );
}
