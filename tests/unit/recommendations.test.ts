import { describe, expect, it } from "vitest";
import { recommend } from "@/lib/recommendations/engine";

describe("recommendation engine", () => {
  it("returns at least two recommendations for a basic problem with no filters", () => {
    const results = recommend({ problem: "sleep" });
    expect(results.length).toBeGreaterThanOrEqual(2);
    for (const r of results) {
      expect(r.resource.category).toBe("sleep");
    }
  });

  it("flags an incompatibility instead of silently hiding an unsuitable resource", () => {
    // Cold Turkey is desktop-only (Windows/macOS); asking for Android focus
    // tools should either exclude it or explain why it doesn't fit — never
    // recommend it without comment.
    const results = recommend({ problem: "concentration", device: "Android" });
    const coldTurkey = results.find((r) => r.resource.slug === "cold-turkey");
    if (coldTurkey) {
      expect(coldTurkey.incompatibilities.length).toBeGreaterThan(0);
    }
  });

  it("prefers free/open-source tools when budget is 'free-only'", () => {
    const results = recommend({ problem: "privacy", budget: "free-only" });
    for (const r of results) {
      expect(["Free", "Open Source"]).toContain(r.resource.pricing);
    }
  });

  it("every recommendation includes at least one reason", () => {
    const results = recommend({ problem: "doomscrolling", device: "iOS", budget: "freemium-ok" });
    for (const r of results) {
      expect(r.reasons.length).toBeGreaterThan(0);
    }
  });
});
