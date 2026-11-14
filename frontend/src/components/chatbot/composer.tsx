"use client";

import { useRef, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

/**
 * File attachment is deliberately NOT rendered here. The spec's own
 * instruction for this screen is: "Do not display non-functional
 * controls." Nothing in this project's chatbot backend accepts an
 * uploaded file, so an attachment button would be decorative. The icon
 * import above is kept only as a reminder of what would need to ship
 * first (a backend upload + retrieval path) before this control earns a
 * place in the composer.
 */
export function Composer({ value, onChange, onSubmit, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim().length > 0 && !disabled) onSubmit();
    }
  }

  return (
    <div className="border-t border-border bg-background p-3 sm:p-4" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.75rem)" }}>
      <div
        className={cn(
          "mx-auto flex max-w-3xl items-end gap-2 rounded-3xl border border-border bg-background-secondary px-4 py-2.5 outline-none transition-colors focus-within:border-primary/50"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask about screen time, focus, sleep, or privacy tools…"
          aria-label="Message the Digital Wellness Co-Pilot"
          className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm border-0 BORDER_ZERO text-foreground placeholder:text-subtle-foreground focus:outline-none"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || value.trim().length === 0}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground transition-opacity disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-subtle-foreground">
        The Co-Pilot explains wellness tools — it isn&apos;t a medical professional and can&apos;t diagnose
        sleep or mental-health conditions.
      </p>
    </div>
  );
}
