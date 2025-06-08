from pydantic import BaseModel

class ProfileStatsData(BaseModel):
    followers: int
    following: int
    posts: int
    refreshInterval: int
