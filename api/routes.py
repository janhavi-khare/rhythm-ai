import joblib
import pandas as pd
from fastapi import APIRouter, HTTPException
from datetime import date

# Import your existing code
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.cycle_calculator import calculate_cycle_day, determine_phase, get_phase_info
from engine.nutrition_engine import get_recommendation
from api.models import DailyLogInput, RecommendationResponse

# ── Load ML models once at startup ───────────────────────
# These load into memory when the server starts,
# not on every request — this keeps responses fast
try:
    model = joblib.load("ML/phase_classifier.pkl")
    label_encoder = joblib.load("ML/label_encoder.pkl")
    print("✓ ML models loaded successfully")
except Exception as e:
    print(f"✗ Failed to load ML models: {e}")
    model = None
    label_encoder = None

router = APIRouter()

# ── Helper: convert sleep_hours float to sleep_quality string ──
def hours_to_sleep_quality(hours: float) -> str:
    if hours < 5:
        return "<5 hours"
    elif hours < 7:
        return "5-6 hours"
    elif hours <= 8:
        return "7-8 hours"
    else:
        return ">8 hours"


def sleep_quality_to_numeric(sleep_quality: str) -> int:
    mapping = {
        "<5 hours": 0,
        "5-6 hours": 1,
        "7-8 hours": 2,
        ">8 hours": 3,
    }
    if sleep_quality not in mapping:
        raise ValueError(f"Unsupported sleep_quality: {sleep_quality}")
    return mapping[sleep_quality]


# ── The main endpoint ─────────────────────────────────────
@router.post("/recommend", response_model=RecommendationResponse)
def recommend(log: DailyLogInput):

    # 1. Calculate cycle day from period start date
    today = date.today()
    cycle_day = calculate_cycle_day(
        log.period_start_date,
        today,
        cycle_length=log.cycle_length
    )

    # 2. Predict phase using ML model
    if model is None or label_encoder is None:
        raise HTTPException(
            status_code=500,
            detail="ML model not loaded. Check that pkl files exist in ml/ folder."
        )

    features = pd.DataFrame([{
        "cycle_day": cycle_day,
        "sleep_quality": sleep_quality_to_numeric(log.sleep_quality),
        "energy": log.energy,
        "mood": log.mood,
        "bloating": int(log.bloating),
        "cravings": log.craving_intensity
    }])

    raw_prediction = model.predict(features)
    if raw_prediction.dtype.kind in "OUS" or isinstance(raw_prediction[0], str):
        predicted_phase = raw_prediction[0]
    else:
        predicted_phase = label_encoder.inverse_transform(raw_prediction)[0]

    # 3. Get phase description
    phase_info = get_phase_info(predicted_phase)

    # 4. Run nutrition engine
    sleep_quality = hours_to_sleep_quality(log.sleep_hours)

    try:
        nutrition = get_recommendation(
            phase=predicted_phase,
            workout_type=log.workout_type,
            intensity=log.intensity,
            sleep_quality=sleep_quality,
            goal=log.goal
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 5. Build and return response
    return RecommendationResponse(
        predicted_phase=predicted_phase,
        phase_label=phase_info.get("label", predicted_phase),
        phase_description=phase_info.get("description", ""),
        priority_nutrients=nutrition["priority_nutrients"],
        priority_lifestyle=nutrition["priority_lifestyle"],
        nutrient_levels=nutrition["nutrient_levels"],
        nutrient_scores=nutrition["nutrient_scores"],
        checklist=nutrition["checklist"],
        food_suggestions=nutrition["food_suggestions"],
        intensity_advice=nutrition["intensity_advice"]
    )


# ── Health check endpoint ─────────────────────────────────
@router.get("/health")
def health():
    return {
        "status": "ok",
        "models_loaded": model is not None
    }