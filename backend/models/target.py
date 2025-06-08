from pydantic import BaseModel
from typing import List, Literal

class Target(BaseModel):
    username: str
    bio: str
    location: str
    country: str
    continent: str
    strategy: str
    status: Literal['queued', 'active', 'completed']
    followBackChance: int
    storyDMOpen: Literal['High', 'Medium', 'Low']
    tagsMatched: int
    totalTags: int
    userTags: List[str]
