# Academic Project Report: Digital Wellness Resource Hub

## 1. Abstract

The Digital Wellness Resource Hub is a full-stack web application that helps university
students discover, evaluate, compare, and configure digital wellness tools addressing screen
time, doomscrolling, poor sleep, concentration difficulty, notification overload, and online
privacy concerns. Rather than presenting an undifferentiated list of applications, the
platform explains, for each of ten independently verified resources, what problem it solves,
why it suits a given student, which platforms it supports, its real pricing structure, its
privacy model, and its concrete limitations. The system comprises a Next.js 16 / React 19
frontend, a Python FastAPI backend providing a streaming AI chatbot built on LangChain and
xAI's Grok model, and a Neon serverless PostgreSQL database accessed through Drizzle ORM from
the frontend and through asyncpg from the backend — both reading the same resource catalog, so
the website and the chatbot never disagree.

## 2. Introduction

Digital wellness — the practice of managing one's relationship with screens, notifications,
and online platforms — has become a widely discussed concern among university students, who
combine heavy academic reliance on digital tools with high personal social-media use. Existing
public resources addressing this (app-store search results, informal "best apps" blog posts)
tend to be shallow, commercially motivated, or silent on real trade-offs like platform
restrictions or pricing gotchas. This project builds a single, transparent, three-surface
system (guided assessment, searchable comparison table, and AI chatbot) backed by one verified
data source, aimed specifically at the student audience profiled in `docs/AUDIENCE_PROFILE.md`.

## 3. Problem Statement

Students report four recurring digital-wellbeing concerns: excessive/compulsive use of social
media ("doomscrolling"), screen use disrupting sleep, difficulty concentrating while studying
due to notifications and app-switching, and discomfort with how much of their online activity
is tracked. Finding a tool to address any one of these requires students to independently
research platform compatibility, true pricing (versus marketing-page pricing), and privacy
trade-offs — research most students don't have time to do well, and that existing roundups
rarely do rigorously. This project's problem statement is specifically: *can a single,
transparent system do that verification work once, centrally, and present it through whichever
interface (guided quiz, browsable table, or conversational chatbot) best fits how a given
student wants to explore it?*

## 4. Objectives

1. Build a working, responsive, database-backed web application — not a static mockup.
2. Verify exactly ten digital wellness resources against official sources, with dated
   verification records, rather than relying on memory or unverified secondary sources.
3. Implement a recommendation engine that explains its reasoning and never silently hides an
   incompatible result.
4. Build a real, streaming AI chatbot grounded in the same verified catalog, incapable (by
   system-prompt design) of inventing products, prices, or URLs.
5. Implement secure, from-scratch administrator authentication with no hardcoded or
   publicly-discoverable credentials.
6. Meet a WCAG 2.2 AA accessibility target across mobile, tablet, and desktop layouts.
7. Produce complete, honest academic and technical documentation, including an explicit record
   of what has and has not actually been tested (see `docs/TESTING_AND_QA.md`).

## 5. Target Audience

University and college students, predominantly ages 18–25, on a mix of Android/iOS phones and
Windows/macOS/Linux computers, generally budget-constrained. Full profile, including an
explicit separation of assumptions from actual survey data (none collected yet), is in
`docs/AUDIENCE_PROFILE.md`.

## 6. Existing System

At the time of writing, students seeking digital-wellness tool guidance generally rely on: (a)
their device's own built-in tool, discovered incidentally rather than taught; (b) generic
"best screen time apps" blog content, often not current, not platform-specific, and sometimes
written primarily to drive affiliate-link clicks rather than to inform; or (c) word of mouth.
None of these provide a consistent, filterable, explained, dated comparison across tools *and*
a conversational interface answering follow-up questions grounded in the same data.

## 7. Proposed System

A single Next.js application with:
- A **landing page** introducing the problem and the four problem categories.
- An **interactive assessment** (`/assessment`) producing 2–3 explained, honestly-caveated
  recommendations from the shared catalog.
- A **resource discovery** page (`/resources`) and **detail pages**
  (`/resources/[slug]`) with full per-resource transparency (pricing, privacy, limitations,
  accessibility notes, official links, verification date).
- A **comparison matrix** (`/comparison`) with search, category filtering, and sorting.
- **Three setup guides** (`/guides`) with real step-by-step instructions and troubleshooting.
- An **AI chatbot** (`/chat`) that answers free-form questions, grounded in the same catalog.
- A **private admin dashboard** (`/admin`, `/admin/dashboard`) for resource/guide management,
  with no public link anywhere in the app and server-verified authentication on every request.

## 8. Technology Stack

See the table in `README.md`. In summary: Next.js 16 (App Router) + React 19 + TypeScript
(strict) + Tailwind CSS v4 (CSS-first) + Radix UI primitives on the frontend; Python 3.12 +
FastAPI + LangChain + `langchain-xai` on the backend; Neon serverless PostgreSQL + Drizzle ORM
(frontend) / asyncpg (backend) for data; Argon2id + server-side sessions for authentication;
Vitest/Testing Library + Pytest + Playwright for testing; Vercel/Render/Neon for deployment.

## 9. System Architecture

See the Mermaid diagram in `README.md` and the detailed walkthrough in
`FULL_PROJECT_GUIDE.md`. The defining architectural decision is that **the frontend and backend
never maintain separate copies of the resource catalog** — `src/data/resources.ts` is seeded
into a single Neon `resources` table that both Drizzle (frontend) and asyncpg (backend) read
from directly. The browser never talks to the FastAPI backend directly; a thin Next.js route
handler (`src/app/api/chat/route.ts`) proxies the SSE stream, keeping the backend's network
location a server-only secret (`FASTAPI_BACKEND_URL`, not `NEXT_PUBLIC_*`).

## 10. Application Modules

| Module | Location | Responsibility |
|---|---|---|
| Design system & theming | `src/app/globals.css`, `src/components/settings/` | Three-theme CSS-first token system, no-flash theme switching |
| Resource catalog & recommendation engine | `src/data/`, `src/lib/recommendations/` | Canonical content + scoring logic |
| Public pages | `src/app/{page,assessment,resources,comparison,guides,about,privacy}` | All public-facing routes |
| Chatbot UI | `src/components/chatbot/`, `src/app/chat/` | Streaming conversational interface |
| Admin auth & dashboard | `src/lib/auth/`, `src/app/admin/`, `src/components/admin/` | Secure setup, login, session, resource/guide CRUD, audit log |
| Database layer | `src/db/` | Drizzle schema, client, idempotent seed script |
| AI backend | `backend/app/` | FastAPI app: chat orchestration, resource API, health check |

## 11. AI Integration

The chatbot uses LangChain's `ChatXAI` wrapper around xAI's Grok model family
(`backend/app/ai/model.py`). On every request, `backend/app/ai/agent.py` loads the full
ten-resource catalog fresh from Postgres and builds a system prompt
(`backend/app/ai/prompts.py`) that: (1) restricts recommendations to the provided catalog only,
(2) requires at least one stated limitation per recommendation, (3) forbids inventing prices
or URLs, (4) forbids medical/mental-health diagnosis or claims of curing addiction or sleep
disorders, and (5) requires explicit acknowledgment when no catalog resource fits. Responses
stream token-by-token via Server-Sent Events, defined identically on both the backend
(`backend/app/ai/streaming.py`) and frontend (`src/components/chatbot/chat-shell.tsx`).
**A specification discrepancy between "Grok" and a named model ("gpt-oss-120b") belonging to a
different provider is documented explicitly** in `backend/app/ai/model.py`, `README.md`, and
`docs/REVISION_LOG.md` rather than silently resolved by guessing.

## 12. Database Design

Six core tables (plus a rate-limiting table), detailed with inline rationale in
`src/db/schema.ts`: `resources` (the catalog), `resource_sources` (append-only verification
register), `guides`, `admin_users`, `admin_sessions`, `audit_logs`, and `login_attempts`.
Platform and limitation lists use `jsonb` rather than join tables, since they are small,
read-heavy, and never queried relationally. Session tokens are never stored directly — only a
SHA-256 hash of the opaque random token issued to the browser, following the same
"never store the real secret" principle applied to passwords (Argon2id).

## 13. Resource Evaluation Methodology

Documented fully in `docs/SOURCE_VERIFICATION.md`. In summary: every factual claim is checked
against the vendor's own website, pricing page, support documentation, or privacy policy —
never against a secondary roundup alone — with the date of verification recorded per resource.
Where a vendor does not publish a fixed, stable price (e.g. an app-store in-app purchase), the
catalog says so explicitly rather than inventing a number. Platform-breaking changes discovered
during verification (notably, uBlock Origin's removal from the Chrome Web Store on August 31,
2026) are called out as prominent, dated limitations rather than quietly folded into a platform
list.

## 14. Implementation

Implementation followed the eight-phase sequence specified for this project (foundation,
database, public application, AI backend, chatbot UI, admin system, QA, documentation &
deployment). Each phase's real output is traceable in this repository: for example, the
database phase produced the actual Drizzle schema and idempotent seed script
(`src/db/schema.ts`, `src/db/seed.ts`), not just a diagram.

## 15. Testing Methodology

Covered in full, with an explicit honesty statement about what has and has not actually been
executed, in `docs/TESTING_AND_QA.md`. In summary: Vitest unit tests for the recommendation
engine and catalog data integrity; Pytest tests for the FastAPI backend's validation, routing,
and SSE framing (with the database and AI model mocked so they run without live credentials);
Playwright end-to-end tests across four device profiles for navigation, the assessment flow,
and the admin authentication boundary. **No test suite claims a live-infrastructure pass** —
that still requires a real deployment, documented as a required next step.

## 16. Accessibility

Target: WCAG 2.2 AA. Full checklist with an honest "designed for" vs. "verified" distinction
in `docs/ACCESSIBILITY_CHECKLIST.md`. Key implemented measures: semantic landmarks, a
skip-to-content link, keyboard-operable controls throughout (Radix UI primitives for all
dialogs/accordions), `aria-live` regions for dynamic result counts, labeled form fields with
`role="alert"` error messaging, a global `:focus-visible` ring, `prefers-reduced-motion`
support, real `<table>` semantics for the comparison matrix, and pricing information that never
relies on color alone.

## 17. Security

- **Authentication:** Argon2id password hashing (OWASP-baseline parameters), opaque
  random session tokens (only their SHA-256 hash stored server-side), HttpOnly/Secure/SameSite
  cookies, 8-hour session expiry, full session invalidation on password change.
- **Authorization:** every admin route and every sensitive server action independently
  re-verifies the session against the database — the Next.js `proxy.ts` redirect is
  explicitly documented as a UX convenience only, never the real authorization boundary.
- **Brute-force protection:** per-IP-and-email login rate limiting (5 failed attempts / 15
  minutes), backed by an append-only `login_attempts` table.
- **Initial admin setup:** gated behind a private, deployment-time-only
  `ADMIN_INITIAL_SETUP_SECRET` environment variable and a database check that permanently
  closes the setup path after the first account is created.
- **Secrets:** `XAI_API_KEY` lives only in the FastAPI backend's environment; never sent to or
  reachable from the browser. The backend's network location (`FASTAPI_BACKEND_URL`) is a
  server-only Next.js env var.
- **CORS:** the FastAPI backend restricts cross-origin requests to exactly the configured
  frontend origin — never a wildcard.
- **Rate limiting & input validation:** the chat endpoint validates and caps message/history
  length (Pydantic + Zod on both sides of the proxy) and is rate-limited per IP.
- **Error handling:** no layer returns raw exception details or stack traces to the client —
  errors are logged server-side and a generic message is returned instead.
- **Audit trail:** sensitive admin actions (login, password change, resource edits/deletes,
  guide publish toggles, initial setup) are recorded in an append-only `audit_logs` table,
  deliberately excluding secrets from any logged description text.

## 18. Limitations

- No live deployment has been exercised end-to-end as of this writing — see
  `docs/TESTING_AND_QA.md` for exactly what remains to be run for real.
- The AI provider specification ambiguity (Grok vs. a differently-sourced "gpt-oss-120b")
  required a documented default choice rather than a confirmed one.
- No original student survey has been conducted; `docs/AUDIENCE_PROFILE.md`'s audience
  reasoning is explicitly marked as assumption-based pending real data.
- Accessibility work is designed-for but not yet automated-scan- or screen-reader-verified.
- The resource catalog is intentionally fixed at ten entries; scaling to a larger catalog
  would need the recommendation engine and the chatbot's system-prompt context strategy
  (currently: pass the whole catalog every time) to change, likely toward actual retrieval.
- Pricing for some resources (e.g. StayFree's in-app purchase) is not fixed/publicly listed by
  the vendor and is explicitly flagged as approximate/needing a live check rather than invented.

## 19. Future Scope

- Automated, scheduled re-verification of each resource's official pricing page, flagging
  drift for admin review rather than requiring fully manual re-checks.
- A proper screenshot pipeline for the three setup guides, replacing described steps.
- Expanding the catalog past ten resources with a retrieval strategy (rather than
  whole-catalog-in-context) once that becomes necessary.
- Multiple administrator accounts with role distinctions (e.g. a "guide editor" role separate
  from full resource/admin management).
- A real anonymous-feedback collection mechanism wired directly into the deployed app, rather
  than the current offline template in `docs/USER_FEEDBACK.md`.

## 20. Conclusion

This project delivers a working, security-conscious, accessibility-minded digital wellness
platform built on a single, honestly-verified data source shared across a guided assessment, a
comparison table, and a grounded AI chatbot — rather than three disconnected, independently
risky surfaces. Its documentation is deliberately explicit about the boundary between what has
been built and verified by design versus what still requires a live deployment to confirm,
treating that honesty as part of the deliverable rather than a gap to paper over.

## 21. References

- Google. *Digital Wellbeing.* https://wellbeing.google/
- Apple. *Screen Time.* https://support.apple.com/en-us/HT208982
- StayFree. https://stayfreeapps.com/
- Freedom. https://freedom.to/
- Cold Turkey. https://getcoldturkey.com/
- LeechBlock NG. https://www.proginosko.com/leechblock/
- Apple. *Use Focus on iPhone.* https://support.apple.com/en-us/HT212608
- uBlock Origin. https://ublockorigin.com/ and https://github.com/gorhill/uBlock/wiki
- Electronic Frontier Foundation. *Privacy Badger.* https://privacybadger.org/
- Next.js Documentation. https://nextjs.org/docs
- Tailwind CSS v4 Documentation. https://tailwindcss.com/docs
- Drizzle ORM Documentation. https://orm.drizzle.team/
- LangChain Documentation. https://python.langchain.com/
- xAI API Documentation. https://docs.x.ai/
- FastAPI Documentation. https://fastapi.tiangolo.com/
- W3C. *Web Content Accessibility Guidelines (WCAG) 2.2.* https://www.w3.org/TR/WCAG22/
- OWASP. *Password Storage Cheat Sheet* (Argon2id parameter guidance). https://cheatsheetseries.owasp.org/
