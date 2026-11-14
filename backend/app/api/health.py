from fastapi import APIRouter

from app.db import check_database_health

router = APIRouter(tags=["health"])


@router.get("/api/health")
async def health_check():
    db_ok = await check_database_health()
    return {
        "status": "ok" if db_ok else "degraded",
        "database": "connected" if db_ok else "unreachable",
    }
