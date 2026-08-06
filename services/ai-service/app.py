import sys
from pathlib import Path

SERVICE_DIR = Path(__file__).resolve().parent
ROOT_DIR = SERVICE_DIR.parent.parent

for path in [
    str(SERVICE_DIR),
    str(SERVICE_DIR / "services"),
    str(ROOT_DIR),
    str(ROOT_DIR / "services"),
]:
    if path not in sys.path:
        sys.path.append(path)

from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import Optional, Union, List

try:
    from services.recovery_engine import generate_post_workout_plan
except ModuleNotFoundError:
    from recovery_engine import generate_post_workout_plan

app = FastAPI(
    title="Rhythm AI Service",
    version="2.0.0"
)

class RecoveryRequest(BaseModel):
    phase: str
    intensity: str
    duration: int
    weight: float
    workoutType: str
    rpe: Optional[float] = None
    muscleSoreness: Optional[str] = None
    goal: Optional[str] = None


@app.get("/")
def root():
    return {
        "service": "Rhythm AI Service",
        "version": "2.0.0",
        "status": "running",
    }

from services.orchestrator import generate_daily_plan

@app.post("/morning-plan")
async def generate_morning_plan(request: Request):
    body = await request.json()

    profile = body.get("profile", {})
    checkin = body.get("checkin", {})

    result = generate_daily_plan(profile, checkin)

    return result


@app.post("/recovery-plan")
def generate_recovery_plan(request: RecoveryRequest):
    req_data = request.model_dump()

    plan = generate_post_workout_plan(
        weight=float(req_data.get("weight") or 60.0),
        intensity=req_data.get("intensity") or "Moderate",
        duration=int(req_data.get("duration") or 45),
        workout_type=req_data.get("workoutType") or "Strength Training",
        goal=req_data.get("goal") or "Maintenance",
        phase=req_data.get("phase") or "Follicular",
        rpe=req_data.get("rpe"),
        muscleSoreness=req_data.get("muscleSoreness"),
    )

    return {
        "status": plan.get("status", "Good"),
        "score": plan.get("score", 75),
        "recoveryDemand": plan.get("recoveryDemand", "Moderate"),
        "estimatedRecovery": plan.get("estimatedRecovery", "12–24 hours"),
        "coachTone": plan.get("coachTone", "Encourage"),
        "coachSummary": plan.get("coachSummary"),
        "coachMessage": plan.get("coachMessage") or plan.get("recoveryTip"),
        "tomorrowRecommendation": plan.get("tomorrowRecommendation"),
        "confidence": plan.get("confidence", 90),
        "stages": plan.get("stages", []),
        "timeline": plan.get("timeline", []),
        "recoveryNutrition": {
            "priorityNutrients": plan.get("priorityNutrients", []),
            "recoveryFoods": plan.get("recommendedFoods", []),
            "foods": plan.get("recommendedFoods", []),
            "checklist": plan.get("checklist", []),
            "hydration": plan.get("hydration"),
            "recoveryTip": plan.get("recoveryTip"),
            "macros": {
                "calories": plan.get("calories"),
                "protein": plan.get("protein"),
                "carbs": plan.get("carbs"),
                "fats": plan.get("fats"),
            },
        },
        "recoveryFocus": plan.get("recoveryFocus") or {"title": "Today's Recovery Focus", "items": plan.get("priorityNutrients", [])},
        "message": (
            plan.get("coachSummary")
            or plan.get("coachMessage")
        )
    }