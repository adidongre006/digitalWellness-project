import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  pgEnum,
  jsonb,
  uuid,
  index,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const categoryEnum = pgEnum("category", ["screen-time", "focus", "sleep", "privacy"]);
export const pricingEnum = pgEnum("pricing", ["Free", "Freemium", "Paid", "Open Source"]);

// ---------------------------------------------------------------------------
// resources — the ten verified wellness tools. This is the table the
// assessment engine, comparison matrix, and FastAPI chatbot all read from,
// so there is exactly one resource catalog in the whole system.
// ---------------------------------------------------------------------------
export const resources = pgTable(
  "resources",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    slug: varchar("slug", { length: 128 }).notNull().unique(),
    name: varchar("name", { length: 256 }).notNull(),
    category: categoryEnum("category").notNull(),
    purpose: text("purpose").notNull(),
    description: text("description").notNull(),
    // Stored as JSONB rather than a join table: platform lists are small,
    // read far more often than written, and never queried relationally.
    platforms: jsonb("platforms").$type<string[]>().notNull(),
    pricing: pricingEnum("pricing").notNull(),
    freeFunctionality: text("free_functionality").notNull(),
    paidRestrictions: text("paid_restrictions"),
    openSource: boolean("open_source").notNull().default(false),
    privacyInfo: text("privacy_info").notNull(),
    dataCollection: text("data_collection").notNull(),
    accessibilityNotes: text("accessibility_notes").notNull(),
    limitations: jsonb("limitations").$type<string[]>().notNull(),
    officialWebsite: varchar("official_website", { length: 512 }).notNull(),
    officialDocsUrl: varchar("official_docs_url", { length: 512 }).notNull(),
    privacyPolicyUrl: varchar("privacy_policy_url", { length: 512 }),
    verifiedOn: timestamp("verified_on", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    categoryIdx: index("resources_category_idx").on(table.category),
    pricingIdx: index("resources_pricing_idx").on(table.pricing),
  })
);

// ---------------------------------------------------------------------------
// resource_sources — the verification register: every official URL checked
// for a resource, kept separately from the resource row so a new source can
// be added (e.g. a fresh pricing-page check) without editing resources.
// ---------------------------------------------------------------------------
export const resourceSources = pgTable(
  "resource_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resourceId: varchar("resource_id", { length: 64 })
      .notNull()
      .references(() => resources.id, { onDelete: "cascade" }),
    sourceType: varchar("source_type", { length: 64 }).notNull(), // 'official_website' | 'pricing_page' | 'support_docs' | 'privacy_policy' | 'repository'
    url: varchar("url", { length: 512 }).notNull(),
    dateChecked: timestamp("date_checked", { mode: "date" }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    resourceIdx: index("resource_sources_resource_idx").on(table.resourceId),
  })
);

// ---------------------------------------------------------------------------
// guides — the three (or more) student setup guides, rendered with the
// shadcn/ui Accordion on /guides. Content is stored as structured JSON
// (array of {title, body} step blocks) so it renders without a Markdown
// pipeline and admins can edit it from the dashboard.
// ---------------------------------------------------------------------------
export const guides = pgTable("guides", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  objective: text("objective").notNull(),
  supportedDevices: jsonb("supported_devices").$type<string[]>().notNull(),
  prerequisites: jsonb("prerequisites").$type<string[]>().notNull(),
  steps: jsonb("steps").$type<{ title: string; body: string }[]>().notNull(),
  expectedOutcome: text("expected_outcome").notNull(),
  commonProblems: jsonb("common_problems").$type<{ problem: string; fix: string }[]>().notNull(),
  officialReferences: jsonb("official_references").$type<{ label: string; url: string }[]>().notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// admin_users — exactly the administrators who can reach /admin/dashboard.
// Passwords are NEVER stored here in plaintext; only an Argon2id hash is.
// ---------------------------------------------------------------------------
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(), // argon2id hash, never plaintext
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { mode: "date" }),
});

// ---------------------------------------------------------------------------
// admin_sessions — server-side session store backing the HttpOnly session
// cookie. Sessions are opaque random tokens (hashed before storage) with an
// expiry, so a stolen database row alone cannot be replayed as a cookie.
// ---------------------------------------------------------------------------
export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(), // sha256 of the cookie value
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 64 }),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    adminIdx: index("admin_sessions_admin_idx").on(table.adminId),
    expiresIdx: index("admin_sessions_expires_idx").on(table.expiresAt),
  })
);

// ---------------------------------------------------------------------------
// audit_logs — append-only record of sensitive admin actions. Never logs
// passwords, session tokens, or other secrets — only what happened and when.
// ---------------------------------------------------------------------------
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id").references(() => adminUsers.id, { onDelete: "set null" }),
    action: varchar("action", { length: 128 }).notNull(), // e.g. 'resource.update', 'admin.login', 'guide.publish'
    targetType: varchar("target_type", { length: 64 }), // e.g. 'resource', 'guide'
    targetId: varchar("target_id", { length: 128 }),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    adminIdx: index("audit_logs_admin_idx").on(table.adminId),
    createdIdx: index("audit_logs_created_idx").on(table.createdAt),
  })
);

// ---------------------------------------------------------------------------
// login_attempts — lightweight brute-force / rate-limit tracking for
// /admin login, keyed by IP + email pair rather than cookies (which an
// unauthenticated attacker won't reliably carry).
// ---------------------------------------------------------------------------
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ipAddress: varchar("ip_address", { length: 64 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    success: boolean("success").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    ipIdx: index("login_attempts_ip_idx").on(table.ipAddress),
    createdIdx: index("login_attempts_created_idx").on(table.createdAt),
  })
);

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type Guide = typeof guides.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
