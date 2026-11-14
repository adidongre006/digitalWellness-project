"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { setupInitialAdmin } from "@/app/admin/actions";

export function SetupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await setupInitialAdmin(formData);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          No administrator account exists yet. This one-time setup is only possible because you have the
          private <code>ADMIN_INITIAL_SETUP_SECRET</code> configured on the server — it permanently disables
          itself the moment the first account is created.
        </p>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="setupSecret">Setup secret</Label>
          <Input id="setupSecret" name="setupSecret" type="password" required aria-required="true" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Administrator email</Label>
          <Input id="email" name="email" type="email" autoComplete="username" required aria-required="true" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={12}
              required
              aria-required="true"
              aria-describedby="password-hint"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
          <p id="password-hint" className="text-xs text-subtle-foreground">
            At least 12 characters, mixing letters with numbers or symbols.
          </p>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="mt-2">
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {pending ? "Creating account…" : "Create administrator account"}
        </Button>
      </form>
    </div>
  );
}
