"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RESOURCES, CATEGORY_LABELS, type Category, type Pricing } from "@/data/resources";

const CATEGORIES: Category[] = ["screen-time", "focus", "sleep", "privacy"];
const PRICINGS: Pricing[] = ["Free", "Freemium", "Paid", "Open Source"];

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [pricing, setPricing] = useState<Pricing | "all">("all");

  const filtered = useMemo(() => {
    return RESOURCES.filter((r) => {
      const matchesQuery = query.trim().length === 0 || r.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || r.category === category;
      const matchesPricing = pricing === "all" || r.pricing === pricing;
      return matchesQuery && matchesCategory && matchesPricing;
    });
  }, [query, category, pricing]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Resource discovery</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        All ten verified tools in one place. Filter by category or pricing, or search by name.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            aria-label="Search resources by name"
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill active={category === "all"} onClick={() => setCategory("all")}>
            All categories
          </FilterPill>
          {CATEGORIES.map((c) => (
            <FilterPill key={c} active={category === c} onClick={() => setCategory(c)}>
              {CATEGORY_LABELS[c]}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterPill active={pricing === "all"} onClick={() => setPricing("all")}>
            Any price
          </FilterPill>
          {PRICINGS.map((p) => (
            <FilterPill key={p} active={pricing === p} onClick={() => setPricing(p)}>
              {p}
            </FilterPill>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-subtle-foreground" aria-live="polite">
        {filtered.length} resource{filtered.length === 1 ? "" : "s"} found
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-base font-medium">No resources match those filters.</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search term or clear a filter.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Link key={r.id} href={`/resources/${r.slug}`}>
              <Card className="h-full transition-colors hover:border-primary/60">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{CATEGORY_LABELS[r.category]}</Badge>
                    <Badge variant={r.pricing === "Free" || r.pricing === "Open Source" ? "success" : "default"}>
                      {r.pricing}
                    </Badge>
                  </div>
                  <h2 className="font-display text-lg font-semibold">{r.name}</h2>
                  <p className="text-sm text-muted-foreground">{r.purpose}</p>
                  <p className="mt-auto text-xs text-subtle-foreground">{r.platforms.join(" · ")}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
      )}
    >
      {children}
    </button>
  );
}
