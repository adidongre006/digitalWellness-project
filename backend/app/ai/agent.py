from collections.abc import AsyncIterator

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from app.ai.model import get_chat_model
from app.ai.prompts import build_system_prompt
from app.schemas.chat import ChatHistoryMessage
from app.services.resource_service import list_resources


async def build_messages(message: str, history: list[ChatHistoryMessage]):
    """
    Always loads the full resource catalog fresh from Postgres for every
    request (only ten rows — this is cheap) rather than caching it in
    process memory, so an administrator's edit in the dashboard is
    reflected in the very next chatbot answer with no redeploy or restart.
    """
    resources = await list_resources()
    system_prompt = build_system_prompt(resources)

    messages = [SystemMessage(content=system_prompt)]
    for turn in history:
        if turn.role == "user":
            messages.append(HumanMessage(content=turn.content))
        else:
            messages.append(AIMessage(content=turn.content))
    messages.append(HumanMessage(content=message))
    return messages


async def stream_chat_reply(message: str, history: list[ChatHistoryMessage]) -> AsyncIterator[str]:
    """Yields response text incrementally as the model generates it."""
    model = get_chat_model()
    messages = await build_messages(message, history)
    async for chunk in model.astream(messages):
        if chunk.content:
            yield chunk.content


async def get_chat_reply(message: str, history: list[ChatHistoryMessage]) -> str:
    """Non-streaming variant used by POST /api/chat."""
    model = get_chat_model()
    messages = await build_messages(message, history)
    result = await model.ainvoke(messages)
    return result.content
