from typing import List, Optional
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from app.schemas.training import TrainingSession, TrainingConfig
from app.models.training import TrainingSessionModel
from app.services.llm import LLMService
from app.services.vector_store import VectorStoreService

class TrainingService:
    def __init__(self, db: Session):
        self.db = db
        self.llm = LLMService()
        self.vector_store = VectorStoreService()

    async def create_session(self, config: TrainingConfig) -> TrainingSession:
        session = TrainingSessionModel(
            id=str(uuid.uuid4()),
            status="created",
            config=config.dict(),
        )
        self.db.add(session)
        self.db.commit()

        return TrainingSession(
            id=session.id,
            status=session.status,
            progress=0,
            config=config,
            created_at=session.created_at,
        )

    async def train(self, session_id: str):
        session = self.db.query(TrainingSessionModel)\
            .filter(TrainingSessionModel.id == session_id)\
            .first()
        
        if not session:
            raise ValueError("Training session not found")

        try:
            session.status = "training"
            session.started_at = datetime.now()
            self.db.commit()

            # Get training data from vector store
            documents = await self.vector_store.get_all_documents()

            # Start training
            await self.llm.train(
                documents,
                session.config,
                progress_callback=lambda p: self._update_progress(session_id, p)
            )

            session.status = "completed"
            session.completed_at = datetime.now()
            self.db.commit()

        except Exception as e:
            session.status = "failed"
            session.error = str(e)
            self.db.commit()
            raise

    async def _update_progress(self, session_id: str, progress: float):
        session = self.db.query(TrainingSessionModel)\
            .filter(TrainingSessionModel.id == session_id)\
            .first()
        
        if session:
            session.progress = progress
            self.db.commit()

    async def get_session(self, session_id: str) -> Optional[TrainingSession]:
        session = self.db.query(TrainingSessionModel)\
            .filter(TrainingSessionModel.id == session_id)\
            .first()

        if not session:
            return None

        return TrainingSession(
            id=session.id,
            status=session.status,
            progress=session.progress,
            config=session.config,
            created_at=session.created_at,
            started_at=session.started_at,
            completed_at=session.completed_at,
            error=session.error,
        )

    async def list_sessions(
        self,
        skip: int = 0,
        limit: int = 10
    ) -> List[TrainingSession]:
        sessions = self.db.query(TrainingSessionModel)\
            .offset(skip)\
            .limit(limit)\
            .all()

        return [
            TrainingSession(
                id=session.id,
                status=session.status,
                progress=session.progress,
                config=session.config,
                created_at=session.created_at,
                started_at=session.started_at,
                completed_at=session.completed_at,
                error=session.error,
            )
            for session in sessions
        ]

    async def stop_session(self, session_id: str):
        session = self.db.query(TrainingSessionModel)\
            .filter(TrainingSessionModel.id == session_id)\
            .first()

        if not session:
            raise ValueError("Training session not found")

        if session.status == "training":
            await self.llm.stop_training()
            session.status = "stopped"
            session.completed_at = datetime.now()
            self.db.commit()