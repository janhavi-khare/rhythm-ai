import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

ML_DIR = ROOT_DIR / "ML"
if str(ML_DIR) not in sys.path:
    sys.path.append(str(ML_DIR))

ML_RECOVERY_DIR = ML_DIR / "recovery"
if str(ML_RECOVERY_DIR) not in sys.path:
    sys.path.append(str(ML_RECOVERY_DIR))

from services.predictors.phase_predictor import predict_phase
from services.workout_decision import generate_workout_plan
try:
    from services.pre_workout_nutrition import generate_pre_workout_plan
except ModuleNotFoundError:
    from services.nutrition.pre_workout_nutrition import generate_pre_workout_plan
from builders.daily_plan_builder import build_daily_plan

try:
    from explain_prediction import explain_prediction
    HAS_ML_RECOVERY = True
except Exception:
    HAS_ML_RECOVERY = False


def generate_daily_plan(profile, checkin):
    phase = predict_phase(checkin)
    phase_name = phase.get("prediction", "Follicular")

    workout_type = checkin.get("workoutType") or checkin.get("targetIntensity") or "Strength Training"
    sleep_quality = checkin.get("sleepQuality") or "Good"

    sleep_quality_map = {"Poor": 2, "Average": 3, "Good": 4, "Very Good": 5}
    sleep_quality_num = sleep_quality_map.get(sleep_quality, 3)

    raw_energy = checkin.get("subjectiveEnergy") if checkin.get("subjectiveEnergy") is not None else checkin.get("energy", 3)
    try:
        subjective_energy = int(raw_energy)
    except (ValueError, TypeError):
        subjective_energy = 3

    raw_mood = checkin.get("mood")
    if raw_mood is not None:
        try:
            mood = int(raw_mood)
        except (ValueError, TypeError):
            mood = 3
    else:
        mood = 3

    soreness_raw = checkin.get("muscleSoreness") if checkin.get("muscleSoreness") is not None else checkin.get("soreness")
    soreness_map = {"None": 0, "Mild": 1, "Moderate": 3, "Severe": 5}
    if isinstance(soreness_raw, str):
        muscle_soreness = soreness_map.get(soreness_raw, 2)
    elif soreness_raw is not None:
        try:
            muscle_soreness = int(soreness_raw)
        except (ValueError, TypeError):
            muscle_soreness = 2
    else:
        muscle_soreness = 2

    ml_input = {
        "phase": phase_name,
        "sleepHours": float(checkin.get("sleepHours", 7.5)),
        "sleepQuality": sleep_quality_num,
        "energy": int(subjective_energy),
        "mood": int(mood),
        "muscleSoreness": muscle_soreness,
        "sleepDebt": float(checkin.get("sleepDebt", 0.5)),
        "acuteLoad": float(checkin.get("acuteLoad", 35)),
        "chronicLoad": float(checkin.get("chronicLoad", 40)),
    }

    if HAS_ML_RECOVERY:
        try:
            recovery_ml = explain_prediction(ml_input)
            recovery_score = float(recovery_ml.get("recoveryScore", 78.0))
            positive_factors = recovery_ml.get("topPositiveFactors", [])
            negative_factors = recovery_ml.get("topNegativeFactors", [])
        except Exception:
            recovery_score = min(100.0, max(20.0, (subjective_energy * 14.0) + (mood * 6.0)))
            positive_factors = ["Good sleep quality", "Manageable training load"]
            negative_factors = ["Current phase demands"]
    else:
        recovery_score = min(100.0, max(20.0, (subjective_energy * 14.0) + (mood * 6.0)))
        positive_factors = ["Good sleep quality", "Manageable training load"]
        negative_factors = ["Current phase demands"]

    goals = profile.get("goals") or ["Maintenance"]
    goal = goals[0]

    fatigue_score = max(10, round(100 - recovery_score))

    workout_decision = generate_workout_plan(
        recovery_score=recovery_score,
        energy=int(subjective_energy),
        muscle_soreness=muscle_soreness,
        goal=goal,
        planned_workout_type=workout_type,
        available_time=int(checkin.get("availableTime", 60)),
        checkin=checkin,
        profile=profile,
        phase=phase_name,
        fatigue_score=fatigue_score,
        sleep_quality=sleep_quality,
        is_recovery_estimated=not HAS_ML_RECOVERY,
    )

    pre_workout = generate_pre_workout_plan(
        weight=float(profile.get("weight") or 60.0),
        intensity=workout_decision.get("intensity", "Moderate"),
        workout_type=workout_type,
        workout_time=checkin.get("plannedWorkoutTime", "Morning"),
        goal=goal,
        phase=phase_name,
    )

    fatigue_score = max(10, round(100 - recovery_score))

    readiness = {
        "score": round(recovery_score),
        "confidence": phase.get("confidence", 0.85),
        "category": workout_decision.get("readiness", "High"),
        "positiveFactors": positive_factors,
        "negativeFactors": negative_factors,
    }

    fatigue = {
        "score": fatigue_score,
        "confidence": 0.8,
        "category": "Low" if fatigue_score < 40 else "Moderate"
    }

    today_plan_payload = build_daily_plan(
        profile=profile,
        checkin=checkin,
        phase=phase,
        readiness=readiness,
        fatigue=fatigue,
        workout=workout_decision,
        nutrition=pre_workout,
    )

    return {
        "todayPlan": today_plan_payload,
        "predictions": {
            "recoveryScore": round(recovery_score),
            "energy": subjective_energy,
            "fatigue": fatigue_score
        }
    }
