# Resource Comparison

This document mirrors `src/data/resources.ts`, the canonical source of truth loaded into
Neon via `npm run db:seed`. **If you edit a resource, edit the data file (and re-seed) — then
update this document to match.** All ten resources were verified on **2026-11-08**.

---

## Screen Time

### Google Digital Wellbeing
- **Purpose:** Built-in Android dashboard for seeing and limiting phone usage.
- **Platforms:** Android (9+)
- **Pricing:** Free
- **Privacy:** On-device, tied to the Google account already on the device.
- **Limitations:** Android only; menu layout varies by OEM; newest features (Pause Point) are
  limited to a subset of devices (e.g. Pixel 11) as of late 2026.
- **Official:** https://wellbeing.google/ · Docs: https://support.google.com/android/answer/9346420

### Apple Screen Time
- **Purpose:** Built-in iPhone/iPad/Mac usage tracking and limit-setting.
- **Platforms:** iOS, iPadOS, macOS
- **Pricing:** Free
- **Privacy:** On-device, end-to-end encrypted sync across a user's own Apple devices.
- **Limitations:** Apple devices only; a user with the device passcode can remove their own
  limits unless a separate Screen Time passcode is set.
- **Official:** https://www.apple.com/families/ · Docs: https://support.apple.com/en-us/HT208982

### StayFree — Screen Time Tracker & App Blocker
- **Purpose:** Third-party cross-platform tracker + blocker with a browser companion.
- **Platforms:** Android, iOS, Chrome, Firefox
- **Pricing:** Freemium
- **Privacy:** Third-party account required for cross-device sync — a different model from the
  OS-native tools above.
- **Limitations:** Free tier shows ads; exact paid price isn't fixed/published — check the live
  store listing.
- **Official:** https://stayfreeapps.com/ · Docs (App Store listing): https://apps.apple.com/us/app/stayfree-block-apps-sites/id1631132311

## Focus

### Freedom
- **Purpose:** Cross-device focus-session blocker, synced across phone/laptop/browser at once.
- **Platforms:** Windows, macOS, iOS, Android, Chrome
- **Pricing:** Freemium (Premium ≈ $8.99/mo or ≈ $3.33/mo billed annually; lifetime ≈ $99.50 —
  verify current figures at freedom.to/pricing)
- **Privacy:** Account-based; sessions/devices sync through Freedom's own servers.
- **Limitations:** iOS blocking is weaker than Android/desktop due to Apple platform
  restrictions; free tier only supports short on-demand sessions.
- **Official:** https://freedom.to/ · Docs: https://freedom.to/pricing

### Cold Turkey Blocker
- **Purpose:** High-friction desktop blocker with a full-system lockout mode.
- **Platforms:** Windows, macOS
- **Pricing:** Freemium (Pro ≈ one-time $39, sometimes closer to $45 — verify at
  getcoldturkey.com/pricing)
- **Privacy:** Local app, no account, no cloud sync.
- **Limitations:** No mobile support; blocks (especially Frozen Turkey) are intentionally hard
  to undo mid-session.
- **Official:** https://getcoldturkey.com/ · Docs: https://getcoldturkey.com/pricing/

### LeechBlock NG
- **Purpose:** Free, open-source scheduled website blocker (browser extension).
- **Platforms:** Firefox, Chrome, Edge
- **Pricing:** Free
- **Privacy:** Runs entirely locally; no account, no server dependency.
- **Limitations:** Browser-only (no native app blocking); easy to bypass by disabling the
  extension unless paired with an OS-level tool.
- **Official:** https://www.proginosko.com/leechblock/ · Docs: https://www.proginosko.com/leechblock/documentation/

## Sleep

### Android Bedtime Mode
- **Purpose:** Built-in grayscale + Do Not Disturb scheduling for nightly wind-down.
- **Platforms:** Android
- **Pricing:** Free
- **Privacy:** Same model as Digital Wellbeing — on-device, Google-account-linked.
- **Limitations:** Android only; lives inside Digital Wellbeing rather than as its own app;
  manually overridable at any time.
- **Official:** https://wellbeing.google/ · Docs: https://support.google.com/android/answer/9346420

### Apple Sleep Focus
- **Purpose:** Built-in Focus mode silencing notifications on a Health-app sleep schedule.
- **Platforms:** iOS, iPadOS, watchOS
- **Pricing:** Free
- **Privacy:** On-device, governed by Apple's platform privacy policy.
- **Limitations:** iOS/iPadOS/watchOS only; requires a Health app sleep schedule first;
  manually overridable.
- **Official:** https://www.apple.com/ios/focus/ · Docs: https://support.apple.com/en-us/HT212608

## Privacy

### uBlock Origin
- **Purpose:** Free, open-source, wide-spectrum ad/tracker content blocker.
- **Platforms:** Firefox, Edge (see limitation below re: Chrome)
- **Pricing:** Open Source
- **Privacy:** GPLv3, no telemetry, no account, no monetization strategy.
- **Limitations:** ⚠️ **Google removed the full version from the Chrome Web Store on August 31,
  2026** as part of Chrome's Manifest V3 transition. Chrome users get "uBlock Origin Lite"
  instead, which independent comparisons suggest blocks noticeably less than the full version
  and drops custom filter-list support. Firefox continues to support the full version.
- **Official:** https://ublockorigin.com/ · Docs: https://github.com/gorhill/uBlock/wiki

### Privacy Badger
- **Purpose:** Free, open-source tracker blocker from the EFF that learns trackers
  algorithmically rather than from a fixed list.
- **Platforms:** Chrome, Firefox, Edge
- **Pricing:** Open Source
- **Privacy:** Built by the EFF (a nonprofit), states no data collection.
- **Limitations:** Less comprehensive immediately after install since it learns over time;
  complements rather than replaces a list-based blocker like uBlock Origin.
- **Official:** https://privacybadger.org/

---

## Summary table

| Resource | Category | Platforms | Pricing | Open Source |
|---|---|---|---|---|
| Google Digital Wellbeing | Screen Time | Android | Free | No |
| Apple Screen Time | Screen Time | iOS, iPadOS, macOS | Free | No |
| StayFree | Screen Time | Android, iOS, Chrome, Firefox | Freemium | No |
| Freedom | Focus | Windows, macOS, iOS, Android, Chrome | Freemium | No |
| Cold Turkey Blocker | Focus | Windows, macOS | Freemium | No |
| LeechBlock NG | Focus | Firefox, Chrome, Edge | Free | Yes |
| Android Bedtime Mode | Sleep | Android | Free | No |
| Apple Sleep Focus | Sleep | iOS, iPadOS, watchOS | Free | No |
| uBlock Origin | Privacy | Firefox, Edge* | Open Source | Yes |
| Privacy Badger | Privacy | Chrome, Firefox, Edge | Open Source | Yes |

\* Full version; Chrome offers only the reduced-capability "Lite" build as of August 2026.
