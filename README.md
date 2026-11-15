# Digital Wellness Resource Hub

**An AI-powered digital wellness platform for university students.**

Discover, compare, and configure digital wellness tools for screen-time management, doomscrolling, sleep, focus, notification overload, and online privacy.

Built with **Next.js 16, React 19, TypeScript, FastAPI, LangChain, Groq, and Neon PostgreSQL**.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white" alt="Python 3.12" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/AI-Groq-F55036?logo=groq&logoColor=white" alt="Groq" />
  <img src="https://img.shields.io/badge/LangChain-AI%20Orchestration-1C3C3C?logo=langchain&logoColor=white" alt="LangChain" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Package%20Manager-pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/Python%20Tooling-uv-DE5FE9?logo=astral&logoColor=white" alt="uv" />
</p>

---
----

### LIVE-DEMO: https://digital-wellness-project.vercel.app/ 

---
---

## Overview

Digital Wellness Resource Hub is a full-stack web application designed to help university students make informed decisions about their digital habits.

Instead of presenting users with an unstructured list of applications, the platform provides a centralized experience for discovering, evaluating, comparing, and configuring digital wellness resources.

The platform combines a curated resource catalog, guided wellness assessment, practical setup documentation, and an AI-powered chatbot.

**Core principle:** Every part of the application uses the same database-backed resource catalog, ensuring that recommendations and resource information remain consistent.

| Project Attribute | Description |
|---|---|
| Project | Digital Wellness Resource Hub |
| Category | Full-Stack Web Application |
| Domain | Digital Wellness / Artificial Intelligence |
| Frontend | Next.js 16, React 19, TypeScript |
| Backend | Python 3.12, FastAPI |
| AI Integration | LangChain + Groq |
| Database | Neon Serverless PostgreSQL |
| ORM | Drizzle ORM |
| Frontend Package Manager | pnpm |
| Python Package Manager | uv |
| Deployment | Vercel + Render + Neon |
| Resource Catalog | Exactly 10 verified resources |

## Problem Statement

Most digital wellness resource directories either provide lists without explaining their limitations or promote individual paid products without meaningful comparisons.

Students often struggle to determine:

- Whether a tool supports their device or operating system.
- Whether a resource is genuinely free or has paid limitations.
- How a tool handles personal data and privacy.
- Which resource is appropriate for their particular digital habits.
- How to configure the selected tool correctly.

This project addresses these challenges through a centralized platform that combines resource discovery, comparison, personalized recommendations, setup guides, and AI assistance.

## Key Features

| Feature | Description |
|---|---|
| Interactive Wellness Assessment | Evaluates a user's selected problem, optional device, and budget to generate 2–3 explained recommendations. |
| Resource Discovery | Searchable and filterable catalog containing exactly 10 independently verified resources. |
| Resource Comparison | Sortable comparison matrix to evaluate available resources. |
| Setup Guides | Three practical guides covering screen-time management, bedtime routines, and tracker/website blocking. |
| AI Digital Wellness Co-Pilot | Streaming conversational assistant powered by FastAPI, LangChain, and Groq. |
| Database-Backed Recommendations | Chatbot recommendations are retrieved from the same PostgreSQL catalog used by the website. |
| Theme System | Purple Midnight, Sanctuary, and Warm Minimalist themes. |
| Private Admin Dashboard | Resource and guide management, source verification, and audit history. |
| Accessibility | WCAG 2.2 AA accessibility target and responsive layouts. |
| Automated Testing | Frontend unit tests, browser-based end-to-end tests, and backend tests. |

### Interactive Wellness Assessment

Users can select a digital wellness concern and optionally specify their device and budget.

The recommendation engine returns a small set of relevant resources with explanations and appropriate caveats.

### Resource Discovery and Comparison

The platform provides a searchable and filterable catalog of ten resources.

A comparison matrix allows users to evaluate available options rather than relying on a single recommendation.

### Guided Setup Documentation

| Guide | Purpose |
|---|---|
| Screen-Time Management | Configure tools and settings to manage screen usage. |
| Bedtime Routine | Configure a healthier digital routine before sleep. |
| Tracker / Website Blocking | Configure website and tracker blocking tools. |

The guides include practical troubleshooting notes and platform-specific considerations.

### AI Digital Wellness Co-Pilot

The chatbot provides conversational assistance and resource recommendations using the same database-backed catalog as the main application.

| Component | Responsibility |
|---|---|
| Next.js Route Handler | Receives frontend chat requests and forwards the streaming response. |
| FastAPI | Handles backend chat requests and application logic. |
| LangChain | Coordinates the AI model integration. |
| Groq | Provides hosted LLM inference. |
| ChatGroq | LangChain integration for Groq models. |
| PostgreSQL | Supplies the shared resource catalog. |
| Server-Sent Events (SSE) | Streams responses to the frontend. |

### Theme System

| Theme | Description |
|---|---|
| Purple Midnight | Default theme. |
| Sanctuary | Calm, wellness-oriented visual theme. |
| Warm Minimalist | Warm, minimal visual theme. |

Themes use Tailwind CSS v4's CSS-first token system and persist per browser.

### Private Administration

The application includes a private administration dashboard for managing resources and guides.

Administrative functionality includes:

- Resource and guide management.
- Source verification.
- Audit history.
- Argon2id password hashing.
- Server-verified sessions.
- Protected administrative operations.

The admin dashboard is not linked from the public interface.

---

## Platform Architecture

The application follows a three-part architecture:

1. **Frontend:** Next.js handles the user interface, server components, server actions, and chat request proxy.
2. **Backend:** FastAPI handles AI orchestration, chat processing, and database access for the chatbot.
3. **Database:** Neon PostgreSQL provides the shared source of truth for resources, guides, and administrative data.

### Architecture Overview

| Layer | Component | Responsibility |
|---|---|---|
| Client | Browser | Displays the application and handles user interaction. |
| Frontend | Next.js App Router | Renders pages and manages application functionality. |
| Frontend API | Next.js Route Handler | Provides a thin Server-Sent Events pass-through for chat requests. |
| Data Access | Drizzle ORM | Manages frontend database operations. |
| Backend API | FastAPI | Processes chatbot requests and backend operations. |
| AI Orchestration | LangChain | Coordinates language model interactions. |
| Model Integration | ChatGroq | Connects LangChain to Groq inference. |
| AI Inference | Groq | Generates conversational responses using the configured model. |
| Backend Database Access | asyncpg | Provides asynchronous PostgreSQL access. |
| Database | Neon PostgreSQL | Stores the shared resource catalog, guides, admin data, and audit logs. |

### Request Flow

**Standard application operations**

Browser → Next.js App Router → Server Components / Server Actions → Drizzle ORM → Neon PostgreSQL

**AI chatbot operations**

Browser → `POST /api/chat` → Next.js Route Handler → `POST /api/chat/stream` → FastAPI → LangChain → ChatGroq → Groq

The FastAPI backend also queries Neon PostgreSQL through `asyncpg` when it needs resource information.

### Single Source of Truth

The frontend and AI backend use the same PostgreSQL resource catalog.

| Component | Resource Source |
|---|---|
| Resource discovery | Neon PostgreSQL |
| Resource comparison | Neon PostgreSQL |
| Wellness recommendations | Database-backed catalog |
| AI chatbot | Neon PostgreSQL through FastAPI |
| Initial resource content | `src/data/resources.ts` |

The canonical resource content is maintained in `src/data/resources.ts` and loaded into PostgreSQL through the seed script.

The FastAPI backend queries the database directly instead of maintaining a separate hardcoded resource catalog.

This avoids maintaining duplicate resource datasets across the frontend and backend.

---

## Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Frontend Framework | Next.js 16 | Full-stack React application and App Router. |
| UI Library | React 19 | Component-based user interface. |
| Programming Language | TypeScript | Type-safe frontend development. |
| Styling | Tailwind CSS v4 | CSS-first styling and design tokens. |
| UI Components | shadcn/ui-style + Radix UI | Accessible interface primitives. |
| Animation | Framer Motion | Interface animations and transitions. |
| Icons | Lucide React | Consistent icon system. |
| Frontend Validation | Zod | Runtime validation of frontend data. |
| Frontend Package Manager | pnpm | Dependency installation and scripts. |
| Backend Language | Python 3.12 | Backend application development. |
| Backend Framework | FastAPI | API endpoints and asynchronous backend processing. |
| Python Package Manager | uv | Python dependency and environment management. |
| AI Orchestration | LangChain | Language model integration. |
| Model Integration | langchain-groq | LangChain integration for Groq. |
| AI Provider | Groq | Hosted LLM inference. |
| Backend Validation | Pydantic | Request and data validation. |
| Database | Neon PostgreSQL | Serverless relational database. |
| ORM | Drizzle ORM | Type-safe database queries and schema management. |
| Database Migrations | Drizzle Kit | SQL migration generation and management. |
| Authentication | Argon2id | Password hashing. |
| Session Management | Server-side sessions | Secure administrative authentication. |
| Frontend Unit Testing | Vitest | Unit and component testing. |
| Component Testing | Testing Library | UI behavior testing. |
| End-to-End Testing | Playwright | Browser-based application testing. |
| Backend Testing | Pytest | Python backend testing. |
| Frontend Hosting | Vercel | Next.js deployment. |
| Backend Hosting | Render | FastAPI deployment. |
| Database Hosting | Neon | PostgreSQL hosting. |

---

## Project Structure

```text
digital-wellness-hub/
│
├── src/
│   ├── app/                     # Next.js App Router routes
│   ├── components/              # UI, layout, chatbot, admin, settings
│   ├── data/                    # Canonical resource and guide content
│   ├── db/                      # Drizzle schema, client, seed script
│   ├── lib/                     # Recommendation engine, auth, utilities
│   └── proxy.ts                 # Next.js 16 proxy
│
├── backend/
│   ├── app/
│   │   ├── api/                 # API endpoints
│   │   ├── ai/                  # LangChain and Groq integration
│   │   ├── services/            # Backend services
│   │   ├── schemas/             # Pydantic schemas
│   │   └── core/                # Core backend configuration
│   │
│   ├── tests/                   # Backend tests
│   ├── pyproject.toml           # Python project configuration
│   └── uv.lock                  # Python dependency lockfile
│
├── drizzle/                     # Generated SQL migrations
├── docs/                        # Project documentation
├── tests/                       # Frontend unit and E2E tests
│
├── pnpm-lock.yaml
├── package.json
├── playwright.config.ts
├── .env.example
└── README.md
```

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

| Requirement | Version / Account |
|---|---|
| Node.js | 20.9 or higher |
| pnpm | Compatible with the project lockfile |
| Python | 3.12 or higher |
| uv | Latest stable release |
| PostgreSQL | Neon account |
| AI Provider | Groq API key |

You will need:

- A [Neon](https://neon.tech) account.
- A [Groq Console](https://console.groq.com) account and API key.
- Node.js and pnpm.
- Python and uv.

### 1. Clone the Repository

```bash
git clone https://github.com/adidongre006/digitalWellness-project.git
cd digital-wellness-project
```

### 2. Install Frontend Dependencies

Enable pnpm through Corepack if required:

```bash
corepack enable
```

Install the project dependencies:

```bash
pnpm install
```

Create the frontend environment file:

```bash
cp .env.example .env.local
```

Configure the required environment variables before continuing.

### 3. Configure the Database

1. Create a PostgreSQL project in Neon.
2. Copy the pooled PostgreSQL connection string.
3. Configure `DATABASE_URL` in the frontend and backend environment files.
4. Generate and apply database migrations.

```bash
pnpm run db:generate
pnpm run db:migrate
pnpm run db:seed
```

The seed command loads the ten resources and three guides into the database.

### 4. Configure the FastAPI Backend

Open a separate terminal:

```bash
cd backend
```

Install the Python dependencies and synchronize the environment:

```bash
uv sync
```

Create the backend environment file:

```bash
cp .env.example .env
```

Configure the database connection and Groq API key.

Start the backend:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

### 5. Start the Frontend

Open another terminal in the project root:

```bash
pnpm dev
```

Open the application:

```text
http://localhost:3000
```

The frontend and backend must both be running for the AI chatbot to work locally.

### 6. Create the First Administrator

Navigate directly to:

```text
http://localhost:3000/admin
```

The initial setup form is available only when no administrator account exists.

Provide:

- The `ADMIN_PASSWORD` configured in `.env.local`.
- An administrator email address.
- A password containing at least 12 characters.

After the first administrator is created, the initial setup form permanently disables itself.

---

## Environment Configuration

Never commit actual API keys, database credentials, or administrator secrets to GitHub.

### Frontend Environment

Configure the following in `.env.local`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Pooled Neon PostgreSQL connection string. |
| `FASTAPI_BACKEND_URL` | Base URL of the FastAPI backend. |
| `ADMIN_INITIAL_SETUP_SECRET` | Secret used for initial administrator setup. |

### Backend Environment

Configure the Groq and database settings in `backend/.env`.

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string. |
| `GROQ_API_KEY` | API key generated from the Groq Console. |
| `GROQ_MODEL` | Groq-supported model identifier configured by the backend. |

Use the exact variable names defined in the backend's `.env.example` and application settings if they differ from these conventional names.

---

## Database Management

The project uses Drizzle ORM and Neon PostgreSQL.

### Database Commands

| Command | Purpose |
|---|---|
| `pnpm run db:generate` | Generate SQL migrations from the Drizzle schema. |
| `pnpm run db:migrate` | Apply migrations to the database. |
| `pnpm run db:seed` | Load the canonical resources and setup guides. |

### Resource Seeding Strategy

The resource catalog is maintained in:

```text
src/data/resources.ts
```

The seed script is designed to be idempotent.

| Property | Implementation |
|---|---|
| Canonical content | `src/data/resources.ts` |
| Database | Neon PostgreSQL |
| Seeding strategy | Upsert using stable resource IDs |
| Duplicate prevention | Repeated seeding does not create duplicate resources |
| Resource count | Exactly 10 |
| Validation | Seed script verifies the final resource count |

**Important:** Update the canonical TypeScript resource data and rerun the seed script instead of manually editing resource records in Neon.

---

## AI Chatbot

The AI assistant uses a separate FastAPI backend integrated with LangChain and Groq.

### AI Integration Stack

| Component | Technology | Responsibility |
|---|---|---|
| Backend API | FastAPI | Handles chatbot requests. |
| AI Framework | LangChain | Coordinates prompts and model interactions. |
| LangChain Integration | `langchain-groq` | Provides the `ChatGroq` model interface. |
| Inference Provider | Groq | Provides hosted LLM inference. |
| Database | Neon PostgreSQL | Supplies the shared resource catalog. |
| Streaming | Server-Sent Events | Delivers generated responses incrementally. |

### AI Request Lifecycle

| Step | Operation |
|---|---|
| 1 | User submits a message through the frontend. |
| 2 | Next.js receives the request through `/api/chat`. |
| 3 | The route handler forwards the request to the FastAPI backend. |
| 4 | FastAPI processes the request and retrieves relevant resource information from PostgreSQL. |
| 5 | LangChain coordinates the model interaction through `ChatGroq`. |
| 6 | Groq generates the response using the configured model. |
| 7 | The response streams back to the frontend using SSE. |

### Groq Configuration

Generate an API key from the [Groq Console](https://console.groq.com).

Example configuration:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_supported_groq_model
```

The model identifier must be supported by Groq and match the backend configuration.

The API key must remain exclusively on the backend. Never expose it through a `NEXT_PUBLIC_` environment variable.

---

## Testing

The project uses separate testing tools for the frontend, browser interactions, and backend.

### Frontend Unit Tests

```bash
pnpm test
```

### Backend Tests

From the `backend/` directory:

```bash
uv run pytest
```

### End-to-End Tests

```bash
pnpm test:e2e
```

The end-to-end suite requires the application and its backend dependencies to be available, or the configured Playwright `webServer` setup to start them.

| Testing Layer | Tool | Purpose |
|---|---|---|
| Frontend Unit Tests | Vitest | Test frontend logic and components. |
| Component Tests | Testing Library | Verify component behavior. |
| Browser E2E Tests | Playwright | Test complete application workflows. |
| Backend Tests | Pytest | Test FastAPI backend functionality. |

See [`docs/TESTING_AND_QA.md`](./docs/TESTING_AND_QA.md) for the testing and QA documentation, including what has and has not actually been executed.

---

## Security

Security is considered across authentication, session management, API access, and backend configuration.

| Security Area | Implementation |
|---|---|
| Password Storage | Argon2id password hashing using `@node-rs/argon2`. |
| Session Tokens | Opaque, randomly generated session tokens. |
| Session Storage | Only SHA-256 hashes of session tokens are stored server-side. |
| Authorization | Sensitive admin operations verify sessions against the database. |
| Initial Admin Setup | One-time setup protected by `ADMIN_INITIAL_SETUP_SECRET`. |
| Login Rate Limiting | 5 failed attempts per IP/email pair within 15 minutes. |
| Chat Rate Limiting | Per-IP rate limiting using `slowapi`. |
| Request Validation | Message and conversation history length validation. |
| API Secrets | Groq API key remains on the FastAPI backend. |
| CORS | Restricted to the configured frontend origin. |
| Error Handling | Raw exceptions and stack traces are not returned to clients. |

### Authorization Boundary

The Next.js proxy provides a lightweight redirect experience, but it is not the application's authorization boundary.

Every sensitive server action and administrative route independently verifies the administrator session against the database.

Authorization is enforced server-side rather than relying only on frontend visibility or navigation restrictions.

---

## Deployment

The application uses separate hosting services for its frontend, backend, and database.

| Service | Platform | Responsibility |
|---|---|---|
| Frontend | Vercel | Next.js application hosting. |
| Backend | Render | FastAPI application hosting. |
| Database | Neon | PostgreSQL database hosting. |
| AI Inference | Groq | Hosted language model inference. |

### Deployment Documentation

For the complete deployment procedure, including environment configuration and hosting setup, refer to:

[`DEPLOYMENT_GUIDE_VERCEL_RENDER.md`](./DEPLOYMENT_GUIDE_VERCEL_RENDER.md)

---

## Future Improvements

| Area | Planned Improvement |
|---|---|
| Retrieval | Introduce vector-based retrieval if the resource catalog grows beyond what comfortably fits in a system prompt. |
| Setup Guides | Add real screenshots to the setup guides. |
| Administration | Improve resource replacement workflows while preserving the fixed catalog size of ten. |
| Verification | Automate nightly checks against official resource pricing pages. |

---

## Documentation

| Document | Description |
|---|---|
| [`README.md`](./README.md) | Project overview, architecture, and setup. |
| [`docs/TESTING_AND_QA.md`](./docs/TESTING_AND_QA.md) | Testing and quality assurance documentation. |
| [`docs/SETUP_GUIDES.md`](./docs/SETUP_GUIDES.md) | Setup guide documentation and content policy. |
| [`DEPLOYMENT_GUIDE_VERCEL_RENDER.md`](./DEPLOYMENT_GUIDE_VERCEL_RENDER.md) | Vercel, Render, and Neon deployment instructions. |

---

## License

This project is licensed under the MIT License.

See [`LICENSE`](./LICENSE) for details.

---

## Disclaimer

This is an academic software engineering project. Resource availability, pricing, supported platforms, and privacy policies can change over time.

Always verify current information using each resource's official website before relying on the catalog.

---

**Built to help students make more informed decisions about their digital well-being.**