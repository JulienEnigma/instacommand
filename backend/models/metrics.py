from pydantic import BaseModel

class MetricsData(BaseModel):
    profileViews: int
    storyViews: int
    engagementRate: float
    lastUpdate: str
