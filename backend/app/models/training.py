from sqlalchemy import Column, String, DateTime, Float, JSON, Text
from sqlalchemy.sql import func
from app.db.base import Base

class TrainingSessionModel(Base):
    __tablename__ = "training_sessions"

    id = Column(String, primary_key=True)
    status = Column(String, nullable=False)
    progress = Column(Float, default=0)
    config = Column(JSON, nullable=False)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)