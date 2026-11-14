# Student Setup Guides

This document mirrors `src/data/guides.ts`, which is the canonical, renderable source for the
`/guides` page (via the shadcn/ui-style Accordion) and the seed data in the `guides` table.
If you edit a guide, edit the data file — then update this document and re-seed.

## Screenshot policy

**No fabricated screenshots are included anywhere in this project.** The project's own
requirement is explicit: provide genuine screenshots only when available, and never present a
placeholder as a real operating-system screenshot. Since this academic submission was produced
without capturing live device screenshots, every guide below uses **described steps** instead
("On Android, go to Settings → Digital Wellbeing & parental controls") rather than a generic
stock photo falsely labeled as a real Android or iOS screen. If real screenshots are captured
later, add them to `public/guides/` and reference them from `src/data/guides.ts`'s step
objects — doing so is a template change, not a redesign.

---

## Guide 1: Screen Time Management

**Objective:** Set up usage dashboards and app timers so you can see — and start limiting —
how much time you spend on distracting apps.

**Supported devices:** Android, iOS, iPadOS
**Prerequisites:** A phone running Android 9+ or iOS 12+; 5 minutes of uninterrupted setup time.

1. **Open your device's built-in dashboard.** Android: Settings → Digital Wellbeing &
   parental controls. iPhone: Settings → Screen Time.
2. **Review your current usage** for a few days before setting limits, so limits are based on
   real habits rather than a guess.
3. **Set an app timer or App Limit.** Android: tap an app in the dashboard, set a daily timer.
   iOS: Screen Time → App Limits → Add Limit, choose a category and a daily time.
4. **Set up Downtime / scheduled restrictions (optional).** iOS: Screen Time → Downtime.
   Android's equivalent is a Focus Mode schedule.
5. **Check your stats weekly** and adjust limits based on what's actually working.

**Expected outcome:** A visible daily/weekly usage total and at least one enforced limit on
your most time-consuming distracting app.

**Common problems:**
- *"I don't see a Digital Wellbeing option in Settings."* — Some OEM skins rename or relocate
  it; search Settings for "wellbeing" or "screen time," and confirm Android 9+.
- *"I keep bypassing my own App Limit."* — Set a separate Screen Time passcode on iOS so
  "Ignore Limit" isn't a one-tap action.

**Official references:** support.google.com/android/answer/9346420 ·
support.apple.com/en-us/HT208982

---

## Guide 2: Healthy Bedtime Routine

**Objective:** Use built-in bedtime tools to automatically quiet your phone and reduce
stimulating screen light before sleep.

**Supported devices:** Android, iOS
**Prerequisites:** A configured sleep schedule (iOS: in the Health app) or a target bedtime.

1. **Decide on a consistent bedtime window** — consistency matters more than the exact hours.
2. **Turn on Bedtime Mode (Android) or Sleep Focus (iOS).** Android: Digital Wellbeing →
   Bedtime mode → set a schedule. iOS: configure a sleep schedule in Health, then enable Sleep
   Focus in Settings → Focus.
3. **Enable grayscale during wind-down (optional)** — Android's Bedtime Mode can switch the
   display to grayscale automatically.
4. **Restrict notifications during sleep hours** — confirm this is actually turned on, not
   just scheduled.
5. **Review the schedule after a week** and adjust the start time if needed.

**Expected outcome:** Your phone automatically quiets down (and optionally switches to
grayscale) during your chosen sleep window, with no nightly manual step.

**Common problems:**
- *"Sleep Focus never turns on automatically."* — Confirm a sleep schedule is actually set in
  the Health app; Sleep Focus activates from that schedule.
- *"I still get calls during Bedtime Mode."* — Both platforms let you allow specific contacts
  or repeated callers through Do Not Disturb/Focus exceptions.

**Official references:** support.apple.com/en-us/HT212608 ·
support.google.com/android/answer/9346420

---

## Guide 3: Website Distraction and Tracker Blocking

**Objective:** Install a browser extension to block distracting sites on a schedule and reduce
third-party tracking while you browse.

**Supported devices:** Windows, macOS, Linux, Chrome, Firefox
**Prerequisites:** Firefox, Chrome, or Edge installed; a short list of sites to block.

1. **Choose your browser carefully if you want the full ad blocker.** As of late 2026, the
   full version of uBlock Origin is only installable on Firefox — Chrome/Edge now offer only
   the reduced-capability "uBlock Origin Lite."
2. **Install LeechBlock NG** from proginosko.com/leechblock/ or your browser's extension
   store, and open its options page.
3. **Add a block set** — a named set (e.g. "Study Hours") with the domains to block and the
   days/times it's active.
4. **Install uBlock Origin or Privacy Badger for tracking protection** — either (or both —
   they're complementary), following the platform note in step 1.
5. **Test the setup** by visiting a blocked site during an active window and confirming the
   extension icon shows trackers being blocked elsewhere.

**Expected outcome:** Distracting sites are inaccessible during study hours, and third-party
trackers are reduced across the sites you do visit.

**Common problems:**
- *"uBlock Origin isn't available in the Chrome Web Store."* — Expected as of August 31, 2026;
  use uBlock Origin Lite on Chrome, or switch to Firefox for the full version.
- *"LeechBlock isn't blocking a site I added."* — Check the domain format (no `https://`
  prefix) and confirm the current time is inside the block set's active schedule.

**Official references:** proginosko.com/leechblock/documentation/ ·
github.com/gorhill/uBlock/wiki · privacybadger.org
