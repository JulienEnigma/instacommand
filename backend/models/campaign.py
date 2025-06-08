from pydantic import BaseModel
from typing import Optional, Literal

class Campaign(BaseModel):
    id: str
    name: str
    codename: str
    status: Literal['active', 'completed', 'scheduled', 'failed', 'archived', 'paused']
    progress: int
    timeRemaining: str
    target: int
    current: int
    description: str
    completedAt: Optional[str] = None
    verdict: Optional[str] = None
