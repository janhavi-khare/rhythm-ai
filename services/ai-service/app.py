import sys
from pathlib import Path

SERVICE_DIR = Path(__file__).resolve().parent
ROOT_DIR = SERVICE_DIR.parent.parent

for path in [
    str(SERVICE_DIR),
    str(SERVICE_DIR / "services"),
    str(SERVICE_DIR / "services" / "nutrition"),
    str(SERVICE_DIR / "services" / "predictors"),
    str(ROOT_DIR),
    str(ROOT_DIR / "services"),
]:
    if path not in sys.path:
        sys.path.append(path)

from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import Optional, Union, List

try:
    from services.orchestrator import generate_daily_plan
except ModuleNotFoundError:
    from orchestrator import generate_daily_plan

try:
    from services.recovery_engine import generate_post_workout_plan
except ModuleNotFoundError:
    try:
        from recovery_engine import generate_post_workout_plan
    except ModuleNotFoundError:
        try:
            from services.nutrition.post_workout_nutrition import generate_post_workout_plan
        except ModuleNotFoundError:
            from post_workout_nutrition import generate_post_workout_plan

app = FastAPI(
    title="Rhythm AI Service",
    version="2.0.0"
)


class MorningCheckIn(BaseModel):
    cycleDay: Optional[int] = 14
    sleepQuality: Optional[str] = "Good"
    mood: Optional[Union[int, str]] = None
    subjectiveEnergy: Optional[Union[int, str]] = None
    energy: Optional[Union[int, str]] = None
    bloating: Optional[str] = None
    cravings: Optional[str] = None
    workoutType: Optional[str] = None
    workoutIntensity: Optional[str] = None
    plannedWorkoutTime: Optional[str] = None
    goals: Optional[List[str]] = None
    soreness: Optional[str] = None
    stress: Optional[str] = None
    yesterdayWorkout: Optional[str] = None
    targetIntensity: Optional[str] = None


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


@app.post("/morning-plan")
async def generate_morning_plan(request: Request):
    body = await request.json()

    profile = body.get("profile", {})
    checkin = body.get("checkin", {})

    print("\n========== PROFILE ==========")
    print(profile)

    print("\n========== CHECKIN ==========")
    print(checkin)

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
            "checklist": [
                f"Hydration target: {plan.get('hydration')}",
                f"Electrolytes: {'Recommended' if plan.get('electrolytes') else 'Optional'}",
                f"Recovery tip: {plan.get('recoveryTip')}",
                f"Phase guidance: {plan.get('phaseTip')}",
            ],
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
        "message": plan.get("coachMessage") or (
            f"Post-workout plan: {plan.get('calories')} kcal target "
            f"({plan.get('protein')}g protein, {plan.get('carbs')}g carbs)."
        ),
    }