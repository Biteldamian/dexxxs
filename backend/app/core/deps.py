from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
from redis import Redis

from app.core.config import settings
from app.db.session import SessionLocal
from app.services.session import SessionService
from app.services.llm import LLMService
from app.services.vector_store import VectorStoreService
from app.services.chat import ChatService

api_key_header = APIKeyHeader(name="X-API-Key")

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_redis() -> Redis:
    return Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        password=settings.REDIS_PASSWORD,
        decode_responses=True
    )

def get_session_service(redis: Redis = Depends(get_redis)) -> SessionService:
    return SessionService(redis)

async def get_current_user(
    api_key: str = Depends(api_key_header),
    db: Session = Depends(get_db)
) -> str:
    if api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )
    return api_key

def get_llm_service() -> LLMService:
    return LLMService()

def get_vector_store() -> VectorStoreService:
    return VectorStoreService()

def get_chat_service(
    db: Session = Depends(get_db),
    llm: LLMService = Depends(get_llm_service),
    vector_store: VectorStoreService = Depends(get_vector_store),
) -> ChatService:
    return ChatService(db, llm, vector_store)