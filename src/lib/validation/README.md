# validation

Zod schemas currently live next to the server actions that use them
(src/app/admin/actions.ts, src/app/admin/dashboard/actions.ts,
src/app/api/chat/route.ts) since each is small and used in exactly one
place. Move a schema here if it needs to be shared across more than one
action or route.
