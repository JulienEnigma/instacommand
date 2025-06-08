from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

class LogEntry(BaseModel):
    timestamp: str
    action: str
    target: Optional[str] = None
    details: str
    type: Literal['follow', 'story', 'dm', 'engage', 'scan', 'system', 'stanley']
    outcome: Literal['success', 'warning', 'error']
    probability: Optional[float] = None
    followbackChance: Optional[float] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
