from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api import chat, health, resources
from app.config import get_settings
from app.core.security import configure_cors, limiter
from app.db import connect_pool, disconnect_pool

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_pool()
    yield
    await disconnect_pool()


app = FastAPI(
    title="Digital Wellness Resource Hub API",
    description="AI chatbot and resource-catalog API backing the Digital Wellness Resource Hub frontend.",
    version="1.0.0",
    lifespan=lifespan,
    # Docs are left on by default for local development. Set
    # ENVIRONMENT=production to disable them in a public deployment, since
    # an exposed interactive API explorer is unnecessary surface area.
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

configure_cors(app)

app.include_router(health.router)
app.include_router(chat.router)
app.include_router(resources.router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # FastAPI's default validation error response is reasonably safe
    # already (it echoes back field names and constraint descriptions, not
    # internals), but this handler keeps the response shape consistent
    # with the rest of the API and in one place to review.
    return JSONResponse(status_code=422, content={"error": "Invalid request.", "details": exc.errors()})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Final safety net: whatever happened, the client gets a generic
    # message — never a stack trace or an upstream provider's raw error
    # body, which could contain internal URLs, keys, or other details.
    print(f"[unhandled_exception] {request.method} {request.url.path}: {exc!r}")
    return JSONResponse(status_code=500, content={"error": "An unexpected server error occurred."})
