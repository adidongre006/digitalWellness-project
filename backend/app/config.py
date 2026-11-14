"""
Centralized, validated configuration. Every environment variable the
backend depends on is declared here with a type, so a missing or malformed
value fails fast at startup with a clear error instead of surfacing as a
confusing runtime exception deep inside a request handler.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- AI provider ------------------------------------------------------
    xai_api_key: str
    # Default is a real, current xAI Grok model name. See app/ai/model.py
    # for the note on the project brief's "gpt-oss-120b" vs. Grok mismatch —
    # that model does not exist on xAI's API, so it is NOT used as a default
    # here to avoid shipping a backend that fails on every request.
    xai_model: str = "openai/gpt-oss-20b"

    # --- Database -----------------------------------------------------------
    database_url: str

    # --- CORS / networking ---------------------------------------------
    frontend_origin: str = "http://localhost:3000"

    # --- Request limits -------------------------------------------------------
    max_message_length: int = 3000
    max_history_messages: int = 50
    chat_rate_limit: str = "20/minute"  # slowapi format: "<count>/<period>"

    # --- Misc -----------------------------------------------------------------
    environment: str = "development"  # "development" | "production"

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    # lru_cache turns this into a process-wide singleton: Settings() runs
    # (and therefore validates all required env vars) exactly once.
    return Settings()
