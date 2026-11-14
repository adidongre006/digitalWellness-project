"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Moon, RotateCcw, ScanEye, ShieldCheck, Timer, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  recommend,
  PROBLEM_LABELS,
  type Problem,
  type DeviceAnswer,
  type BudgetAnswer,
} from "@/lib/recommendations/engine";
import { CATEGORY_LABELS } from "@/data/resources";
import { cn } from "@/lib/utils";

const PROBLEM_ICONS: Record<Problem, typeof ScanEye> = {
  doomscrolling: ScanEye,
  sleep: Moon,
  concentration: Timer,
  privacy: ShieldCheck,
};

const DEVICES: DeviceAnswer[] = ["Android", "iOS", "Windows", "macOS", "Linux"];
const BUDGETS: { id: BudgetAnswer; label: string }[] = [
  { id: "free-only", label: "Free only" },
  { id: "freemium-ok", label: "Freemium acceptable" },
  { id: "paid-ok", label: "Paid acceptable" },
];

function AssessmentInner() {
  const searchParams = useSearchParams();
  const initialProblem = searchParams.get("problem") as Problem | null;

  const [problem, setProblem] = useState<Problem | null>(initialProblem);
  const [device, setDevice] = useState<DeviceAnswer | undefined>(undefined);
  const [budget, setBudget] = useState<BudgetAnswer | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    if (!problem || !submitted) return [];
    return recommend({ problem, device, budget });
  }, [problem, device, budget, submitted]);

  function reset() {
    setProblem(null);
    setDevice(undefined);
    setBudget(undefined);
    setSubmitted(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">What is affecting your digital wellbeing?</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pick the option that fits best. Adding your device and budget narrows the recommendation further — both
        are optional.
      </p>

      {/* Step 1: problem */}
      <fieldset className="mt-10">
        <legend className="text-sm font-semibold text-foreground">1. Choose your main concern</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(Object.keys(PROBLEM_LABELS) as Problem[]).map((key) => {
            const Icon = PROBLEM_ICONS[key];
            const active = problem === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setProblem(key);
                  setSubmitted(false);
                }}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                  active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-accent-soft">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium">{PROBLEM_LABELS[key]}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Step 2: device (optional) */}
      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-foreground">2. Your device (optional)</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {DEVICES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(device === d ? undefined : d)}
              aria-pressed={device === d}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                device === d ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Step 3: budget (optional) */}
      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-foreground">3. Your budget (optional)</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBudget(budget === b.id ? undefined : b.id)}
              aria-pressed={budget === b.id}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                budget === b.id ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-10 flex gap-3">
        <Button disabled={!problem} onClick={() => setSubmitted(true)}>
          Get my recommendations <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="secondary" onClick={reset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
        </Button>
      </div>

      {/* Results */}
      {submitted && results.length > 0 && (
        <div className="mt-16 border-t border-border pt-10" aria-live="polite">
          <h2 className="font-display text-2xl font-semibold">Your recommendations</h2>
          <p className="mt-2 text-muted-foreground">
            Based on &ldquo;{problem ? PROBLEM_LABELS[problem] : ""}&rdquo;
            {device ? `, on ${device}` : ""}
            {budget ? `, with a ${budget.replace("-", " ")} budget` : ""}.
          </p>
          <div className="mt-8 grid gap-5">
            {results.map((rec) => (
              <Card key={rec.resource.id}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">{rec.resource.name}</h3>
                      <Badge variant="outline">{CATEGORY_LABELS[rec.resource.category]}</Badge>
                    </div>
                    <Badge variant={rec.resource.pricing === "Free" || rec.resource.pricing === "Open Source" ? "success" : "default"}>
                      {rec.resource.pricing}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{rec.resource.purpose}</p>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                      Why this is recommended
                    </p>
                    <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                      {rec.reasons.map((r) => (
                        <li key={r} className="flex gap-2">
                          <span aria-hidden="true">•</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle-foreground">Limitations</p>
                    <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                      {rec.resource.limitations.map((l) => (
                        <li key={l} className="flex gap-2">
                          <span aria-hidden="true">•</span>
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {rec.incompatibilities.length > 0 && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <ul className="flex flex-col gap-1">
                        {rec.incompatibilities.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild size="sm">
                      <Link href={`/resources/${rec.resource.slug}`}>View setup details</Link>
                    </Button>
                    <Button asChild size="sm" variant="secondary">
                      <a href={rec.resource.officialDocsUrl} target="_blank" rel="noopener noreferrer">
                        Official documentation
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {submitted && results.length === 0 && (
        <p className="mt-16 border-t border-border pt-10 text-muted-foreground">
          No resource in our ten-tool catalog matches that combination. Try loosening your device or budget
          filter.
        </p>
      )}
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={null}>
      <AssessmentInner />
    </Suspense>
  );
}
