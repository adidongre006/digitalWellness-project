import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components (Next.js 16's explicit "use cache" model) is left off
  // (the 16.x default) so every route renders dynamically by default; admin
  // and resource routes opt into caching individually where it's safe to.
  //
  // typedRoutes is intentionally left off (the 16.x default): several
  // components build `<Link href>` values from a mapped array of
  // `{ href, label }` objects (see src/components/layout/site-nav.tsx and
  // site-footer.tsx) — a normal, common pattern that typedRoutes' generated
  // literal-union type fights unnecessarily. Turn it on later if the route
  // set stabilizes and most links become static string literals.
  typedRoutes: false,
  images: {
    // No remote wellness-tool logos are embedded from third-party hosts;
    // resource "icons" are rendered as Lucide glyphs instead, so no
    // remotePatterns are required. Add an entry here only if a verified,
    // licensed logo asset is later added to a specific CDN host.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
