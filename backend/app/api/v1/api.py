from fastapi import APIRouter
from app.api.v1.endpoints import chat, documents, search, tasks, training

api_router = APIRouter()

api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(training.router, prefix="/training", tags=["training"])