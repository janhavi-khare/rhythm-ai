from pydantic import BaseModel
from typing import Any, Dict, Optional


class PhysiologicalState(BaseModel):
    heartRate: Optional[float] = None
    heartRateVariability: Optional[float] = None
    bodyTemperature: Optional[float] = None
    stressLevel: Optional[float] = None
    hydration: Optional[float] = None
    additionalMetrics: Optional[Dict[str, Any]] = None
