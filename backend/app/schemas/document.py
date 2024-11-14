from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentBase(BaseModel):
    name: str
    type: str
    size: int
    folder_id: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: str
    status: str
    embedding_id: Optional[str] = None
    created_at: datetime
    processed_at: Optional[datetime] = None
    error: Optional[str] = None
    summary: Optional[str] = None
    tags: Optional[List[str]] = None

    class Config:
        from_attributes = True

class FolderBase(BaseModel):
    name: str
    parent_id: Optional[str] = None

class FolderCreate(FolderBase):
    pass

class FolderResponse(FolderBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True