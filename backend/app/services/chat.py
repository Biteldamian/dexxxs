from typing import List, Optional
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from app.schemas.chat import Message, ChatResponse, ChatContext
from app.services.llm import LLMService
from app.services.vector_store import VectorStoreService
from app.models.chat import ChatMessage, Context

class ChatService:
    def __init__(self, db: Session):
        self.db = db
        self.llm = LLMService()
        self.vector_store = VectorStoreService()

    async def process_message(self, message: Message) -> ChatResponse:
        # Store user message
        chat_message = ChatMessage(
            id=str(uuid.uuid4()),
            content=message.content,
            role="user",
            context_id=message.context_id,
        )
        self.db.add(chat_message)
        self.db.commit()

        try:
            # Get relevant context from vector store
            context_docs = []
            if message.context_id:
                context_docs = await self.vector_store.search_similar(
                    message.content,
                    limit=5
                )

            # Generate response using LLM
            llm_response = await self.llm.generate_response(
                message.content,
                context=[doc["content"] for doc in context_docs]
            )

            # Store assistant response
            assistant_message = ChatMessage(
                id=str(uuid.uuid4()),
                content=llm_response,
                role="assistant",
                context_id=message.context_id,
            )
            self.db.add(assistant_message)
            self.db.commit()

            return ChatResponse(
                content=llm_response,
                context_documents=[doc["id"] for doc in context_docs],
            )

        except Exception as e:
            self.db.rollback()
            raise

    async def create_context(self, title: str) -> ChatContext:
        context = Context(
            id=str(uuid.uuid4()),
            title=title,
        )
        self.db.add(context)
        self.db.commit()
        return ChatContext(
            id=context.id,
            title=context.title,
            created_at=context.created_at,
        )

    async def list_contexts(
        self,
        skip: int = 0,
        limit: int = 10
    ) -> List[ChatContext]:
        contexts = self.db.query(Context)\
            .offset(skip)\
            .limit(limit)\
            .all()
        return [
            ChatContext(
                id=ctx.id,
                title=ctx.title,
                created_at=ctx.created_at,
            )
            for ctx in contexts
        ]