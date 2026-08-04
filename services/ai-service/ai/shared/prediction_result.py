from datetime import datetime
from pydantic import BaseModel
from typing import Any, Dict, Optional


class PredictionMetadata(BaseModel):
    modelVersions: Dict[str, str] = {}
    timestamps: Dict[str, datetime] = {}


class PredictionResult(BaseModel):
    featureVector: Dict[str, Any]
    physiologicalState: Dict[str, Any]
    predictionMetadata: PredictionMetadata
    predictions: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None
