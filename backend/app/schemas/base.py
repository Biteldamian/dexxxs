from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TimeStampedModel(BaseModel):
    created_at: datetime = datetime.now()
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True