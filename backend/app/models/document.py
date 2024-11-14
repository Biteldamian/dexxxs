from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    folder_id = Column(String, ForeignKey("folders.id"), nullable=True)
    embedding_id = Column(String, nullable=True)
    content = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    tags = Column(ARRAY(String), nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    processed_at = Column(DateTime, nullable=True)

    folder = relationship("Folder", back_populates="documents")

class Folder(Base):
    __tablename__ = "folders"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    parent_id = Column(String, ForeignKey("folders.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    documents = relationship("Document", back_populates="folder")
    children = relationship("Folder", 
                          backref=relationship("Folder", remote_side=[id]),
                          cascade="all, delete-orphan")