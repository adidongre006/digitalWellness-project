"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { ThemeSwitcher } from "@/components/settings/theme-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// INTENTIONAL: there is no "Admin" entry in this list. The admin area is
// reached only by navigating directly to /admin — see section 6 of the
// project spec ("do not display an Admin button... anywhere in the public
// application"). Protection is enforced server-side regardless.
const NAV_LINKS = [
  { href: "/assessment", label: "Assessment" },
  { href: "/resources", label: "Resources" },
  { href: "/comparison", label: "Compare" },
  { href: "/guides", label: "Guides" },
  { href: "/chat", label: "Co-Pilot" },
  { href: "/about", label: "About" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
          </span>
          Unplug
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active && "bg-card text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/assessment">Start Assessment</Link>
          </Button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-border bg-background px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-foreground hover:bg-card"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <ThemeSwitcher />
            <Button asChild size="sm" onClick={() => setOpen(false)}>
              <Link href="/assessment">Start Assessment</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
