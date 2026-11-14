import Link from "next/link";
import {
  ArrowRight,
  Moon,
  ScanEye,
  ShieldCheck,
  Sparkles,
  Timer,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RESOURCES, CATEGORY_LABELS } from "@/data/resources";
import { PROBLEM_LABELS } from "@/lib/recommendations/engine";

const PROBLEM_ICONS = {
  doomscrolling: ScanEye,
  sleep: Moon,
  concentration: Timer,
  privacy: ShieldCheck,
} as const;

export default function LandingPage() {
  const featured = RESOURCES.slice(0, 3);

  return (
    <div>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="ambient-glow relative overflow-hidden border-b border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <Badge variant="primary" className="mb-6">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> Built for students, verified by us
          </Badge>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Build a Healthier Relationship With Technology.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Discover smarter digital habits, explore trusted wellness tools, and take control of your screen
            time, focus, sleep, and online privacy.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/assessment">
                Start Wellness Assessment <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/resources">Explore Resources</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Problem selector preview */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">What is affecting your digital wellbeing?</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick the one that fits best — the assessment uses it to filter down to two or three resources that
          actually suit your device and budget.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(PROBLEM_LABELS) as (keyof typeof PROBLEM_LABELS)[]).map((key) => {
            const Icon = PROBLEM_ICONS[key];
            return (
              <Link key={key} href={`/assessment?problem=${key}`}>
                <Card className="group h-full transition-colors hover:border-primary/60">
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-accent-soft">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium leading-snug">{PROBLEM_LABELS[key]}</span>
                    <span className="mt-auto flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Start here <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- Featured resources */}
      <section className="border-y border-border bg-background-secondary">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">Featured wellness resources</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Three of the ten tools in our verified catalog — every entry explains what it does, who it
                suits, and what it doesn&rsquo;t do.
              </p>
            </div>
            <Button asChild variant="secondary">
              <Link href="/resources">
                View all 10 <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featured.map((r) => (
              <Link key={r.id} href={`/resources/${r.slug}`}>
                <Card className="h-full transition-colors hover:border-primary/60">
                  <CardContent className="flex h-full flex-col gap-3 p-6">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{CATEGORY_LABELS[r.category]}</Badge>
                      <Badge variant={r.pricing === "Free" || r.pricing === "Open Source" ? "success" : "default"}>
                        {r.pricing}
                      </Badge>
                    </div>
                    <h3 className="font-display text-lg font-semibold">{r.name}</h3>
                    <p className="text-sm text-muted-foreground">{r.purpose}</p>
                    <p className="mt-auto text-xs text-subtle-foreground">
                      {r.platforms.slice(0, 3).join(" · ")}
                      {r.platforms.length > 3 ? ` +${r.platforms.length - 3} more` : ""}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">How the platform works</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Tell us what's affecting you",
              body: "Pick a problem — doomscrolling, sleep, focus, or privacy — and optionally your device and budget.",
            },
            {
              title: "Get 2–3 explained recommendations",
              body: "The same verified catalog that powers the comparison table filters down to a short, honest shortlist.",
            },
            {
              title: "Set it up with a real guide",
              body: "Follow a step-by-step guide with official links — no vague 'just install this' advice.",
            },
          ].map((step, i) => (
            <div key={step.title}>
              <p className="font-display text-3xl font-semibold text-primary">{i + 1}</p>
              <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- AI assistant intro */}
      <section className="border-y border-border bg-background-secondary">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Badge variant="primary" className="mb-4">
              <MessageSquareText className="h-3 w-3" aria-hidden="true" /> AI Co-Pilot
            </Badge>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Ask the Digital Wellness Co-Pilot
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Describe your situation in your own words — &ldquo;I waste too much time on YouTube, I use Windows
              and need something free&rdquo; — and get a recommendation grounded in the same verified catalog you
              see on this site, with real setup steps and official links.
            </p>
            <Button asChild className="mt-6">
              <Link href="/chat">
                Chat with the Co-Pilot <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <Card className="self-center">
            <CardContent className="space-y-3 p-6">
              <ChatBubble author="You">
                I waste too much time on YouTube. I use Windows and need a free solution.
              </ChatBubble>
              <ChatBubble author="Co-Pilot" accent>
                For Windows, LeechBlock NG (free, open source) can block YouTube on a schedule right in your
                browser. If you want something harder to bypass, Cold Turkey&rsquo;s free tier blocks websites too —
                its Pro upgrade adds full app blocking.
              </ChatBubble>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Privacy & transparency */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <h2 className="font-display text-2xl font-semibold">Privacy &amp; transparency</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We&rsquo;re not selling anything. Every claim about a tool is checked against its own site.
            </p>
          </div>
          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
            {[
              "No recommendation is sponsored — we don't accept payment from any listed resource.",
              "Every resource page shows the date it was last verified against its official source.",
              "We never claim an open-source tool is automatically private — we explain its actual privacy model.",
              "Platform or pricing changes (like a tool dropping Chrome support) are called out explicitly.",
            ].map((point) => (
              <Card key={point}>
                <CardContent className="p-5 text-sm text-muted-foreground">{point}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ChatBubble({ author, children, accent }: { author: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className={
        accent
          ? "rounded-2xl rounded-tl-sm border border-primary/30 bg-primary/10 p-4 text-sm"
          : "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-background-secondary p-4 text-sm"
      }
    >
      <p className="mb-1 text-xs font-semibold text-subtle-foreground">{author}</p>
      <p className="text-foreground">{children}</p>
    </div>
  );
}
