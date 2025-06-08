from pydantic import BaseModel
from typing import Literal

class RecentActivity(BaseModel):
    action: str
    target: str
    timestamp: str
    outcome: Literal['success', 'pending', 'failed']
