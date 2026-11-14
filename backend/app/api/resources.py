from fastapi import APIRouter, HTTPException

from app.schemas.resource import Resource
from app.services import resource_service

router = APIRouter(prefix="/api/resources", tags=["resources"])


@router.get("", response_model=list[Resource])
async def get_resources(category: str | None = None):
    if category:
        return await resource_service.list_resources_by_category(category)
    return await resource_service.list_resources()


@router.get("/{slug}", response_model=Resource)
async def get_resource(slug: str):
    resource = await resource_service.get_resource_by_slug(slug)
    if resource is None:
        raise HTTPException(status_code=404, detail=f"No resource found with slug '{slug}'.")
    return resource
