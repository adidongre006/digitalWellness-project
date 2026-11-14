import { describe, expect, it } from "vitest";
import { RESOURCES } from "@/data/resources";

describe("resource catalog", () => {
  it("contains exactly ten resources", () => {
    expect(RESOURCES).toHaveLength(10);
  });

  it("has unique ids", () => {
    const ids = RESOURCES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique slugs", () => {
    const slugs = RESOURCES.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("covers all four categories", () => {
    const categories = new Set(RESOURCES.map((r) => r.category));
    expect(categories).toEqual(new Set(["screen-time", "focus", "sleep", "privacy"]));
  });

  it("uses only the four allowed pricing classifications", () => {
    const allowed = new Set(["Free", "Freemium", "Paid", "Open Source"]);
    for (const r of RESOURCES) {
      expect(allowed.has(r.pricing)).toBe(true);
    }
  });

  it("gives every resource at least one stated limitation", () => {
    for (const r of RESOURCES) {
      expect(r.limitations.length).toBeGreaterThan(0);
    }
  });

  it("gives every resource an official website and docs URL", () => {
    for (const r of RESOURCES) {
      expect(r.officialWebsite).toMatch(/^https:\/\//);
      expect(r.officialDocsUrl).toMatch(/^https:\/\//);
    }
  });

  it("marks open-source status independently of pricing — never assumes Free implies open source", () => {
    const freeButNotOpenSource = RESOURCES.filter((r) => r.pricing === "Free" && !r.openSource);
    // Google Digital Wellbeing, Apple Screen Time, Android Bedtime Mode, and
    // Apple Sleep Focus are all Free but closed-source platform features —
    // this is the concrete check for the spec's "never assume open-source
    // implies private, or free implies open source" requirement.
    expect(freeButNotOpenSource.length).toBeGreaterThan(0);
  });
});
