from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class TrainingConfig(BaseModel):
    epochs: int
    batch_size: int = 32
    learning_rate: float = 0.001
    model_name: str = "llama2"
    parameters: Optional[Dict[str, Any]] = None

class TrainingSession(BaseModel):
    id: str
    status: str
    progress: float
    config: TrainingConfig
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None

    class Config:
        from_attributes = True