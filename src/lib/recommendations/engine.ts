/**
 * Recommendation engine for the wellness assessment.
 *
 * Design note: this is intentionally a plain, readable scoring function
 * rather than a black box. The same resource catalog (src/data/resources.ts,
 * mirrored into Postgres) backs the assessment, the comparison table, and
 * the FastAPI chatbot, so a recommendation given here is explainable the
 * same way the chatbot explains its own picks.
 */
import { RESOURCES, type Category, type Platform, type Pricing, type WellnessResource } from "@/data/resources";

export type Problem = "doomscrolling" | "sleep" | "concentration" | "privacy";

export type DeviceAnswer = "Android" | "iOS" | "Windows" | "macOS" | "Linux";
export type BudgetAnswer = "free-only" | "freemium-ok" | "paid-ok";

export interface AssessmentInput {
  problem: Problem;
  device?: DeviceAnswer;
  budget?: BudgetAnswer;
}

export interface Recommendation {
  resource: WellnessResource;
  score: number;
  reasons: string[];
  incompatibilities: string[];
}

// Maps each student-facing problem to the catalog categories that address it.
// "doomscrolling" pulls from both screen-time and focus tools because both
// kinds of resource are legitimate answers to "I can't stop scrolling."
const PROBLEM_TO_CATEGORIES: Record<Problem, Category[]> = {
  doomscrolling: ["screen-time", "focus"],
  sleep: ["sleep"],
  concentration: ["focus"],
  privacy: ["privacy"],
};

// Maps a student's device answer to the platform tags that satisfy it.
// Browser-extension resources are compatible with every device, since the
// extension is what matters, not the OS.
const DEVICE_COMPATIBLE_PLATFORMS: Record<DeviceAnswer, Platform[]> = {
  Android: ["Android", "Chrome", "Firefox", "Edge"],
  iOS: ["iOS", "iPadOS", "watchOS", "Chrome", "Firefox", "Edge"],
  Windows: ["Windows", "Chrome", "Firefox", "Edge"],
  macOS: ["macOS", "Chrome", "Firefox", "Edge"],
  Linux: ["Linux", "Chrome", "Firefox", "Edge"],
};

function isDeviceCompatible(resource: WellnessResource, device: DeviceAnswer): boolean {
  const compatible = DEVICE_COMPATIBLE_PLATFORMS[device];
  return resource.platforms.some((p) => compatible.includes(p));
}

function matchesBudget(pricing: Pricing, budget: BudgetAnswer): boolean {
  if (budget === "free-only") return pricing === "Free" || pricing === "Open Source";
  if (budget === "freemium-ok") return pricing !== "Paid";
  return true; // paid-ok: anything goes
}

/**
 * Scores every resource in the catalog against the student's answers and
 * returns the top 2-3 recommendations, each annotated with the reasons it
 * was picked and any incompatibility it still has (so a resource is never
 * silently hidden or silently misrepresented as a perfect fit).
 */
export function recommend(input: AssessmentInput): Recommendation[] {
  const relevantCategories = PROBLEM_TO_CATEGORIES[input.problem];
  const candidates = RESOURCES.filter((r) => relevantCategories.includes(r.category));

  const scored: Recommendation[] = candidates.map((resource) => {
    let score = 10; // base score for being in a relevant category
    const reasons: string[] = [
      `Addresses the "${CATEGORY_READABLE[resource.category]}" side of your main concern.`,
    ];
    const incompatibilities: string[] = [];

    if (input.device) {
      if (isDeviceCompatible(resource, input.device)) {
        score += 10;
        reasons.push(`Works on ${input.device}.`);
      } else {
        score -= 15;
        incompatibilities.push(
          `Not available on ${input.device} — it supports ${resource.platforms.join(", ")}.`
        );
      }
    }

    if (input.budget) {
      if (matchesBudget(resource.pricing, input.budget)) {
        score += 8;
        reasons.push(`Fits a "${budgetReadable(input.budget)}" budget (${resource.pricing}).`);
      } else {
        score -= 20;
        incompatibilities.push(
          `Pricing is "${resource.pricing}", which exceeds a "${budgetReadable(input.budget)}" budget.`
        );
      }
    }

    // Small nudge for fully free/open-source tools, since the audience is students.
    if (resource.pricing === "Free" || resource.pricing === "Open Source") {
      score += 3;
    }

    return { resource, score, reasons, incompatibilities };
  });

  // Never silently drop an incompatible resource from consideration — sort
  // everything, but only surface compatible-enough results by default.
  const sorted = scored.sort((a, b) => b.score - a.score);
  const compatibleEnough = sorted.filter((r) => r.incompatibilities.length === 0);

  const top = (compatibleEnough.length > 0 ? compatibleEnough : sorted).slice(0, 3);
  return top.length >= 2 ? top : sorted.slice(0, 2);
}

const CATEGORY_READABLE: Record<Category, string> = {
  "screen-time": "screen time",
  focus: "focus",
  sleep: "sleep",
  privacy: "privacy",
};

function budgetReadable(budget: BudgetAnswer): string {
  if (budget === "free-only") return "free only";
  if (budget === "freemium-ok") return "freemium acceptable";
  return "paid acceptable";
}

export const PROBLEM_LABELS: Record<Problem, string> = {
  doomscrolling: "I keep doomscrolling",
  sleep: "My sleep is getting ruined",
  concentration: "I cannot concentrate while studying",
  privacy: "I am concerned about my online privacy",
};
