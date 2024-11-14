from sqlalchemy import Column, String, JSON, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Settings(Base):
    __tablename__ = "settings"
    
    user_id = Column(String, primary_key=True)
    preferences = Column(JSON, nullable=False, default=dict)
    api_keys = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())