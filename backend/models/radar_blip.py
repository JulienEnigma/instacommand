from pydantic import BaseModel
from typing import Literal

class RadarBlip(BaseModel):
    id: str
    x: float
    y: float
    type: Literal['new_follower', 'high_value', 'lost', 'active_target']
    intensity: float
    label: str
    timeActive: int
    engagementLevel: int
    lastAction: str
