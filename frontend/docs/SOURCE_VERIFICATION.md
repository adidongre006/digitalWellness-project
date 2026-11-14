# Source Verification Register

Every resource's facts were checked directly against official sources (never against
third-party roundup articles alone) on the date below. This register is the audit trail behind
`docs/RESOURCE_COMPARISON.md` and `src/data/resources.ts`. The same information is also
written into the `resource_sources` table by the seed script, and administrators can add fresh
verification rows from the dashboard's Resources tab, which also appends to this table.

**All entries below were checked on 2026-11-08.**

| Resource | Official website | Pricing / support docs | Privacy policy | Date checked | Notes |
|---|---|---|---|---|---|
| Google Digital Wellbeing | wellbeing.google | support.google.com/android/answer/9346420 | policies.google.com/privacy | 2026-11-08 | Confirmed built-in, free, feature set varies by Android version/OEM. |
| Apple Screen Time | apple.com/families | support.apple.com/en-us/HT208982 | apple.com/legal/privacy | 2026-11-08 | Confirmed built-in, free, Family Sharing requirement for remote management. |
| StayFree | stayfreeapps.com | App Store listing (apps.apple.com, id1631132311) | stayfreeapps.com/privacy-policy | 2026-11-08 | Exact in-app-purchase price not published as a fixed figure; confirmed freemium model and ads in free tier via store listing and independent 2026 comparison coverage. |
| Freedom | freedom.to | freedom.to/pricing | freedom.to/privacy | 2026-11-08 | Current pricing (~$8.99/mo, ~$3.33/mo annual, ~$99.50 lifetime) cross-checked across freedom.to's own pricing history and third-party pricing trackers; confirmed as approximate and subject to change. |
| Cold Turkey Blocker | getcoldturkey.com | getcoldturkey.com/pricing | getcoldturkey.com/privacy | 2026-11-08 | Confirmed desktop-only (Windows/macOS), free vs. Pro (one-time, ~$39) tier split, no Mac App Store distribution. |
| LeechBlock NG | proginosko.com/leechblock | proginosko.com/leechblock/documentation | proginosko.com/leechblock/faq/permissions | 2026-11-08 | Confirmed free, open source, browser-only, no account. |
| Android Bedtime Mode | wellbeing.google | support.google.com/android/answer/9346420 | policies.google.com/privacy | 2026-11-08 | Confirmed as a feature within Digital Wellbeing, not a standalone app/listing. |
| Apple Sleep Focus | apple.com/ios/focus | support.apple.com/en-us/HT212608 | apple.com/legal/privacy | 2026-11-08 | Confirmed dependency on a Health-app sleep schedule for automatic activation. |
| uBlock Origin | ublockorigin.com | github.com/gorhill/uBlock/wiki | github.com/gorhill/uBlock/wiki/Privacy-policy | 2026-11-08 | **Time-sensitive finding:** confirmed via multiple independent news sources (adblock-tester.com, cyberinsider.com, betanews.com, and others) that Google removed the classic/full version from the Chrome Web Store on August 31, 2026, while Firefox has publicly committed to continued support. This materially changes the resource's platform-compatibility claim and is called out explicitly rather than silently left in the "Platforms" list. |
| Privacy Badger | privacybadger.org | privacybadger.org | eff.org/policy | 2026-11-08 | Confirmed EFF ownership, open-source status, and no-data-collection claim per the EFF's own policy page. |

## Verification methodology

1. **Official website first.** Every claim starts from the vendor's own site, not a comparison
   blog, affiliate roundup, or forum post.
2. **Pricing pages checked directly**, not inferred from an app-store search-result snippet,
   wherever the vendor publishes one (Freedom, Cold Turkey). Where pricing is only available
   as an in-app purchase with no fixed public figure (StayFree), the document says so rather
   than inventing a number.
3. **Platform-breaking changes get flagged explicitly**, not just reflected quietly in a
   platform list — see the uBlock Origin / Chrome Web Store removal entry above, which is the
   single most impactful fact discovered during verification for this round.
4. **Re-verification cadence:** this register should be refreshed at least once per academic
   term, or sooner if a resource's pricing or platform support is reported to have changed.
   The admin dashboard's "Source Verification" workflow (Resources tab → Edit) is the
   mechanism for recording a fresh check without needing to touch the codebase.
