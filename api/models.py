from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class DailyLogInput(BaseModel):
    # Cycle info
    period_start_date: date
    cycle_length: int = Field(..., ge=21, le=35)
    period_length: int =  Field(..., ge=2, le=7)

    # Workout
    workout_type: str
    intensity: str

    # Sleep — two versions, one for ML (number), one for engine (string)
    sleep_hours: float = Field(..., ge=3, le=12)
    sleep_quality: str   # "<5 hours", "5-6 hours", "7-8 hours", ">8 hours"

    # Goal
    goal: str

    # Symptoms — for ML model
    energy: int = Field(..., ge=1, le=5)
    mood: int = Field(..., ge=1, le=5)
    bloating: bool
    craving_intensity: int = Field(..., ge=0, le=2)


class RecommendationResponse(BaseModel):
    predicted_phase: str
    phase_label: str
    phase_description: str
    priority_nutrients: list
    priority_lifestyle: list
    nutrient_levels: dict
    nutrient_scores: dict
    checklist: list
    food_suggestions: list
    intensity_advice: Optional[str]