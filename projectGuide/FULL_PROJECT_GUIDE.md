# Full Project Guide

A complete tour of how the Digital Wellness Resource Hub is built, for anyone picking up this
codebase for the first time — a grader, a future contributor, or future-you in six months.

## 1. The core idea: one catalog, three surfaces

Three very different-looking parts of this app — the assessment, the comparison table, and
the AI chatbot — all answer from **one** resource catalog:

1. `src/data/resources.ts` is the canonical, hand-verified content (ten resources, each with
   pricing, platforms, privacy notes, limitations, and source URLs).
2. `npm run db:seed` loads that content into Neon Postgres's `resources` table, idempotently
   (upsert by stable `id`, verified to total exactly ten afterward).
3. The **frontend** reads `src/data/resources.ts` directly for fast, server-rendered pages
   (the assessment and comparison pages don't need a database round-trip for static content
   that only changes when an admin edits it — and the admin dashboard writes through Drizzle
   to the same table).
4. The **backend** (FastAPI) reads the *same Postgres table* via `asyncpg` on every chat
   request (`backend/app/services/resource_service.py`) — it has no separate hardcoded list.
   This is what the project brief calls "the chatbot and website must use the same ten-resource
   database" — literally true here, not just true in spirit.

If you edit a resource from the admin dashboard, the database changes immediately; the
chatbot's very next answer reflects it (it re-queries Postgres on every request rather than
caching). `src/data/resources.ts` stays in sync with the database only through the seed
script — if you want a permanent change, edit the data file *and* re-seed, or edit live via
the dashboard and treat the data file as the "factory reset" source of truth.

## 2. Frontend tour

### Design system (`src/app/globals.css`)

Tailwind v4's CSS-first configuration means there is no `tailwind.config.js`. Every design
token (`--background`, `--primary`, `--accent`, etc.) is a real CSS custom property, redefined
per theme under `:root[data-theme="sanctuary"]` and `:root[data-theme="warm"]`, then exposed
to Tailwind's utility generator via a single `@theme inline` block. Every component is written
against semantic classes (`bg-background`, `text-foreground`, `border-border`) rather than raw
hex values, so all three themes "just work" without per-component conditionals.

### No-flash theming (`src/components/settings/theme-provider.tsx`)

A small, inlined `<script>` runs in `<head>` (see `app/layout.tsx`) **before** React hydrates,
reading `localStorage` and setting `data-theme` on `<html>` synchronously. This is the standard
fix for "flash of wrong theme," which a React-only solution cannot prevent because React
doesn't run until after the first paint.

### Recommendation engine (`src/lib/recommendations/engine.ts`)

A deliberately plain, readable scoring function — not a black box, and not a database query.
It:
1. Maps the chosen problem to relevant catalog categories.
2. Scores every candidate resource on device compatibility and budget fit.
3. **Never silently drops an incompatible resource** — it's scored down, and if it's still
   shown, its specific incompatibility is listed in plain language (see the
   `incompatibilities` field threaded through to the assessment UI).

### Admin auth (`src/lib/auth/`)

- `password.ts` — Argon2id hashing via `@node-rs/argon2`, OWASP-baseline parameters.
- `session.ts` — creates an opaque random session token, stores only its SHA-256 hash in
  Postgres, sets it as an HttpOnly/Secure/SameSite=Lax cookie. `getCurrentAdmin()` is the
  single source of truth for "is this request authenticated," called by the dashboard layout
  *and* by every sensitive server action independently.
- `rate-limit.ts` — brute-force protection keyed on IP+email, backed by the `login_attempts`
  table.
- `audit.ts` — append-only logging of sensitive actions, written to carefully never include
  passwords or tokens in free-text descriptions.

`src/proxy.ts` (Next.js 16's replacement for `middleware.ts`) redirects an obviously
unauthenticated browser away from `/admin/dashboard` *before* a full server render — but it
only checks cookie *presence*, not validity, and is explicitly documented (in both the proxy
file and the dashboard layout) as a UX nicety, never the real authorization boundary.

### Chatbot UI (`src/components/chatbot/`)

`chat-shell.tsx` is the orchestrator: it owns conversation state (in-memory only — nothing
persisted, per the project's privacy-conscious data policy), implements the SSE parser, and
renders the responsive sidebar/welcome-screen/composer layout described in the project's
reference screenshot. The wire protocol is documented identically in both
`chat-shell.tsx` and `backend/app/ai/streaming.py` — if you change one, change the other.

## 3. Backend tour

### Why no LangGraph

The project brief allows LangGraph "where justified." This chatbot's job — load the ten-item
catalog, build a system prompt, call the model, stream the response — is a single linear LLM
call. A graph would add indirection without solving a problem this app actually has, so
`backend/app/ai/agent.py` is a plain async function, not a graph. If a future version adds
multi-step tool use (e.g., searching the web for a resource not yet in the catalog, then a
human review step before adding it), LangGraph would become justified there.

### The Grok / gpt-oss-120b note

Read the top of `backend/app/ai/model.py`. The original brief names "Grok through LangChain
ChatXAI" and, separately, a model called `gpt-oss-120b` — these point at two different AI
providers (xAI vs. Groq). The backend is wired to real xAI Grok models by default, with the
three-line swap to Groq documented inline, so this doesn't block a working deployment either
way.

### Streaming (`backend/app/ai/streaming.py`, `backend/app/api/chat.py`)

The backend exposes raw SSE. The Next.js frontend does **not** call this directly from the
browser — `src/app/api/chat/route.ts` is a thin same-origin pass-through (the browser only
ever knows about `/api/chat`; `FASTAPI_BACKEND_URL` is a server-only env var). This keeps the
backend's real network location private and sidesteps CORS for the common case, while CORS is
still configured on the backend (`backend/app/core/security.py`) for defense in depth.

### Error handling

Every layer fails closed without leaking internals:
- `backend/app/ai/streaming.py` catches any exception from the model call and emits a generic
  `{"error": "..."}` SSE event — the real exception is logged server-side only.
- `backend/app/main.py`'s global exception handler does the same for any route.
- The Next.js proxy route (`src/app/api/chat/route.ts`) returns a generic message if the
  backend is unreachable at all.

## 4. Database tour

See `src/db/schema.ts` for the full, commented Drizzle schema. Six tables:
`resources`, `resource_sources` (verification register), `guides`, `admin_users`,
`admin_sessions`, `audit_logs`, plus `login_attempts` for rate limiting. Every table uses
Postgres-native types appropriately (`jsonb` for platform/limitation lists, `pgEnum` for
category/pricing, indexed foreign keys with `onDelete` behavior chosen per relationship).

## 5. What to read first if you're grading this

1. `src/data/resources.ts` — the actual verified content, with inline sourcing notes.
2. `src/lib/recommendations/engine.ts` — the recommendation logic.
3. `src/lib/auth/session.ts` + `src/app/admin/dashboard/layout.tsx` — the security model.
4. `backend/app/ai/agent.py` + `backend/app/ai/prompts.py` — how the chatbot is grounded in
   the catalog and constrained from inventing products.
5. `docs/PROJECT_REPORT.md` — the full academic write-up.
