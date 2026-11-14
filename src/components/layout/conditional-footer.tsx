"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";

// The chat page is a fixed-height app shell (sidebar + scrolling messages +
// anchored composer); a footer below it would force an extra, confusing
// scroll region rather than living at the bottom of real page content.
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/chat")) return null;
  return <SiteFooter />;
}
