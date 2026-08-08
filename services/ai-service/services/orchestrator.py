import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

ML_DIR = ROOT_DIR / "ML"
if str(ML_DIR) not in sys.path:
    sys.path.append(str(ML_DIR))

from biological_variables import compute_all_biological_variables

from services.phase_predictor import predict_phase
from services.workout_decision import generate_workout_plan
from services.pre_workout_nutrition import generate_pre_workout_plan
from builders.daily_plan_builder import build_daily_plan


def generate_daily_plan(profile, checkin):
    """
    Rhythm AI Orchestrator

    Flow:
    Phase Prediction
            ↓
    Biological Variables
            ↓
    Workout Decision
            ↓
    Nutrition
            ↓
    Daily Plan Builder
    """

    # --------------------------------------------------
    # Phase Prediction
    # --------------------------------------------------
    print("1. Phase prediction")

    phase = predict_phase(checkin)
    phase_name = phase.get("prediction", "Follicular")

    # --------------------------------------------------
    # Biological Variables
    # --------------------------------------------------
    print("2. Biological variables")

    body_state = compute_all_biological_variables(
        profile=profile,
        checkin=checkin,
        phase_name=phase_name,
    )

    readiness = body_state["readiness"]
    fatigue = body_state["fatigue"]
    recovery = body_state["recovery"]
    rhythm = body_state["rhythmScore"]
    confidence = body_state["confidence"]

    # --------------------------------------------------
    # Workout Inputs
    # --------------------------------------------------

    workout_type = checkin.get("workoutType") or "Strength Training"

    goal = (profile.get("goals") or ["Maintenance"])[0]

    subjective_energy = int(
        checkin.get("subjectiveEnergy")
        if checkin.get("subjectiveEnergy") is not None
        else checkin.get("energy", 3)
    )

    raw_soreness = (
        checkin.get("muscleSoreness")
        if checkin.get("muscleSoreness") is not None
        else checkin.get("soreness", "Moderate")
    )

    SORENESS_MAP = {
        "None": 0,
        "Mild": 1,
        "Moderate": 3,
        "Severe": 5,
    }

    if isinstance(raw_soreness, str):
        muscle_soreness = SORENESS_MAP.get(raw_soreness, 3)
    else:
        muscle_soreness = int(raw_soreness)

    # --------------------------------------------------
    # Workout Recommendation
    # --------------------------------------------------
    print("3. Workout")

    workout_decision = generate_workout_plan(
        recovery_score=recovery["score"],
        fatigue_score=fatigue["score"],
        energy=subjective_energy,
        muscle_soreness=muscle_soreness,
        goal=goal,
        planned_workout_type=workout_type,
        available_time=int(checkin.get("availableTime", 60)),
        sleep_quality=checkin.get("sleepQuality", "Good"),
        phase=phase_name,
        checkin=checkin,
        profile=profile,
        is_recovery_estimated=False,
    )

    # --------------------------------------------------
    # Nutrition
    # --------------------------------------------------
    print("4. Nutrition")

    pre_workout = generate_pre_workout_plan(
        weight=float(profile.get("weight") or 60),
        intensity=workout_decision.get("intensity", "Moderate"),
        workout_type=workout_type,
        workout_time=checkin.get(
            "plannedWorkoutTime",
            "Morning",
        ),
        goal=goal,
        phase=phase_name,
    )

    # --------------------------------------------------
    # Build UI Payload
    # --------------------------------------------------
    print("5. Build")

    today_plan = build_daily_plan(
        profile=profile,
        checkin=checkin,
        phase=phase,
        readiness=readiness,
        fatigue=fatigue,
        workout=workout_decision,
        nutrition=pre_workout,
    )

    # --------------------------------------------------
    # Response
    # --------------------------------------------------

    return {
        "todayPlan": today_plan,
        "predictions": {
            "readiness": readiness,
            "fatigue": fatigue,
            "recovery": recovery,
            "rhythm": rhythm,
            "confidence": confidence,
        },
    }