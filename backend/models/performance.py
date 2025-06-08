from pydantic import BaseModel

class PerformanceMetric(BaseModel):
    label: str
    value: float
    change: float
    unit: str
