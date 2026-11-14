"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RESOURCES, CATEGORY_LABELS, type Category } from "@/data/resources";
import { cn } from "@/lib/utils";

type SortKey = "name" | "pricing" | "verifiedOn";

export default function ComparisonPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => {
    const filtered = RESOURCES.filter((r) => {
      const matchesQuery = query.trim().length === 0 || r.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || r.category === category;
      return matchesQuery && matchesCategory;
    });
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      if (sortKey === "pricing") cmp = a.pricing.localeCompare(b.pricing);
      if (sortKey === "verifiedOn") cmp = a.verifiedOn.localeCompare(b.verifiedOn);
      return sortAsc ? cmp : -cmp;
    });
    return sorted;
  }, [query, category, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Resource comparison matrix</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        All ten verified resources, side by side. Pricing is always shown as text, never color alone.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
          aria-label="Search resources"
          className="max-w-xs"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          aria-label="Filter by category"
          className="h-11 rounded-xl border border-border bg-background-secondary px-4 text-sm"
        >
          <option value="all">All categories</option>
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-subtle-foreground" aria-live="polite">
        {rows.length} resource{rows.length === 1 ? "" : "s"} shown
      </p>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No resources match that search.
        </div>
      ) : (
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label="Tool" active={sortKey === "name"} asc={sortAsc} onClick={() => toggleSort("name")} />
                <TableHead>Purpose</TableHead>
                <TableHead>Platforms</TableHead>
                <SortableHead label="Cost" active={sortKey === "pricing"} asc={sortAsc} onClick={() => toggleSort("pricing")} />
                <TableHead>Privacy</TableHead>
                <TableHead>Limitations</TableHead>
                <TableHead>Source</TableHead>
                <SortableHead label="Date Checked" active={sortKey === "verifiedOn"} asc={sortAsc} onClick={() => toggleSort("verifiedOn")} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="min-w-[160px] font-medium">{r.name}</TableCell>
                  <TableCell className="min-w-[200px] text-muted-foreground">{r.purpose}</TableCell>
                  <TableCell className="min-w-[160px]">
                    <div className="flex flex-wrap gap-1">
                      {r.platforms.map((p) => (
                        <Badge key={p} variant="outline">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[110px]">
                    <Badge variant={r.pricing === "Free" || r.pricing === "Open Source" ? "success" : "default"}>
                      {r.pricing}
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-[220px] text-muted-foreground">{r.privacyInfo}</TableCell>
                  <TableCell className="min-w-[240px] text-muted-foreground">
                    <ul className="flex flex-col gap-1">
                      {r.limitations.slice(0, 1).map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="min-w-[120px]">
                    <a
                      href={r.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Visit <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </TableCell>
                  <TableCell className="min-w-[120px] whitespace-nowrap text-muted-foreground">
                    {new Date(r.verifiedOn).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function SortableHead({ label, active, asc, onClick }: { label: string; active: boolean; asc: boolean; onClick: () => void }) {
  return (
    <TableHead>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex items-center gap-1 font-medium hover:text-foreground",
          active && "text-foreground"
        )}
        aria-label={`Sort by ${label}`}
      >
        {label}
        <ArrowUpDown className={cn("h-3.5 w-3.5", active && asc && "rotate-180")} aria-hidden="true" />
      </button>
    </TableHead>
  );
}
