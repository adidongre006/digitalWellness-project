"""
These fixtures deliberately avoid needing a live Neon database or a real
XAI_API_KEY, so `pytest` runs in CI and on a fresh clone with zero external
accounts configured. That is a trade-off: these are unit/integration tests
of this backend's own logic (validation, routing, error handling, SSE
framing), not an end-to-end check that the real xAI API or the real Neon
database behaves as expected — that still has to be verified against a real
deployment before going live, per the project's "never claim tests passed
unless they were actually executed" requirement.
"""

import os
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

# Required settings must exist before `app.config.get_settings()` is ever
# called (including indirectly, at import time), so they're set first.
os.environ.setdefault("XAI_API_KEY", "test-key-not-real")
os.environ.setdefault("DATABASE_URL", "postgresql://test:test@localhost:5432/test")
os.environ.setdefault("FRONTEND_ORIGIN", "http://localhost:3000")
os.environ.setdefault("ENVIRONMENT", "development")

from app.schemas.resource import Resource  # noqa: E402


@pytest.fixture
def sample_resource() -> Resource:
    return Resource(
        id="res_test_tool",
        slug="test-tool",
        name="Test Tool",
        category="focus",
        purpose="A fake resource used only in tests.",
        description="Exists only so endpoint tests don't need a live database.",
        platforms=["Windows", "macOS"],
        pricing="Free",
        free_functionality="Everything, in this fake entry.",
        paid_restrictions=None,
        open_source=True,
        privacy_info="No data collection, it's a test fixture.",
        data_collection="None.",
        accessibility_notes="N/A — test fixture.",
        limitations=["This is not a real product."],
        official_website="https://example.com",
        official_docs_url="https://example.com/docs",
        privacy_policy_url=None,
        verified_on=datetime(2026, 1, 1, tzinfo=timezone.utc),
    )


@pytest.fixture
def client(monkeypatch, sample_resource):
    """A TestClient with the database pool and resource service mocked."""

    async def fake_connect_pool():
        return None

    async def fake_disconnect_pool():
        return None

    async def fake_check_health():
        return True

    monkeypatch.setattr("app.db.connect_pool", fake_connect_pool)
    monkeypatch.setattr("app.db.disconnect_pool", fake_disconnect_pool)
    monkeypatch.setattr("app.db.check_database_health", fake_check_health)

    async def fake_list_resources(*args, **kwargs):
        return [sample_resource]

    async def fake_get_by_slug(slug: str):
        return sample_resource if slug == sample_resource.slug else None

    monkeypatch.setattr("app.services.resource_service.list_resources", fake_list_resources)
    monkeypatch.setattr("app.services.resource_service.list_resources_by_category", fake_list_resources)
    monkeypatch.setattr("app.services.resource_service.get_resource_by_slug", fake_get_by_slug)

    from app.main import app

    with TestClient(app) as test_client:
        yield test_client
