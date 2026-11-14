"use client";

import { Compass, Moon, ShieldCheck } from "lucide-react";

const SUGGESTIONS = [
  {
    icon: Compass,
    title: "Find My Focus Tools",
    prompt: "I keep getting distracted while studying. What focus tools would you recommend?",
  },
  {
    icon: Moon,
    title: "Improve My Sleep Routine",
    prompt: "My phone is ruining my sleep. How can I set up a better bedtime routine?",
  },
  {
    icon: ShieldCheck,
    title: "Protect My Online Privacy",
    prompt: "I want to block trackers and ads while I browse. What do you recommend, and is it free?",
  },
] as const;

export function SuggestionCards({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
      {SUGGESTIONS.map((s) => (
        <button
          key={s.title}
          onClick={() => onPick(s.prompt)}
          className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-accent-soft">
            <s.icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium">{s.title}</span>
          <span className="text-xs text-muted-foreground">{s.prompt}</span>
        </button>
      ))}
    </div>
  );
}
