import json

from app.db import get_pool
from app.schemas.resource import Resource

_COLUMNS = """
    id, slug, name, category, purpose, description, platforms, pricing,
    free_functionality, paid_restrictions, open_source, privacy_info,
    data_collection, accessibility_notes, limitations, official_website,
    official_docs_url, privacy_policy_url, verified_on
"""


def _row_to_resource(row) -> Resource:
    data = dict(row)
    # asyncpg returns JSONB columns as raw JSON text unless a codec is
    # registered; decoding explicitly here keeps this service's behavior
    # independent of whatever codec configuration a given deployment has.
    for jsonb_field in ("platforms", "limitations"):
        if isinstance(data[jsonb_field], str):
            data[jsonb_field] = json.loads(data[jsonb_field])
    return Resource(**data)


async def list_resources() -> list[Resource]:
    pool = get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(f"SELECT {_COLUMNS} FROM resources ORDER BY name ASC")
    return [_row_to_resource(r) for r in rows]


async def get_resource_by_slug(slug: str) -> Resource | None:
    pool = get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(f"SELECT {_COLUMNS} FROM resources WHERE slug = $1", slug)
    return _row_to_resource(row) if row else None


async def list_resources_by_category(category: str) -> list[Resource]:
    pool = get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            f"SELECT {_COLUMNS} FROM resources WHERE category = $1 ORDER BY name ASC", category
        )
    return [_row_to_resource(r) for r in rows]
