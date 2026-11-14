# Accessibility Checklist (WCAG 2.2 AA target)

**Status note, honestly stated:** this checklist reflects what was *designed and implemented*
to meet each criterion. It has not been run through an automated scanner (axe-core, Lighthouse)
or a screen-reader walkthrough on a real device, because no live deployment exists yet — see
`docs/TESTING_AND_QA.md`. Do not present this project as WCAG 2.2 AA *verified* until that
manual/automated pass has actually happened; "implemented with accessibility in mind" and
"audited and confirmed compliant" are different claims, and this document is currently the
former.

## Navigation
- [x] Semantic `<header>`, `<nav aria-label="Primary">`, `<main id="main-content">`, `<footer>` landmarks (`src/components/layout/`).
- [x] Skip-to-content link, visually hidden until focused (`src/app/layout.tsx`).
- [x] Active route indicated both visually and via `aria-current="page"` (`site-nav.tsx`).
- [ ] Not yet manually verified: skip link actually lands focus on the right element across all pages.

## Keyboard support
- [x] All interactive controls are real `<button>`/`<a>`/form elements, not `<div onClick>`.
- [x] Mobile menu, theme switcher, and all dialogs (Radix-based) are keyboard operable by
  construction (Radix UI primitives handle focus trapping and Escape-to-close).
- [ ] Not yet manually verified: full keyboard-only pass through the assessment → results flow
  and the admin dashboard's edit/delete dialogs.

## Screen readers
- [x] Icon-only buttons have `aria-label` (menu toggle, theme switcher, password visibility, copy/retry in chat).
- [x] Decorative icons marked `aria-hidden="true"` throughout.
- [x] Live regions (`aria-live="polite"`) on the assessment's result count and the resources
  page's filtered-result count, so screen reader users hear result changes without refocusing.
- [ ] Not yet manually verified with an actual screen reader (VoiceOver/NVDA/TalkBack).

## Contrast
- [x] All three themes designed against the provided purple palette (Midnight) and two light
  themes (Sanctuary, Warm) with body text and muted text colors chosen for contrast against
  their respective backgrounds.
- [x] Pricing badges never rely on color alone — the classification text ("Free", "Freemium",
  "Paid", "Open Source") is always present alongside the color (see `src/components/ui/badge.tsx`'s comment).
- [ ] Not yet run through an automated contrast checker on every token pair in every theme —
  recommended before claiming AA compliance (e.g. `--muted-foreground` against `--background`
  in each of the three themes).

## Forms
- [x] Every input has an associated `<Label htmlFor>` (login, setup, assessment filters, admin
  edit dialogs).
- [x] Required fields marked with `aria-required="true"` in addition to the native `required` attribute.
- [x] Error messages rendered with `role="alert"` so they're announced immediately (login form,
  setup form, resource edit/delete dialogs, password change form).
- [x] Password visibility toggle has a dynamic `aria-label` ("Show password" / "Hide password").

## Images
- [x] No decorative images used that would need alt text workarounds — the project
  intentionally uses Lucide icon glyphs (all `aria-hidden`) rather than photographic imagery
  for resource "icons," sidestepping the risk of missing/poor alt text on third-party logos.
- [ ] If real guide screenshots are added later (see `docs/SETUP_GUIDES.md`'s screenshot
  policy), each must get descriptive, non-generic alt text at that time — tracked here as a
  future requirement, not yet applicable since no screenshots exist.

## Focus indicators
- [x] A visible, theme-consistent focus ring is applied globally via `:focus-visible` in
  `globals.css`, rather than relying on (or suppressing) the browser default.

## Motion
- [x] `@media (prefers-reduced-motion: reduce)` globally collapses animation/transition
  durations to near-zero (`globals.css`).
- [x] Animations throughout are restrained by design (per the project's own "avoid
  unnecessary animation" requirement) — no entrance animations, parallax, or autoplay motion.

## Tables
- [x] The comparison table uses real `<table>`/`<th scope="col">` semantics
  (`src/components/ui/table.tsx`), not a div-grid pretending to be a table.
- [x] Wrapped in a horizontally scrollable container so narrow viewports don't force
  page-level horizontal scroll.
- [ ] Not yet manually verified with a screen reader that row/column association reads sensibly.

## Dialogs
- [x] All dialogs (resource edit, resource delete confirmation) use Radix UI's Dialog
  primitive, which provides focus trapping, Escape-to-close, and correct `aria-modal`/`role="dialog"` semantics by default.

## Mobile accessibility
- [x] Touch targets sized at a minimum ~40–44px (buttons, nav items, filter pills).
- [x] `viewport-fit=cover` + safe-area padding considerations documented for any future
  full-bleed mobile layout (the chat composer already accounts for `env(safe-area-inset-bottom)`).
- [x] No horizontal page scroll by design — wide content (tables, badge rows) scrolls within
  its own container instead.

## Summary

| Category | Designed for | Manually/automatically verified |
|---|---|---|
| Navigation | Yes | Partial |
| Keyboard | Yes | No |
| Screen readers | Yes | No |
| Contrast | Yes | No |
| Forms | Yes | Partial |
| Images | Yes (N/A — no photos) | N/A |
| Focus indicators | Yes | No |
| Motion | Yes | No |
| Tables | Yes | No |
| Dialogs | Yes (via Radix) | No |
| Mobile | Yes | No |

**Next step before any accessibility compliance claim:** run axe-core against a live build of
every route, and do one full keyboard-only and one screen-reader pass of the assessment,
resource detail, comparison, guides, chat, and admin login flows.
