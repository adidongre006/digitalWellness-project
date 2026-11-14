import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Neon's HTTP driver is used instead of a long-lived TCP pool because
 * Next.js Server Components and Route Handlers run in a serverless /
 * edge-adjacent environment on Vercel, where a persistent TCP connection
 * pool per invocation does not scale the way it would on a long-running
 * server. Use the pooled connection string (the one containing
 * "-pooler" in the hostname) from the Neon dashboard as DATABASE_URL.
 */
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon pooled connection string."
  );
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
export * from "./schema";
