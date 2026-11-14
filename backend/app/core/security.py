"""
Security-related wiring shared across the app: CORS policy and the
per-IP rate limiter. Kept in one small module so main.py stays readable
and so every security decision has a single, easy-to-audit home.
"""

from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import get_settings

settings = get_settings()

# Rate limiting is keyed on the client's IP address rather than any
# session/cookie, since the chat endpoint is intentionally anonymous (it
# does not share the admin session system in the Next.js frontend).
limiter = Limiter(key_func=get_remote_address)


def configure_cors(app) -> None:
    """
    Restricts cross-origin requests to the configured frontend origin only.
    In production this MUST be the real deployed frontend URL (e.g.
    https://your-app.vercel.app), never "*" — a wildcard would let any
    website's JavaScript call this backend on a visitor's behalf.
    """
    allowed_origins = [
        origin.strip()
        for origin in settings.frontend_origin.strip(",")
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=False,  # the chat endpoint is anonymous; no cookies are needed
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type"],
    )
