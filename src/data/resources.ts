/**
 * CANONICAL RESOURCE CATALOG
 * ---------------------------------------------------------------------------
 * This file is the single source of truth for the ten Digital Wellness
 * resources. It is consumed by:
 *   1. The Drizzle seed script (src/db/seed.ts) which loads these rows into
 *      the Neon `resources` table.
 *   2. The assessment / recommendation engine (src/lib/recommendations).
 *   3. The FastAPI backend indirectly: the backend reads from Postgres
 *      (never from this file directly) so the chatbot, the comparison
 *      table, and the assessment always answer from the same data.
 *
 * Every fact below was checked against the vendor's own site, pricing page,
 * or app-store listing. Where a price or feature is likely to drift (app
 * store in-app-purchase pricing, promotional discounts), the entry says so
 * explicitly instead of inventing a precise number. "verifiedOn" records the
 * date the fact was actually checked, not the date the resource launched.
 *
 * Do NOT add an 11th resource or remove one of the ten without updating
 * docs/RESOURCE_COMPARISON.md and docs/SOURCE_VERIFICATION.md to match.
 */

export type Category = "screen-time" | "focus" | "sleep" | "privacy";
export type Pricing = "Free" | "Freemium" | "Paid" | "Open Source";
export type Platform =
  | "Android"
  | "iOS"
  | "iPadOS"
  | "macOS"
  | "Windows"
  | "Linux"
  | "Chrome"
  | "Firefox"
  | "Edge"
  | "watchOS";

export interface WellnessResource {
  id: string;
  slug: string;
  name: string;
  category: Category;
  purpose: string;
  description: string;
  platforms: Platform[];
  pricing: Pricing;
  freeFunctionality: string;
  paidRestrictions: string | null;
  openSource: boolean;
  privacyInfo: string;
  dataCollection: string;
  accessibilityNotes: string;
  limitations: string[];
  officialWebsite: string;
  officialDocsUrl: string;
  privacyPolicyUrl: string | null;
  verifiedOn: string; // ISO date, last manually verified against official sources
}

export const RESOURCES: WellnessResource[] = [
  {
    id: "res_google_digital_wellbeing",
    slug: "google-digital-wellbeing",
    name: "Google Digital Wellbeing",
    category: "screen-time",
    purpose:
      "Built-in Android dashboard for seeing and limiting how much time you spend on your phone.",
    description:
      "Digital Wellbeing is Google's screen-time toolkit, built directly into Android settings on Android 9 (Pie) and newer. It shows a daily/weekly usage dashboard, lets you set per-app timers, and bundles Focus Mode and Bedtime Mode into one place so you don't need to install anything extra.",
    platforms: ["Android"],
    pricing: "Free",
    freeFunctionality:
      "Everything: usage dashboard, app timers, Focus Mode, Bedtime Mode, and notification management are all free and built into the OS.",
    paidRestrictions: null,
    openSource: false,
    privacyInfo:
      "Usage data is processed on-device and tied to your Google account on that device; it is not a separate third-party service with its own data-sharing relationships.",
    dataCollection:
      "Screen-time statistics stay within the Android settings app and your Google account sync, governed by Google's general account privacy controls rather than a standalone privacy policy.",
    accessibilityNotes:
      "Inherits Android's system-wide accessibility services (TalkBack, font scaling, high contrast) since it lives inside Settings rather than a separate app UI.",
    limitations: [
      "Android only — there is no Windows, macOS, or iOS version.",
      "Exact menu layout and available toggles vary by device manufacturer (Samsung, Pixel, etc.) and Android version.",
      "Newer features such as Pause Point (an anti-doomscrolling nudge introduced with Android 17) have rolled out to only a subset of devices, such as the Pixel 11 series, as of late 2026.",
    ],
    officialWebsite: "https://wellbeing.google/",
    officialDocsUrl: "https://support.google.com/android/answer/9346420",
    privacyPolicyUrl: "https://policies.google.com/privacy",
    verifiedOn: "2026-11-08",
  },
  {
    id: "res_apple_screen_time",
    slug: "apple-screen-time",
    name: "Apple Screen Time",
    category: "screen-time",
    purpose:
      "Built-in iPhone, iPad, and Mac feature for tracking usage and setting app and downtime limits.",
    description:
      "Screen Time is Apple's native usage-tracking and limit-setting feature, available in Settings on iOS, iPadOS, and macOS. It reports app and website usage, lets you set per-app or per-category time limits, schedules Downtime, and can be extended into Family Sharing for a child's device.",
    platforms: ["iOS", "iPadOS", "macOS"],
    pricing: "Free",
    freeFunctionality:
      "All core features — usage reports, App Limits, Downtime, Communication Limits, and Content & Privacy Restrictions — are free and built into the OS.",
    paidRestrictions: null,
    openSource: false,
    privacyInfo:
      "Apple states Screen Time data is processed on-device and, when synced, through end-to-end encryption across a user's own Apple devices signed into the same Apple ID.",
    dataCollection:
      "Usage reports sync via iCloud to the user's other signed-in Apple devices; Apple's platform-wide privacy policy governs this rather than a feature-specific policy.",
    accessibilityNotes:
      "Fully integrated with iOS/macOS accessibility features (VoiceOver, Dynamic Type) since it is a native Settings panel.",
    limitations: [
      "Apple devices only — no Android, Windows, or standalone app.",
      "A determined user who knows the device passcode (or a second device without a restriction passcode set) can adjust or remove their own limits.",
      "Family Sharing setup is required to manage Screen Time remotely on someone else's device.",
    ],
    officialWebsite: "https://www.apple.com/families/",
    officialDocsUrl: "https://support.apple.com/en-us/HT208982",
    privacyPolicyUrl: "https://www.apple.com/legal/privacy/",
    verifiedOn: "2026-11-08",
  },
  {
    id: "res_stayfree",
    slug: "stayfree",
    name: "StayFree — Screen Time Tracker & App Blocker",
    category: "screen-time",
    purpose:
      "Third-party cross-platform screen-time tracker with app blocking, focus schedules, and a browser companion.",
    description:
      "StayFree is a third-party app (not built by Google or Apple) that tracks usage across Android and iOS and adds features the OS-native tools don't always offer in one place, such as cross-device usage totals and a Chrome/Firefox companion extension. A free tier covers the basics; a paid upgrade unlocks ad-free use and deeper cross-device history.",
    platforms: ["Android", "iOS", "Chrome", "Firefox"],
    pricing: "Freemium",
    freeFunctionality:
      "Daily/weekly usage history, over-use reminders, and basic app blocking are available for free, with ads shown in the free tier.",
    paidRestrictions:
      "The paid upgrade (billed as an in-app purchase; check the current price on the App Store or Play Store listing, since StayFree does not publish a fixed public price list) removes ads and unlocks extended cross-device history and focus-mode scheduling.",
    openSource: false,
    privacyInfo:
      "Unlike the OS-native tools, StayFree is a third-party company, so usage data passes through its own servers for cross-device sync rather than staying solely within Apple's or Google's account system.",
    dataCollection:
      "Requires creating a StayFree account to sync usage data between devices; review the in-app privacy policy before enabling cross-device sync, especially on a shared or school-managed device.",
    accessibilityNotes:
      "Standard mobile OS accessibility support (VoiceOver/TalkBack) as a conventional native app; no dedicated accessibility documentation was found on the vendor's site.",
    limitations: [
      "Free tier shows ads and has a smaller feature set than the paid tier.",
      "Exact paid pricing is not published as a fixed figure and should be checked on the live App Store / Play Store listing before recommending it to a budget-conscious student.",
      "As a third-party app it needs its own permissions (usage-access, accessibility service on Android) beyond what the OS-native tools require.",
    ],
    officialWebsite: "https://stayfreeapps.com/",
    officialDocsUrl: "https://apps.apple.com/us/app/stayfree-block-apps-sites/id1631132311",
    privacyPolicyUrl: "https://stayfreeapps.com/privacy-policy/",
    verifiedOn: "2026-11-08",
  },
  {
    id: "res_freedom",
    slug: "freedom",
    name: "Freedom",
    category: "focus",
    purpose:
      "Cross-device focus-session blocker that syncs a block list across your phone, laptop, and browser at once.",
    description:
      "Freedom lets you build a list of distracting apps, sites, or the whole internet and block them for a scheduled session across every device you're signed into simultaneously — so blocking YouTube on your laptop also blocks it on your phone. It is built by Freedom (freedom.to), a dedicated productivity company, not by Apple, Google, or a browser vendor.",
    platforms: ["Windows", "macOS", "iOS", "Android", "Chrome"],
    pricing: "Freemium",
    freeFunctionality:
      "The free plan blocks apps, sites, or the whole internet, with unlimited connected devices and custom blocklists, but limits you to short on-demand ('Start Now') sessions rather than longer scheduled or recurring ones.",
    paidRestrictions:
      "Premium (billed around $8.99/month, or roughly $3.33/month when paid annually) adds scheduled and recurring sessions and Locked Mode, which prevents ending a session early. A one-time 'Forever' lifetime license is also offered, historically around $99.50. Confirm current prices on freedom.to/pricing, since subscription pricing changes periodically.",
    openSource: false,
    privacyInfo:
      "Requires a Freedom account; block sessions and device list are stored on Freedom's servers to keep devices in sync, which is a different privacy model from an OS-native, account-free tool.",
    dataCollection:
      "Account-based; review Freedom's privacy policy for details on what session and device data is retained for syncing.",
    accessibilityNotes:
      "Desktop and mobile apps use standard native UI controls on each platform; no dedicated accessibility statement was found on the vendor site.",
    limitations: [
      "On iOS, Apple's platform restrictions mean Freedom often can only show a 'blocked' screen after an app opens rather than preventing the app from launching outright, which is weaker than its Android/desktop blocking.",
      "The free tier's short, on-demand sessions are not well suited to a recurring daily study schedule — that needs Premium.",
      "Requires creating an account and staying signed in on every device for cross-device sync to work.",
    ],
    officialWebsite: "https://freedom.to/",
    officialDocsUrl: "https://freedom.to/pricing",
    privacyPolicyUrl: "https://freedom.to/privacy",
    verifiedOn: "2026-11-08",
  },
  {
    id: "res_cold_turkey",
    slug: "cold-turkey",
    name: "Cold Turkey Blocker",
    category: "focus",
    purpose:
      "High-friction desktop blocker for Windows and macOS that can lock you out of sites, apps, or the whole computer.",
    description:
      "Cold Turkey Blocker is a desktop-only app that blocks distracting websites and applications on Windows and macOS, with a 'Frozen Turkey' mode that can lock the entire computer for a set period. It deliberately favors being hard to bypass over cross-device convenience: there is no mobile app, and blocks you set are not meant to be easy to undo mid-session.",
    platforms: ["Windows", "macOS"],
    pricing: "Freemium",
    freeFunctionality:
      "The free version blocks websites (and, on Windows, applications) with exceptions and timed blocks.",
    paidRestrictions:
      "Blocker Pro is a one-time purchase (commonly listed around $39, sometimes closer to $45 during pricing changes — check getcoldturkey.com/pricing) that adds scheduling, breaks/allowances, the Frozen Turkey full-lockout mode, and stricter lock types. There is no subscription.",
    openSource: false,
    privacyInfo:
      "Runs locally on the device with no required account and no cross-device cloud sync, which is a notably different privacy model from Freedom or StayFree.",
    dataCollection:
      "No account is required to use Cold Turkey Blocker itself; it is a local desktop application rather than a cloud service.",
    accessibilityNotes:
      "Standard Windows/macOS desktop UI conventions; no dedicated accessibility statement published by the vendor.",
    limitations: [
      "No iOS, Android, or Linux support — desktop (Windows/macOS) only, and not distributed through the Mac App Store because of Apple's sandboxing restrictions.",
      "Blocks, especially Frozen Turkey, can be difficult to undo mid-session by design — a student should test a short block before relying on a long one.",
      "Full functionality (app blocking, scheduling, Frozen Turkey) requires the one-time Pro purchase.",
    ],
    officialWebsite: "https://getcoldturkey.com/",
    officialDocsUrl: "https://getcoldturkey.com/pricing/",
    privacyPolicyUrl: "https://getcoldturkey.com/privacy/",
    verifiedOn: "2026-11-08",
  },
  {
    id: "res_leechblock_ng",
    slug: "leechblock-ng",
    name: "LeechBlock NG",
    category: "focus",
    purpose:
      "Free, open-source browser extension that blocks time-wasting websites on a schedule you define.",
    description:
      "LeechBlock NG (Next Generation) is a free browser extension for Firefox, Chrome, Edge, and Opera that blocks a list of sites you specify, on a schedule you control — for example, blocking social media on weekday mornings. It runs entirely inside the browser with no account, no server, and no cost.",
    platforms: ["Firefox", "Chrome", "Edge"],
    pricing: "Free",
    freeFunctionality:
      "The entire extension is free with no paid tier, no ads, and no account requirement.",
    paidRestrictions: null,
    openSource: true,
    privacyInfo:
      "Runs locally in the browser; the developer's documentation describes it as a self-contained extension with no external account or server dependency for its core blocking function.",
    dataCollection:
      "No account, no sign-in, no cloud sync — block lists and schedules are stored locally in your browser profile.",
    accessibilityNotes:
      "Options UI is a standard browser-extension settings page; no dedicated accessibility audit was found, but it uses plain browser-native form controls.",
    limitations: [
      "Blocks only what you do inside the browser — it has no way to block native mobile or desktop apps outside the browser.",
      "Because it is just a browser extension, a student determined to bypass it can disable or uninstall it, or use a different browser, unless paired with an OS-level tool like Cold Turkey for stricter enforcement.",
      "No built-in cross-device sync; settings must be configured separately in each browser profile.",
    ],
    officialWebsite: "https://www.proginosko.com/leechblock/",
    officialDocsUrl: "https://www.proginosko.com/leechblock/documentation/",
    privacyPolicyUrl: "https://www.proginosko.com/leechblock/faq/permissions/",
    verifiedOn: "2026-11-08",
  },
  {
    id: "res_android_bedtime_mode",
    slug: "android-bedtime-mode",
    name: "Android Bedtime Mode",
    category: "sleep",
    purpose:
      "Built-in Android feature that dims the screen to grayscale and silences notifications on a nightly schedule.",
    description:
      "Bedtime Mode is part of Android's Digital Wellbeing suite. On a schedule you set (or tied to your phone's charging routine), it switches the display to grayscale, silences notifications, and can display a simplified dim clock face — nudging you toward winding down rather than scrolling.",
    platforms: ["Android"],
    pricing: "Free",
    freeFunctionality:
      "Fully free and built into Android settings; no separate download or account is required beyond having a supported Android version.",
    paidRestrictions: null,
    openSource: false,
    privacyInfo:
      "Same on-device, Google-account-linked privacy model as the rest of Digital Wellbeing — it is a settings toggle, not a separate data-collecting service.",
    dataCollection:
      "No additional data collection beyond standard Android/Google account telemetry; it is a display and notification setting.",
    accessibilityNotes:
      "Grayscale mode itself is an accessibility-adjacent feature; it can be combined with Android's existing display-accessibility settings.",
    limitations: [
      "Android only, and found inside Digital Wellbeing rather than as a standalone app — a student looking for 'Bedtime Mode' in an app store will not find a separate listing.",
      "Exact scheduling options (time-based vs. charging-based) vary by Android version and manufacturer skin.",
      "Grayscale and silencing can be manually overridden at any time, so it works as a nudge rather than a hard restriction.",
    ],
    officialWebsite: "https://wellbeing.google/",
    officialDocsUrl: "https://support.google.com/android/answer/9346420",
    privacyPolicyUrl: "https://policies.google.com/privacy",
    verifiedOn: "2026-11-08",
  },
  {
    id: "res_apple_sleep_focus",
    slug: "apple-sleep-focus",
    name: "Apple Sleep Focus",
    category: "sleep",
    purpose:
      "Built-in iPhone/iPad Focus mode that silences notifications and dims the lock screen on your sleep schedule.",
    description:
      "Sleep is one of Apple's built-in Focus modes. Linked to the sleep schedule set up in the Health app, it automatically silences notifications, shows a simplified lock screen, and can dim the display during your wind-down and sleep hours, helping separate 'time to sleep' from 'time to scroll.'",
    platforms: ["iOS", "iPadOS", "watchOS"],
    pricing: "Free",
    freeFunctionality:
      "Entirely free and built into iOS; it uses the sleep schedule already configured in the Health app.",
    paidRestrictions: null,
    openSource: false,
    privacyInfo:
      "On-device and governed by Apple's general platform privacy policy; sleep-schedule data lives in the Health app, which Apple states is encrypted and under the user's control.",
    dataCollection:
      "Uses the Health app's sleep schedule; no separate third-party account is required.",
    accessibilityNotes:
      "Integrated with iOS accessibility settings (VoiceOver, Dynamic Type) as a native Focus mode.",
    limitations: [
      "iOS/iPadOS/watchOS only — there is no Android or desktop equivalent.",
      "Requires first setting up a sleep schedule in the Health app for Sleep Focus to activate automatically.",
      "Like Screen Time, a user can manually turn Sleep Focus off at any time — it is a nudge, not a lock.",
    ],
    officialWebsite: "https://www.apple.com/ios/focus/",
    officialDocsUrl: "https://support.apple.com/en-us/HT212608",
    privacyPolicyUrl: "https://www.apple.com/legal/privacy/",
    verifiedOn: "2026-11-08",
  },
  {
    id: "res_ublock_origin",
    slug: "ublock-origin",
    name: "uBlock Origin",
    category: "privacy",
    purpose:
      "Free, open-source content blocker that strips ads and trackers from webpages using configurable filter lists.",
    description:
      "uBlock Origin (uBO) is a long-running, open-source, wide-spectrum content blocker maintained by Raymond Hill. It blocks ads, trackers, and malware domains using filter lists you can customize, and is widely regarded as one of the most effective and lightweight blockers available.",
    platforms: ["Firefox", "Edge"],
    pricing: "Open Source",
    freeFunctionality:
      "The entire extension, including custom filter lists and advanced cosmetic filtering, is free with no paid tier, no ads, and — per the project's own stated policy — no donations sought.",
    paidRestrictions: null,
    openSource: true,
    privacyInfo:
      "Open-source (GPLv3) with no monetization strategy, no telemetry, and no account requirement, which the project treats as a core design principle rather than a marketing claim.",
    dataCollection:
      "No data collection described by the project; it runs entirely locally in the browser.",
    accessibilityNotes:
      "Uses standard browser-extension popup and options UI; no dedicated accessibility audit published, but the interface is simple, text-based toggles.",
    limitations: [
      "IMPORTANT PLATFORM CHANGE (verified 2026-11-08): Google removed the full ('Manifest V2') version of uBlock Origin from the Chrome Web Store on August 31, 2026, as part of Chrome's platform-wide move to Manifest V3. Chrome users can no longer install the full version; the vendor offers 'uBlock Origin Lite' for Chrome/Chromium browsers instead, which independent testing cited by multiple outlets suggests blocks noticeably less (roughly 60–70% in some comparisons) than the full version's 90–95%, and does not support custom filter lists.",
      "The full version continues to work normally on Firefox, which Mozilla has publicly committed to continuing to support.",
      "Browser-only — it does not block ads or trackers inside native mobile apps.",
    ],
    officialWebsite: "https://ublockorigin.com/",
    officialDocsUrl: "https://github.com/gorhill/uBlock/wiki",
    privacyPolicyUrl: "https://github.com/gorhill/uBlock/wiki/Privacy-policy",
    verifiedOn: "2026-11-08",
  },
  {
    id: "res_privacy_badger",
    slug: "privacy-badger",
    name: "Privacy Badger",
    category: "privacy",
    purpose:
      "Free, open-source browser extension from the EFF that learns to block invisible third-party trackers automatically.",
    description:
      "Privacy Badger is built and maintained by the Electronic Frontier Foundation (EFF), a digital-rights nonprofit. Rather than relying solely on pre-built filter lists like uBlock Origin, it algorithmically learns which third-party domains are tracking you across sites you visit and blocks them — making it a useful complement to a list-based ad blocker rather than a straight replacement.",
    platforms: ["Chrome", "Firefox", "Edge"],
    pricing: "Open Source",
    freeFunctionality:
      "Completely free, with the EFF stating it has no monetization strategy and does not sell or share user data.",
    paidRestrictions: null,
    openSource: true,
    privacyInfo:
      "Built by a nonprofit digital-rights organization (EFF) specifically as a privacy tool; the EFF states it does not collect browsing data.",
    dataCollection:
      "No data collection as described by the EFF; tracker-learning happens locally in the browser.",
    accessibilityNotes:
      "Minimalist icon-and-popup UI; no dedicated accessibility statement found, but the interface is simple and keyboard-navigable as a standard browser extension.",
    limitations: [
      "Because it learns trackers over time rather than starting from a complete list, it can be less immediately comprehensive than a mature filter-list blocker right after installation.",
      "Focused specifically on tracking protection rather than general ad-blocking, so students who also want ads removed typically pair it with a blocker like uBlock Origin rather than using it alone.",
      "Browser-only — no mobile app or native-app tracking protection.",
    ],
    officialWebsite: "https://privacybadger.org/",
    officialDocsUrl: "https://privacybadger.org/#How-does-Privacy-Badger-work",
    privacyPolicyUrl: "https://www.eff.org/policy",
    verifiedOn: "2026-11-08",
  },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  "screen-time": "Screen Time",
  focus: "Focus",
  sleep: "Sleep",
  privacy: "Privacy",
};

export function getResourceBySlug(slug: string): WellnessResource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}

export function getResourcesByCategory(category: Category): WellnessResource[] {
  return RESOURCES.filter((r) => r.category === category);
}
