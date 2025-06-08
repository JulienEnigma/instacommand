from pydantic import BaseModel

class Command(BaseModel):
    input: str
    output: str
    timestamp: str
    success: bool
