from datetime import datetime
from typing import Literal

from pydantic import BaseModel

Category = Literal["screen-time", "focus", "sleep", "privacy"]
Pricing = Literal["Free", "Freemium", "Paid", "Open Source"]


class Resource(BaseModel):
    """
    Mirrors src/db/schema.ts `resources` exactly, field for field, since
    both sides read the same Postgres table. If you add a column to the
    Drizzle schema, add it here too (and in resource_service.py's SELECT).
    """

    id: str
    slug: str
    name: str
    category: Category
    purpose: str
    description: str
    platforms: list[str]
    pricing: Pricing
    free_functionality: str
    paid_restrictions: str | None
    open_source: bool
    privacy_info: str
    data_collection: str
    accessibility_notes: str
    limitations: list[str]
    official_website: str
    official_docs_url: str
    privacy_policy_url: str | None
    verified_on: datetime
