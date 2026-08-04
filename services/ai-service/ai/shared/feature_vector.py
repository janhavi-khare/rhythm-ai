from pydantic import BaseModel
from typing import Optional


class FeatureVector(BaseModel):
    sleepDebt: float
    avgSleep7d: float
    avgSleep30d: float
    trainingLoad: float
    acuteLoad: float
    chronicLoad: float
    muscleSoreness: Optional[float] = None
    mood: Optional[float] = None
    energy: Optional[float] = None
    phase: Optional[str] = None
    cycleDay: Optional[int] = None
