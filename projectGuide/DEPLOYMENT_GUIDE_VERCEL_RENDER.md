# Deployment Guide — Vercel + Render + Neon

This walks through deploying all three services for real. None of it can be executed from
inside this repository's own build process — you'll need accounts on Neon, Render, and Vercel.

## Overview

| Component | Where | Why |
|---|---|---|
| Next.js frontend | Vercel | First-class Next.js support, serverless-friendly |
| FastAPI backend | Render | Simple, affordable always-on Python web service with streaming support |
| PostgreSQL | Neon | Serverless Postgres, generous free tier, used by both services |

Deploy in this order: **Neon → Render (backend) → Vercel (frontend)**, because the frontend's
env vars need the backend's URL, and the backend's env vars need the database's URL.

---

## Step 1 — Neon (database)

1. Create a project at [neon.tech](https://neon.tech).
2. In the dashboard, copy the **pooled** connection string (hostname contains `-pooler`) —
   this is what both the frontend's Drizzle client and the backend's asyncpg pool should use.
   Serverless/edge-adjacent compute (Vercel functions, Render's worker processes) should not
   hold long-lived direct connections, which is exactly what the pooled endpoint is for.
3. Keep this tab open — you'll paste this string into both Render and Vercel's env vars.

You do not need to manually create tables — `npm run db:migrate` (run locally, pointed at this
same connection string) applies the Drizzle-generated migrations, and `npm run db:seed` loads
the ten resources and three guides.

```bash
# Run locally, once, pointed at your real Neon connection string
DATABASE_URL="<your neon pooled connection string>" npm run db:generate
DATABASE_URL="<your neon pooled connection string>" npm run db:migrate
DATABASE_URL="<your neon pooled connection string>" npm run db:seed
```

---

## Step 2 — Render (FastAPI backend)

1. Push this repository to GitHub (or your git host of choice).
2. In Render, create a **New Web Service**, connect the repo, and set:
   - **Root directory:** `backend`
   - **Runtime:** Python 3
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Set environment variables (Render → your service → Environment):

   | Key | Value |
   |---|---|
   | `XAI_API_KEY` | your real xAI key |
   | `XAI_MODEL` | `grok-4` (or your preferred current Grok model) |
   | `DATABASE_URL` | the Neon pooled connection string from Step 1 |
   | `FRONTEND_ORIGIN` | your Vercel URL — you won't have this yet on the first deploy; set it to a placeholder, then come back and update it after Step 3 |
   | `ENVIRONMENT` | `production` |

4. Deploy. Once live, note the service's public URL
   (`https://your-backend.onrender.com`) — you'll need it for Vercel.
5. Confirm it's healthy: `curl https://your-backend.onrender.com/api/health` should return
   `{"status": "ok", "database": "connected"}`.

> **Render free/starter tier note:** free Render web services spin down after inactivity and
> take a few seconds to wake on the next request, which will show up as a slow first chatbot
> reply. A paid instance type removes this if that matters for your deployment.

---

## Step 3 — Vercel (Next.js frontend)

1. Import the repository in Vercel. Root directory stays the repo root (not `backend`).
2. Set environment variables (Vercel → your project → Settings → Environment Variables):

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | the same Neon pooled connection string |
   | `NEXT_PUBLIC_APP_URL` | your Vercel production URL, e.g. `https://your-app.vercel.app` |
   | `FASTAPI_BACKEND_URL` | your Render backend URL from Step 2, e.g. `https://your-backend.onrender.com` (no trailing slash) |
   | `ADMIN_INITIAL_SETUP_SECRET` | a long random string, e.g. output of `openssl rand -base64 32` |

3. Deploy.
4. **Go back to Render** and update `FRONTEND_ORIGIN` to your real Vercel URL from this step,
   then redeploy the backend — until this matches exactly, the browser's requests to
   `/api/chat` (which Vercel proxies server-side to Render) will still work since that call
   never goes browser→Render directly, but it's still correct hygiene to lock CORS down to the
   real origin rather than leaving a placeholder.

---

## Step 4 — Create the first administrator

Visit `https://your-app.vercel.app/admin` directly (it is never linked from the public site).
Enter the `ADMIN_INITIAL_SETUP_SECRET` you set in Vercel, an email, and a password. This
form permanently disables itself after the first account exists — if you need a second admin
later, add them directly in Postgres (there is intentionally no public registration flow) or
extend the dashboard with an "invite admin" feature.

**After this step, consider removing `ADMIN_INITIAL_SETUP_SECRET` from Vercel's env vars.**
The setup action already refuses to run a second time regardless, but removing the secret is
good hygiene.

---

## Post-deployment checklist

- [ ] `https://your-backend.onrender.com/api/health` returns `status: "ok"`.
- [ ] `https://your-app.vercel.app` loads the landing page with no console errors.
- [ ] `/chat` streams a real response (try: *"I waste too much time on YouTube, I use Windows
      and need a free solution."*).
- [ ] `/admin/dashboard` is unreachable without logging in (try it in a private window).
- [ ] The comparison table and `/resources` show exactly ten resources.
- [ ] CORS: open the browser console on `/chat` and confirm no cross-origin errors (there
      shouldn't be any, since the browser only ever talks to same-origin `/api/chat`).

## Production hardening notes

- Rotate `ADMIN_INITIAL_SETUP_SECRET` out of the environment after first use (Step 4).
- Consider Render's paid tier if the free tier's cold-start delay is unacceptable for a live
  chatbot demo.
- Neon's free tier suspends compute after inactivity too — the first request after idle time
  will be slower while it resumes; this is normal for a free-tier demo deployment.
- Set up Neon's point-in-time restore or scheduled backups if this ever holds real user data
  beyond the current admin/resource/guide content.
