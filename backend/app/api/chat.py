from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.ai.agent import get_chat_reply
from app.ai.streaming import chat_event_stream
from app.core.security import limiter
from app.config import get_settings
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/chat", tags=["chat"])
settings = get_settings()


@router.post("", response_model=ChatResponse)
@limiter.limit(settings.chat_rate_limit)
async def chat(request: Request, body: ChatRequest):
    """Non-streaming variant — useful for simple integrations/tests; the
    production UI uses /api/chat/stream instead."""
    reply = await get_chat_reply(body.message, body.history)
    return ChatResponse(message=reply)


@router.post("/stream")
@limiter.limit(settings.chat_rate_limit)
async def chat_stream(request: Request, body: ChatRequest):
    """
    Streams the assistant's reply as Server-Sent Events. Called by the
    Next.js frontend's /api/chat route handler (src/app/api/chat/route.ts),
    which passes this stream straight through to the browser.
    """
    return StreamingResponse(
        chat_event_stream(body.message, body.history),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # disable nginx-style buffering so chunks flush immediately
        },
    )
