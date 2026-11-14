import { NextRequest } from "next/server";
import { z } from "zod";

/**
 * This route does NOT talk to Grok, LangChain, or xAI itself — it is a
 * thin, same-origin pass-through to the FastAPI backend's own
 * /api/chat/stream endpoint (see backend/app/api/chat.py), which is where
 * all AI orchestration actually happens, per the project's architecture
 * restriction against reimplementing that logic in a Next.js API route.
 *
 * Why it exists at all rather than having the browser call FastAPI
 * directly: FASTAPI_BACKEND_URL is a server-only env var (not
 * NEXT_PUBLIC_*), so the backend's real network location is never exposed
 * to the client, and the browser only ever needs to know about same-origin
 * `/api/chat`. CORS on the FastAPI backend remains configured for defense
 * in depth (see backend/app/main.py) in case the backend is ever called
 * directly in another deployment shape.
 */
const chatRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(50)
    .optional(),
});

export async function POST(request: NextRequest) {
  const backendUrl = process.env.FASTAPI_BACKEND_URL;
  if (!backendUrl) {
    return new Response(JSON.stringify({ error: "Chat backend is not configured." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid chat request.", details: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${backendUrl}/api/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      // No credentials/cookies are forwarded to the backend — the chat
      // endpoint is intentionally anonymous and does not need the admin
      // session, keeping the AI surface separate from the admin surface.
    });
  } catch {
    return new Response(JSON.stringify({ error: "Could not reach the chat backend. Is it running?" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(JSON.stringify({ error: "The chat backend returned an error." }), {
      status: upstream.status || 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Pass the upstream SSE stream straight through, unbuffered.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
