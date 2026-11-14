import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-border bg-background-secondary text-foreground",
        primary: "border-transparent bg-primary/15 text-accent-soft",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// Pricing badges never rely on color alone (WCAG) — the label text itself
// carries the meaning ("Free", "Freemium", "Paid", "Open Source"), color is
// supplementary only.
