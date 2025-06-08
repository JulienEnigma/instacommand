from pydantic import BaseModel
from typing import Literal, Optional, Any

class StanleyMessage(BaseModel):
    type: Literal['insight', 'recommendation', 'alert', 'analysis']
    message: str
    timestamp: str
    priority: Literal['high', 'medium', 'low']
    data: Optional[Any] = None
