"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import { nanoid } from "nanoid";
import { ChatSidebar } from "./sidebar";
import { SuggestionCards } from "./suggestion-cards";
import { Composer } from "./composer";
import { MessageBubble } from "./message-bubble";
import type { ChatMessage, Conversation } from "./types";

/**
 * Conversations live only in React state for this browser tab — nothing is
 * written to localStorage or a database, per the project's "avoid
 * unnecessarily storing conversations" privacy guidance. Reloading the page
 * clears history; that is intentional, not a bug.
 */
function newConversation(): Conversation {
  return { id: nanoid(10), title: "New chat", messages: [], createdAt: Date.now() };
}

/**
 * SSE wire protocol (matches backend/app/ai/streaming.py exactly):
 *   data: {"delta": "next chunk of text"}\n\n   — zero or more
 *   data: {"done": true}\n\n                    — exactly one, on success
 *   data: {"error": "human-readable message"}\n\n — instead of "done", on failure
 */
async function streamChatResponse(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
  onDelta: (text: string) => void,
  signal: AbortSignal
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
    signal,
  });

  if (!res.ok || !res.body) {
    const body = await res.json().catch(() => null);
    return { ok: false, error: body?.error ?? `The assistant is unavailable right now (HTTP ${res.status}).` };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const rawEvent of events) {
      const line = rawEvent.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      const jsonStr = line.slice(5).trim();
      try {
        const parsed = JSON.parse(jsonStr);
        if (typeof parsed.delta === "string") onDelta(parsed.delta);
        if (parsed.error) return { ok: false, error: parsed.error };
        if (parsed.done) return { ok: true };
      } catch {
        // Ignore malformed keep-alive lines rather than crashing the stream.
      }
    }
  }

  return { ok: true };
}

export function ChatShell() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages]);

  const handleNewChat = useCallback(() => {
    const conv = newConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setSidebarOpen(false);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId]
  );

  const send = useCallback(
    async (text: string, retryOfId?: string) => {
      if (!text.trim() || streaming) return;

      let conv = active;
      if (!conv) {
        conv = newConversation();
        setConversations((prev) => [conv!, ...prev]);
        setActiveId(conv.id);
      }

      const history = conv.messages
        .filter((m) => !m.error)
        .map((m) => ({ role: m.role, content: m.content }));

      const userMsg: ChatMessage = { id: nanoid(8), role: "user", content: text };
      const assistantId = nanoid(8);
      const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "" };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conv!.id
            ? {
                ...c,
                title: c.messages.length === 0 ? text.slice(0, 48) : c.title,
                messages: retryOfId
                  ? c.messages.filter((m) => m.id !== retryOfId).concat(assistantMsg)
                  : [...c.messages, userMsg, assistantMsg],
              }
            : c
        )
      );

      setInput("");
      setStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      const updateAssistant = (updater: (prev: ChatMessage) => ChatMessage) => {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conv!.id
              ? { ...c, messages: c.messages.map((m) => (m.id === assistantId ? updater(m) : m)) }
              : c
          )
        );
      };

      try {
        const result = await streamChatResponse(
          text,
          history,
          (delta) => updateAssistant((m) => ({ ...m, content: m.content + delta })),
          controller.signal
        );
        if (!result.ok) {
          updateAssistant((m) => ({ ...m, content: result.error, error: true }));
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          updateAssistant((m) => ({
            ...m,
            content: "Something interrupted that response. Please try again.",
            error: true,
          }));
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [active, streaming]
  );

  function handleRetry(assistantId: string) {
    if (!active) return;
    const idx = active.messages.findIndex((m) => m.id === assistantId);
    const userMsg = idx > 0 ? active.messages[idx - 1] : null;
    if (userMsg && userMsg.role === "user") send(userMsg.content, assistantId);
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setSidebarOpen(false);
        }}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open conversation history" className="text-foreground">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="text-sm font-medium">{active?.title ?? "Wellness Co-Pilot"}</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
          {!active || active.messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-semibold">Welcome to your Digital Wellness Co-Pilot</h1>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Discover healthier digital habits. Ask questions, explore trusted tools, and build a more
                  focused digital lifestyle.
                </p>
              </div>
              <SuggestionCards onPick={(prompt) => send(prompt)} />
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {active.messages.map((m) => (
                <MessageBubble key={m.id} message={m} onRetry={m.role === "assistant" && m.error ? () => handleRetry(m.id) : undefined} />
              ))}
            </div>
          )}
        </div>

        <Composer value={input} onChange={setInput} onSubmit={() => send(input)} disabled={streaming} />
      </div>
    </div>
  );
}
