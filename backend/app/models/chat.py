from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True)
    content = Column(Text, nullable=False)
    role = Column(String, nullable=False)
    context_id = Column(String, ForeignKey("chat_contexts.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    context = relationship("Context", back_populates="messages")

class Context(Base):
    __tablename__ = "chat_contexts"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    messages = relationship("ChatMessage", back_populates="context")