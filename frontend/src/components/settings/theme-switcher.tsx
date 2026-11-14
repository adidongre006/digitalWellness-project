"use client";

import * as Popover from "@radix-ui/react-popover";
import { Check, Palette } from "lucide-react";
import { useTheme, type ThemeName } from "./theme-provider";
import { cn } from "@/lib/utils";

const THEMES: { id: ThemeName; label: string; swatch: string[] }[] = [
  { id: "midnight", label: "Purple Midnight", swatch: ["#090814", "#8b5cf6", "#a855f7"] },
  { id: "sanctuary", label: "Sanctuary", swatch: ["#faf9f6", "#0f9d6e", "#10b981"] },
  { id: "warm", label: "Warm Minimalist", swatch: ["#f7f1e8", "#c2622f", "#d97757"] },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Change theme"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background-secondary text-foreground transition-colors hover:border-primary/50"
        >
          <Palette className="h-4 w-4" aria-hidden="true" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          className="z-50 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl"
        >
          <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-subtle-foreground">
            Theme
          </p>
          <div className="flex flex-col gap-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition-colors hover:bg-background-secondary",
                  theme === t.id && "bg-background-secondary"
                )}
              >
                <span className="flex overflow-hidden rounded-full border border-border">
                  {t.swatch.map((c, i) => (
                    <span key={i} className="h-5 w-3" style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span className="flex-1">{t.label}</span>
                {theme === t.id && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
