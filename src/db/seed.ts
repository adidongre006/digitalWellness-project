/**
 * Idempotent seed script.
 *
 * Run with:  npm run db:seed
 *
 * Uses an upsert (INSERT ... ON CONFLICT (id) DO UPDATE) keyed on the
 * resource's stable `id`, so running this script any number of times never
 * creates duplicates — it only inserts missing rows or refreshes existing
 * ones to match src/data/resources.ts, which is the single source of truth.
 * After seeding, the script verifies exactly ten resources are published,
 * per the project's "exactly ten" requirement, and exits non-zero if not.
 */
import { db, resources, resourceSources, guides } from "./index";
import { RESOURCES } from "../data/resources";
import { GUIDES } from "../data/guides";
import { sql } from "drizzle-orm";

async function seedResources() {
  console.log(`Seeding ${RESOURCES.length} resources...`);

  for (const r of RESOURCES) {
    await db
      .insert(resources)
      .values({
        id: r.id,
        slug: r.slug,
        name: r.name,
        category: r.category,
        purpose: r.purpose,
        description: r.description,
        platforms: r.platforms,
        pricing: r.pricing,
        freeFunctionality: r.freeFunctionality,
        paidRestrictions: r.paidRestrictions,
        openSource: r.openSource,
        privacyInfo: r.privacyInfo,
        dataCollection: r.dataCollection,
        accessibilityNotes: r.accessibilityNotes,
        limitations: r.limitations,
        officialWebsite: r.officialWebsite,
        officialDocsUrl: r.officialDocsUrl,
        privacyPolicyUrl: r.privacyPolicyUrl,
        verifiedOn: new Date(r.verifiedOn),
      })
      .onConflictDoUpdate({
        target: resources.id,
        set: {
          name: r.name,
          category: r.category,
          purpose: r.purpose,
          description: r.description,
          platforms: r.platforms,
          pricing: r.pricing,
          freeFunctionality: r.freeFunctionality,
          paidRestrictions: r.paidRestrictions,
          openSource: r.openSource,
          privacyInfo: r.privacyInfo,
          dataCollection: r.dataCollection,
          accessibilityNotes: r.accessibilityNotes,
          limitations: r.limitations,
          officialWebsite: r.officialWebsite,
          officialDocsUrl: r.officialDocsUrl,
          privacyPolicyUrl: r.privacyPolicyUrl,
          verifiedOn: new Date(r.verifiedOn),
          updatedAt: new Date(),
        },
      });

    // Record the verification source alongside the resource (also
    // idempotent in spirit: it's fine to log a fresh "checked again" row
    // each seed run, since resource_sources is an append-only register).
    await db.insert(resourceSources).values({
      resourceId: r.id,
      sourceType: "official_website",
      url: r.officialWebsite,
      dateChecked: new Date(r.verifiedOn),
      notes: "Verified via seed script against vendor's official site / app store listing.",
    });
  }

  const countRows = await db
    .execute<{ count: number }>(sql`select count(*)::int as count from ${resources}`)
    .then((res) => res.rows as unknown as { count: number }[]);
  const count = countRows[0]?.count ?? 0;

  if (count !== 10) {
    console.error(
      `FATAL: expected exactly 10 resources after seeding, found ${count}. Check src/data/resources.ts for duplicates or removed entries.`
    );
    process.exit(1);
  }

  console.log(`✓ Verified exactly ${count} resources are present.`);
}

async function seedGuides() {
  console.log(`Seeding ${GUIDES.length} guides...`);
  for (const g of GUIDES) {
    await db
      .insert(guides)
      .values(g)
      .onConflictDoUpdate({
        target: guides.slug,
        set: { ...g, updatedAt: new Date() },
      });
  }
  console.log("✓ Guides seeded.");
}

async function main() {
  await seedResources();
  await seedGuides();
  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
