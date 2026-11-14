"""
Server-Sent Events protocol for /api/chat/stream. This MUST stay in sync
with the parser in the frontend at
src/components/chatbot/chat-shell.tsx (see the docstring there):

    data: {"delta": "next chunk of text"}\\n\\n   — zero or more
    data: {"done": true}\\n\\n                    — exactly one, on success
    data: {"error": "human-readable message"}\\n\\n — instead of "done", on failure

Each event is valid JSON on a single line, which keeps parsing trivial on
both ends and avoids any ambiguity around embedded newlines in model output
(newlines inside `delta` are safely inside the JSON string value).
"""

import json
from collections.abc import AsyncIterator

from app.ai.agent import stream_chat_reply
from app.schemas.chat import ChatHistoryMessage


def _sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"


async def chat_event_stream(message: str, history: list[ChatHistoryMessage]) -> AsyncIterator[str]:
    try:
        async for delta in stream_chat_reply(message, history):
            yield _sse({"delta": delta})
        yield _sse({"done": True})
    except Exception as exc:  # noqa: BLE001 — intentionally broad: this is the final error boundary
        # Never leak internal exception details (stack traces, provider
        # error payloads that might include request internals) to the
        # client — only a safe, generic message, per the project's
        # "do not expose internal error traces to users" requirement.
        print(f"[chat_event_stream] upstream error: {exc!r}")  # server-side log only
        yield _sse({"error": "The assistant hit an unexpected problem generating a response. Please try again."})
