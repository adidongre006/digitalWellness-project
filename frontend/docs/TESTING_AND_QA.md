# Testing and QA

## Honesty note (read this first)

This project was generated and assembled without access to a provisioned Neon database, a
real xAI API key, or a running browser/deployment environment. **The test files listed below
are real, complete test code — they are not placeholders — but they have not been executed
against a live deployment of this project**, because no live deployment exists at the time of
writing. This document states plainly which tests exist, what they're designed to check, and
what running them for real still requires. Do not read any checkmark below as "this passed" —
read it as "this test exists and is ready to run."

Before presenting this project as complete for submission or production use, **actually run**
every command below against a real Neon database, a real (or mocked, for backend unit tests)
xAI key, and a built, running instance of both servers, and replace this note with real
results, including any failures found and fixed.

## What exists and how to actually run it

### Frontend unit tests (Vitest) — `tests/unit/`
- `resources-data.test.ts` — validates the resource catalog has exactly ten entries, unique
  ids/slugs, all four categories represented, every resource has at least one stated
  limitation, and that "Free" is never silently assumed to imply open source (or vice versa).
- `recommendations.test.ts` — validates the assessment's scoring logic: correct category
  filtering, incompatibility flagging (never silent exclusion), budget filtering.

Run: `npm run test`

### Backend unit/integration tests (Pytest) — `backend/tests/`
- `test_health.py` — health endpoint shape.
- `test_resources.py` — list/get-by-slug/404 behavior, with the database mocked.
- `test_chat.py` — request validation (empty/oversized message rejected), the non-streaming
  endpoint, SSE event framing for both success and failure paths, and that a raised exception
  never leaks its message text to the client.

These are written to run **without** a live Neon database or a real `XAI_API_KEY` — see
`backend/tests/conftest.py` for how the database and model calls are mocked. This means they
verify this backend's own logic (validation, routing, SSE framing, error handling), not that
the real xAI API or real Neon database behave as expected in production — that still needs a
real end-to-end check before a real deployment is trusted.

Run: `cd backend && pytest`

### End-to-end tests (Playwright) — `tests/e2e/`
- `navigation.spec.ts` — landing page renders, **no "Admin" link appears anywhere in the
  public nav or footer** (the project's most security-relevant UI requirement), primary nav
  links resolve, mobile shows a hamburger menu.
- `assessment.spec.ts` — selecting a problem and submitting shows recommendations; a device
  filter narrows results; reset clears the form.
- `admin-auth.spec.ts` — `/admin/dashboard` redirects to `/admin` without a session; `/admin`
  shows a login/setup form; `/admin` is unreachable via any link from the homepage.

Configured (`playwright.config.ts`) to run against four device profiles: iPhone 14, Pixel 7,
iPad Mini, and desktop Chrome — covering the project's mobile/tablet/desktop requirement.

Run: `npm run test:e2e` (this builds and starts the app itself per the `webServer` config;
it will **fail immediately** without a real `DATABASE_URL` configured, since the app can't
render resource data otherwise).

## What is explicitly NOT yet covered

Documented here rather than silently omitted, per the project's anti-fabrication requirement:

- **No test currently exercises a real xAI Grok response.** `test_chat.py` mocks the model
  call entirely. A real smoke test (send a real message, confirm a real streamed reply) must
  be run manually against a deployed backend with a real `XAI_API_KEY` before launch.
- **No automated accessibility audit (e.g. axe-core) is wired into the test suite yet.**
  `docs/ACCESSIBILITY_CHECKLIST.md` is a manual checklist, not an automated scan — see that
  document for what has and hasn't been manually verified.
- **No component-level React Testing Library tests exist yet** for individual components
  (e.g. the theme switcher, the comparison table's sort behavior in isolation) — current
  frontend coverage is at the data/logic layer (Vitest) and the full-flow layer (Playwright),
  with the component layer in between not yet covered.
- **No load/performance testing** has been done on the chat endpoint's rate limiter or the
  Neon pooled connection under concurrent load.
- **Browser compatibility** has been designed for evergreen Chrome, Firefox, Safari, and Edge
  (standard Tailwind v4 / modern CSS support assumed) but not manually verified in each.

## Manual QA checklist (to run before each release)

- [ ] Fresh `npm run db:seed` run twice in a row inserts exactly ten resources both times (no duplicates).
- [ ] `/admin` setup form is refused a second time after the first admin account exists.
- [ ] Five failed login attempts in a row lock out further attempts for that IP+email for 15 minutes.
- [ ] Changing the admin password invalidates the current session (re-login required).
- [ ] A chat message longer than 4000 characters is rejected with a clear error.
- [ ] The comparison table remains horizontally scrollable, not page-breaking, at 360px width.
- [ ] Every themed page (Midnight/Sanctuary/Warm) passes a manual contrast spot-check on body text and buttons.

## Anonymous student tester template (3–5 testers)

Use this template to gather real feedback once a live deployment exists — results go in
`docs/USER_FEEDBACK.md`, never here.

```
Tester # (no name/email collected):
Device & browser used:
Task 1 — Complete the wellness assessment for a problem that's real for you:
  - Did the recommendation feel relevant?  Y/N, why?
  - Was anything confusing?
Task 2 — Find and read one full setup guide:
  - Could you follow it without the website open on a second device?
Task 3 — Ask the AI Co-Pilot one question in your own words:
  - Did it recommend something from the catalog? Did it explain why?
  - Did it ever claim something you doubted?
Task 4 — Try the comparison table on your phone:
  - Any horizontal scrolling issues? Anything cut off?
Overall: would you actually use this? What's missing?
```
