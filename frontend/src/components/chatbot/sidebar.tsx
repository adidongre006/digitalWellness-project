"use client";

import { HelpCircle, MessageSquarePlus, Settings, Sparkles, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "./types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

export function ChatSidebar({ conversations, activeId, onSelect, onNewChat, onDelete, open, onClose }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}
      <aside
        className={cn(
          "z-40 flex h-full w-72 shrink-0 flex-col border-r border-border bg-sidebar transition-transform",
          "fixed inset-y-0 left-0 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Conversation history"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 font-display text-sm font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" aria-hidden="true" />
            </span>
            Wellness Co-Pilot
          </div>
          <button className="text-subtle-foreground hover:text-foreground lg:hidden" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="px-3">
          <button
            onClick={onNewChat}
            className="flex w-full items-center gap-2 rounded-xl border border-border bg-background-secondary px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary/50"
          >
            <MessageSquarePlus className="h-4 w-4" aria-hidden="true" /> New chat
          </button>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto px-3" aria-label="Recent conversations">
          <p className="px-1 py-2 text-xs font-medium uppercase tracking-wide text-subtle-foreground">Recent</p>
          <ul className="flex flex-col gap-1">
            {conversations.length === 0 && (
              <li className="px-1 py-2 text-xs text-subtle-foreground">No conversations yet.</li>
            )}
            {conversations.map((c) => (
              <li key={c.id} className="group relative">
                <button
                  onClick={() => onSelect(c.id)}
                  className={cn(
                    "block w-full truncate rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-background-secondary",
                    activeId === c.id && "bg-background-secondary text-foreground"
                  )}
                >
                  {c.title}
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  aria-label={`Delete conversation: ${c.title}`}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-subtle-foreground opacity-0 hover:text-error group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border px-3 py-3">
          <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-background-secondary">
            <Settings className="h-4 w-4" aria-hidden="true" /> Settings
          </button>
          <a
            href="/about"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-background-secondary"
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" /> Help &amp; about
          </a>
        </div>
      </aside>
    </>
  );
}
