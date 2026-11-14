import { defineConfig } from "drizzle-kit";

// Loaded by `drizzle-kit generate` / `drizzle-kit migrate` / `drizzle-kit studio`.
// DATABASE_URL must point at your Neon Postgres instance (see .env.example).
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run Drizzle Kit commands.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
