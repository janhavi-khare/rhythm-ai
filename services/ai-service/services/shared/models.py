from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


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


class PhysiologicalState(BaseModel):
    heartRate: Optional[float] = None
    heartRateVariability: Optional[float] = None
    bodyTemperature: Optional[float] = None
    stressLevel: Optional[float] = None
    hydration: Optional[float] = None

    additionalMetrics: Dict[str, Any] = Field(default_factory=dict)


class PredictionMetadata(BaseModel):
    modelVersions: Dict[str, str] = Field(default_factory=dict)
    timestamps: Dict[str, datetime] = Field(default_factory=dict)


class PredictionResult(BaseModel):
    featureVector: Dict[str, Any]
    physiologicalState: Dict[str, Any]
    predictionMetadata: PredictionMetadata

    predictions: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None