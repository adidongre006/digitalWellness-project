"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, RotateCcw, Sparkles, TriangleAlert, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./types";

export function MessageBubble({ message, onRetry }: { message: ChatMessage; onRetry?: () => void }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function handleCopy() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-background-secondary" : "bg-gradient-to-br from-primary to-accent"
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4 text-foreground" /> : <Sparkles className="h-4 w-4 text-primary-foreground" />}
      </span>

      <div className={cn("flex max-w-[85%] flex-col gap-1.5 sm:max-w-[75%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser ? "rounded-tr-sm bg-primary/15 text-foreground" : "rounded-tl-sm bg-card text-foreground",
            message.error && "border border-error/40 bg-error/10"
          )}
        >
          {message.error ? (
            <span className="flex items-center gap-2 text-error">
              <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" /> {message.content}
            </span>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content || "…"}</ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && message.content && (
          <div className="flex items-center gap-2 px-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-subtle-foreground hover:text-foreground"
              aria-label="Copy response"
            >
              {copied ? <Check className="h-3 w-3" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {onRetry && (
              <button onClick={onRetry} className="flex items-center gap-1 text-xs text-subtle-foreground hover:text-foreground">
                <RotateCcw className="h-3 w-3" aria-hidden="true" /> Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
