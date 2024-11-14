from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Message(BaseModel):
    content: str
    role: str = "user"
    context_id: Optional[str] = None
    created_at: Optional[datetime] = None

class ChatResponse(BaseModel):
    content: str
    role: str = "assistant"
    context_documents: Optional[List[str]] = None
    created_at: datetime = datetime.now()

class ChatContext(BaseModel):
    id: str
    title: Optional[str] = None
    created_at: datetime = datetime.now()