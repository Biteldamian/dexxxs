from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.schemas.training import TrainingSession, TrainingConfig
from app.services.training import TrainingService

router = APIRouter()

@router.post("/start", response_model=TrainingSession)
async def start_training(
    config: TrainingConfig,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
) -> TrainingSession:
    training_service = TrainingService(db)
    session = await training_service.create_session(config)
    background_tasks.add_task(training_service.train, session.id)
    return session

@router.get("/sessions", response_model=List[TrainingSession])
async def list_sessions(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
) -> List[TrainingSession]:
    training_service = TrainingService(db)
    return await training_service.list_sessions(skip=skip, limit=limit)

@router.get("/sessions/{session_id}", response_model=TrainingSession)
async def get_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
) -> TrainingSession:
    training_service = TrainingService(db)
    session = await training_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Training session not found")
    return session

@router.post("/sessions/{session_id}/stop")
async def stop_training(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    training_service = TrainingService(db)
    await training_service.stop_session(session_id)
    return {"status": "stopped"}