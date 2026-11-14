// Shared ambient/utility types used in more than one place. Feature-specific
// types (resource, guide, recommendation, chat message) live next to the
// code that owns them — see src/data/resources.ts, src/data/guides.ts,
// src/lib/recommendations/engine.ts, and src/components/chatbot/types.ts.
export type { Category, Pricing, Platform, WellnessResource } from "@/data/resources";
export type { Guide } from "@/data/guides";
