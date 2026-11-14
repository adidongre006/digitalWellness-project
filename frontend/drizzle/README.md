# drizzle

Generated SQL migration files land here after running `npm run db:generate`
(see drizzle.config.ts). This directory is intentionally empty in the
delivered source — migrations are generated from src/db/schema.ts, not
hand-written or committed ahead of time, so they always match the current
schema exactly.
