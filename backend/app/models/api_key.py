from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.base import Base

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(String, primary_key=True)
    key = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    last_used_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)