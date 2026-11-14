"""
A single asyncpg connection pool for the whole process, pointed at the SAME
Neon Postgres database the Next.js frontend manages with Drizzle. This
backend never creates its own tables or its own copy of the resource
catalog — it only reads the `resources` table that `npm run db:seed`
populates (see src/db/seed.ts), which is what keeps the website, the
comparison table, and this chatbot answering from one consistent source.
"""

from __future__ import annotations

import asyncpg

from app.config import get_settings

_pool: asyncpg.Pool | None = None


async def connect_pool() -> None:
    global _pool
    settings = get_settings()
    _pool = await asyncpg.create_pool(
        dsn=settings.database_url,
        min_size=1,
        max_size=5,
        command_timeout=10,
    )


async def disconnect_pool() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None


def get_pool() -> asyncpg.Pool:
    if _pool is None:
        raise RuntimeError(
            "Database pool is not initialized. connect_pool() must run during app startup "
            "(see app/main.py's lifespan handler)."
        )
    return _pool


async def check_database_health() -> bool:
    try:
        pool = get_pool()
        async with pool.acquire() as conn:
            result = await conn.fetchval("SELECT 1")
            return result == 1
    except Exception:
        return False
