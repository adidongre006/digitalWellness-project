"""
Builds the LangChain chat model used by the chatbot.

IMPORTANT — read before deploying:
The project brief specifies two things that don't actually point at the same
place: "Grok through LangChain ChatXAI" (xAI's API, billed through
XAI_API_KEY) and a model literally named "gpt-oss-120b" (an OpenAI
open-weight model that xAI does not serve — it's commonly hosted by *Groq*,
a different company with a similar-sounding name, via GROQ_API_KEY and
LangChain's `langchain-groq` package instead).

This file implements the literal, explicitly-named architecture — xAI's
ChatXAI — and defaults XAI_MODEL to "grok-4", a real, current Grok model, so
the backend works out of the box. If what you actually meant was
Groq-hosted gpt-oss-120b:
  1. pip install langchain-groq
  2. replace the `from langchain_xai import ChatXAI` block below with:
         from langchain_groq import ChatGroq
         return ChatGroq(model="openai/gpt-oss-120b", api_key=settings.groq_api_key, ...)
  3. add `groq_api_key: str` to app/config.py and set GROQ_API_KEY in .env.
Everything else in app/ai and app/api is provider-agnostic and needs no
other changes either way.
"""
from dotenv import load_dotenv

load_dotenv()

# from langchain.agents import create_agent

from langchain.chat_models import init_chat_model

# from langchain.tools import tool








from functools import lru_cache

# from langchain_xai import ChatXAI

from app.config import get_settings


@lru_cache
def get_chat_model() -> init_chat_model:
    settings = get_settings()
    return init_chat_model(
        model=settings.xai_model,
        model_provider="groq",
        api_key=settings.xai_api_key,
        temperature=0.4,  # relatively low: this assistant gives factual tool recommendations, not creative writing
        
        
    )
