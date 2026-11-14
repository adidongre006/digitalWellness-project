from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.config import get_settings

settings = get_settings()


class ChatHistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=4000)


class ChatRequest(BaseModel):
    """
    Validated shape of a POST /api/chat or /api/chat/stream body. Message
    length and history size are both capped here — rejecting an oversized
    payload before it ever reaches the LLM call protects both cost and
    latency.
    """

    message: str = Field(..., min_length=1, max_length=4000)
    history: list[ChatHistoryMessage] = Field(default_factory=list)

    @field_validator("history")
    @classmethod
    def cap_history_length(cls, value: list[ChatHistoryMessage]) -> list[ChatHistoryMessage]:
        max_len = settings.max_history_messages
        if len(value) > max_len:
            # Keep only the most recent turns rather than rejecting the
            # whole request — a long-running conversation should degrade
            # gracefully, not error out.
            return value[-max_len:]
        return value


class ChatResponse(BaseModel):
    """Used by the non-streaming POST /api/chat endpoint."""

    message: str
    recommended_resource_slugs: list[str] = Field(default_factory=list)
