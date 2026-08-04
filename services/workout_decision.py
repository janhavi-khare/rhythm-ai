from typing import Dict, List, Optional, Union, Any


def calculate_readiness(recovery_score: float) -> str:
    """
    Determine readiness level based on recovery score.
    """
    if recovery_score >= 80:
        return "High"
    elif recovery_score >= 60:
        return "Moderate"
    elif recovery_score >= 40:
        return "Recovery"
    return "Rest"


def calculate_intensity(
    readiness: str,
    energy: int,
    muscle_soreness: int,
    recovery_score: float = 70.0,
    fatigue_score: float = 30.0,
    sleep_quality: str = "Good",
) -> str:
    """
    Determine workout intensity dynamically using Level 1 & Level 2 inputs.
    """
    if readiness == "Rest" or recovery_score < 30:
        return "Rest" if recovery_score < 25 else "Very Light"

    if readiness == "Recovery":
        return "Very Light"

    # Base intensity from readiness and energy
    if readiness == "Moderate":
        if muscle_soreness >= 4 or fatigue_score >= 65:
            base_intensity = "Light"
        elif energy >= 4:
            base_intensity = "Moderate"
        else:
            base_intensity = "Light"
    else:  # High Readiness
        if muscle_soreness >= 4:
            base_intensity = "Moderate"
        elif energy >= 4:
            base_intensity = "High"
        else:
            base_intensity = "Moderate"

    levels = ["Rest", "Very Light", "Light", "Moderate", "High"]
    idx = levels.index(base_intensity)

    # Recovery < 40 -> Reduce 1 level
    if recovery_score < 40 and idx > 1:
        idx -= 1
    # Readiness > 80 & recovery >= 80 & high energy -> Increase 1 level if capped
    elif readiness == "High" and recovery_score >= 80 and energy >= 4 and idx < 4:
        idx = min(4, idx + 1)

    # High fatigue (>= 60) -> Reduce 1 level
    if fatigue_score >= 60 and idx > 1:
        idx -= 1

    return levels[idx]


def calculate_duration(
    readiness: str,
    available_time: int = 60,
    recovery_score: float = 70.0,
    fatigue_score: float = 30.0,
    sleep_quality: str = "Good",
) -> int:
    """
    Recommended workout duration based on base 45 min and Level 2 modifiers.
    """
    if readiness == "Rest":
        duration = 20
    elif readiness == "Recovery" or recovery_score < 40:
        duration = 30
    elif readiness == "Moderate":
        if sleep_quality in ["Poor", "Below Average"] or fatigue_score >= 60:
            duration = 35
        else:
            duration = 45
    else:  # High Readiness
        if recovery_score >= 80 and fatigue_score < 40 and sleep_quality in ["Good", "Very Good", "Excellent"]:
            duration = 60
        elif sleep_quality in ["Poor", "Below Average"] or fatigue_score >= 60:
            duration = 35
        else:
            duration = 45

    max_time = available_time if available_time and available_time > 0 else 60
    return min(duration, max_time)


def calculate_focus(
    goal: str,
    readiness: str,
    planned_workout_type: str = "Strength Training",
    recovery_score: float = 70.0,
    fatigue_score: float = 30.0,
    phase: str = "Follicular",
) -> str:
    """
    Decide workout objective/focus using Level 1 (Goal, Recovery, Readiness) as primary driver.
    """
    if readiness == "Rest" or recovery_score < 30:
        return "Recovery Session"

    if readiness == "Recovery" or recovery_score < 45:
        return "Mobility Focus"

    goal_lower = (goal or "").lower()

    if "muscle" in goal_lower or "strength" in goal_lower:
        if fatigue_score >= 70:
            return "Technique Focus"
        return "Build Strength"

    if "fat" in goal_lower or "loss" in goal_lower or "weight" in goal_lower:
        return "Improve Conditioning"

    if "endurance" in goal_lower or "cardio" in goal_lower:
        return "Improve Conditioning"

    if "mobility" in goal_lower or "flexibility" in goal_lower:
        return "Mobility Focus"

    if planned_workout_type and planned_workout_type not in ["Strength Training", "Strength"]:
        return planned_workout_type

    return "Build Strength"


def generate_reasons(
    recovery_score: float,
    energy: int,
    muscle_soreness: int,
) -> List[str]:
    """
    Legacy reasons generator.
    """
    reasons = []

    if recovery_score >= 80:
        reasons.append("Recovery score is excellent.")
    elif recovery_score >= 60:
        reasons.append("Recovery score is good.")
    elif recovery_score >= 40:
        reasons.append("Recovery score is below average.")
    else:
        reasons.append("Recovery score is low.")

    if energy >= 4:
        reasons.append("Energy level is high.")
    elif energy == 3:
        reasons.append("Energy level is moderate.")
    else:
        reasons.append("Energy level is low.")

    if muscle_soreness <= 2:
        reasons.append("Muscle soreness is minimal.")
    elif muscle_soreness == 3:
        reasons.append("Muscle soreness is moderate.")
    else:
        reasons.append("Muscle soreness is high.")

    return reasons


def generate_workout_plan(
    recovery_score: Any = 75.0,
    energy: int = 3,
    muscle_soreness: int = 2,
    goal: str = "Build Muscle",
    planned_workout_type: str = "Strength Training",
    available_time: int = 60,
    **kwargs,
) -> Dict[str, Any]:
    """
    Rhythm AI Training Coach Recommendation Engine.
    Synthesizes Level 1 (Goal, Recovery, Readiness), Level 2 (Fatigue, Sleep, Stress, Energy, Yesterday Workout),
    and Level 3 (Phase, Activity Level, Time) to deliver intelligent coach guidance.
    """
    if isinstance(recovery_score, dict):
        rec_val = recovery_score.get("score") or recovery_score.get("recovery") or recovery_score.get("recovery_score") or 75.0
        recovery_score = float(rec_val)
    elif recovery_score is None:
        recovery_score = 75.0
    else:
        try:
            recovery_score = float(recovery_score)
        except (ValueError, TypeError):
            recovery_score = 75.0

    checkin = kwargs.get("checkin", {})
    profile = kwargs.get("profile", {})

    # Extract & Normalize Inputs
    phase = kwargs.get("phase") or checkin.get("phase") or "Follicular"
    sleep_quality = kwargs.get("sleep_quality") or checkin.get("sleepQuality") or "Good"
    
    sleep_hours_raw = kwargs.get("sleep_hours") if kwargs.get("sleep_hours") is not None else checkin.get("sleepHours")
    sleep_hours = float(sleep_hours_raw) if sleep_hours_raw is not None else None

    fatigue_raw = kwargs.get("fatigue_score")
    if fatigue_raw is None and isinstance(kwargs.get("fatigue"), dict):
        fatigue_raw = kwargs.get("fatigue", {}).get("score")
    if fatigue_raw is None:
        fatigue_raw = max(10.0, 100.0 - recovery_score)
    fatigue_score = float(fatigue_raw)

    stress = kwargs.get("stress") or checkin.get("stress") or "Moderate"
    yesterday_workout = kwargs.get("yesterday_workout") or checkin.get("yesterdayWorkout")

    # Level 1 Core Calculations
    readiness = calculate_readiness(recovery_score)

    intensity = calculate_intensity(
        readiness=readiness,
        energy=energy,
        muscle_soreness=muscle_soreness,
        recovery_score=recovery_score,
        fatigue_score=fatigue_score,
        sleep_quality=sleep_quality,
    )

    duration = calculate_duration(
        readiness=readiness,
        available_time=available_time,
        recovery_score=recovery_score,
        fatigue_score=fatigue_score,
        sleep_quality=sleep_quality,
    )

    workout_objective = calculate_focus(
        goal=goal,
        readiness=readiness,
        planned_workout_type=planned_workout_type,
        recovery_score=recovery_score,
        fatigue_score=fatigue_score,
        phase=phase,
    )
    focus = workout_objective

    # Internal Training Style Mapping
    if workout_objective in ["Build Strength", "Technique Focus"]:
        training_style = "Strength"
    elif workout_objective == "Improve Conditioning":
        training_style = "Cardio"
    elif workout_objective == "Mobility Focus":
        training_style = "Mobility"
    elif workout_objective == "Recovery Session":
        training_style = "Recovery"
    else:
        training_style = "Mixed"

    # Coach Tone Determination
    if readiness == "High" and recovery_score >= 80 and fatigue_score < 35:
        coach_tone = "Push"
    elif readiness in ["Rest", "Recovery"] or recovery_score < 40 or fatigue_score >= 70:
        coach_tone = "Recover"
    elif fatigue_score >= 55 or (phase == "Late Luteal" and energy <= 2):
        coach_tone = "Deload"
    else:
        coach_tone = "Balanced"

    # Rhythm Body Status Snapshot
    energy_label = "Optimal" if energy >= 4 else ("Stable" if energy == 3 else "Low")
    recovery_label = "Optimal" if recovery_score >= 80 else ("Good" if recovery_score >= 60 else ("Below Average" if recovery_score >= 40 else "Low"))
    training_readiness_label = readiness

    body_status = {
        "energy": energy_label,
        "recovery": recovery_label,
        "trainingReadiness": training_readiness_label,
    }

    # Data-Driven Confidence Score Calculation
    confidence_score = 100
    if sleep_hours is None or sleep_quality is None:
        confidence_score -= 10
    if muscle_soreness is None:
        confidence_score -= 5
    if not yesterday_workout:
        confidence_score -= 5
    if kwargs.get("is_recovery_estimated", False):
        confidence_score -= 15

    confidence = max(50, min(100, confidence_score))

    # Structured Volume
    if readiness == "High" and fatigue_score < 40 and training_style == "Strength":
        volume = {
            "label": "High",
            "setsPerMovement": 4,
            "effort": "Leave 1 rep in reserve",
        }
    elif readiness in ["Rest", "Recovery"] or fatigue_score >= 70 or training_style in ["Recovery", "Mobility"]:
        volume = {
            "label": "Low",
            "setsPerMovement": 2,
            "effort": "Light dynamic movement",
        }
    else:
        volume = {
            "label": "Moderate",
            "setsPerMovement": 3,
            "effort": "Leave 2 reps in reserve",
        }

    # Training Load Score & Label Calculation
    intensity_weights = {"Rest": 1, "Very Light": 2, "Light": 3, "Moderate": 4, "High": 5}
    vol_weights = {"Low": 1, "Moderate": 2, "High": 3}
    
    i_w = intensity_weights.get(intensity, 3)
    d_w = duration / 60.0
    v_w = vol_weights.get(volume["label"], 2)

    raw_load = (i_w * 9) + (d_w * 35) + (v_w * 10)  # max ~ 45 + 35 + 30 = 110
    load_score = min(100, max(15, int(round((raw_load / 100.0) * 100))))

    if load_score >= 75:
        load_label = "High"
    elif load_score >= 45:
        load_label = "Medium"
    else:
        load_label = "Low"

    training_load = {
        "label": load_label,
        "score": load_score,
    }

    # Rest Intervals
    if training_style == "Strength":
        rest_intervals = "90–120 sec"
    elif training_style == "Cardio":
        rest_intervals = "30–45 sec"
    elif training_style in ["Mobility", "Recovery"]:
        rest_intervals = "As Needed"
    else:
        rest_intervals = "60–90 sec"

    # Structured Warm-up & Cooldown Stages
    if readiness in ["Rest", "Recovery"] or muscle_soreness >= 4:
        warmup_duration = 10
    elif readiness == "Moderate" or muscle_soreness >= 3:
        warmup_duration = 8
    else:
        warmup_duration = 5

    warmup = {
        "duration": warmup_duration,
        "stages": [
            "Raise Heart Rate",
            "Dynamic Mobility",
            "Movement Preparation",
        ],
    }

    cooldown_duration = 10 if muscle_soreness >= 3 or intensity == "High" else 5
    cooldown = {
        "duration": cooldown_duration,
        "stages": [
            "Walk",
            "Stretch",
            "Breathing",
        ],
    }

    # Today's Priorities
    if training_style == "Strength":
        priorities = ["Progressive Overload", "Movement Quality", "Protein Intake"]
    elif training_style == "Cardio":
        priorities = ["Pacing & Sustained Effort", "Hydration Target", "Post-Workout Refuel"]
    elif training_style in ["Mobility", "Recovery"]:
        priorities = ["Joint Decompression", "Active Circulation", "Sleep Protocol"]
    else:
        priorities = ["Movement Quality", "Hydration Target", "Post-Workout Recovery"]

    # Recovery Focus
    if intensity in ["High", "Moderate"]:
        today_recovery_focus = ["Protein", "Hydration", "Sleep"]
    else:
        today_recovery_focus = ["Mobility", "Hydration", "Rest"]

    recovery_focus = {
        "title": "Recovery Focus",
        "items": today_recovery_focus,
    }

    # Coach Summary & Coach Message
    if coach_tone == "Push":
        coach_summary = f"Your high recovery ({round(recovery_score)}/100) and readiness qualify you for a high-output strength session today."
        coach_message = "Focus on quality reps rather than chasing fatigue."
    elif coach_tone == "Recover":
        coach_summary = f"Recovery score ({round(recovery_score)}/100) indicates reduced capacity; today's duration and volume are scaled back for restoration."
        coach_message = "Recovery is productive training. Give your body the chance to adapt."
    elif coach_tone == "Deload":
        coach_summary = f"Elevated fatigue ({round(fatigue_score)}/100) means reducing total training load today while maintaining good technique."
        coach_message = "Keep your effort controlled and prioritize rest between sets."
    else:
        coach_summary = f"You're recovered enough for a productive {workout_objective.lower()} session, with controlled intensity to manage fatigue."
        coach_message = "Today is about quality over quantity. Keep your effort controlled and prioritize recovery between sets."

    # Structured Reasoning List
    reasoning = [
        {
            "type": "Recovery",
            "text": f"Recovery score ({round(recovery_score)}/100) supports {training_style.lower()} training.",
        },
        {
            "type": "Sleep",
            "text": f"Sleep quality ({sleep_quality}) kept target intensity at {intensity}.",
        },
        {
            "type": "Goal",
            "text": f"Goal ({goal}) selected {workout_objective} as today's objective.",
        },
        {
            "type": "Fatigue",
            "text": f"Fatigue score ({round(fatigue_score)}/100) set training load to {load_label} ({load_score}/100).",
        },
        {
            "type": "Soreness",
            "text": f"Muscle soreness level ({muscle_soreness}/5) determined {warmup_duration}-min warmup and {cooldown_duration}-min cooldown.",
        },
        {
            "type": "Phase",
            "text": f"{phase} phase guidance tuned rest intervals to {rest_intervals}.",
        },
    ]

    reasons = [f"[{r['type']}] {r['text']}" for r in reasoning]

    return {
        "readiness": readiness,
        "intensity": intensity,
        "duration": duration,
        "focus": focus,
        "workoutObjective": workout_objective,
        "trainingStyle": training_style,
        "coachTone": coach_tone,
        "trainingLoad": training_load,
        "confidence": confidence,
        "bodyStatus": body_status,
        "priorities": priorities,
        "coachSummary": coach_summary,
        "coachMessage": coach_message,
        "volume": volume,
        "restIntervals": rest_intervals,
        "warmup": warmup,
        "cooldown": cooldown,
        "todayRecoveryFocus": today_recovery_focus,
        "recoveryFocus": recovery_focus,
        "reasoning": reasoning,
        "reasons": reasons,
    }


if __name__ == "__main__":
    plan = generate_workout_plan(
        recovery_score=82,
        energy=5,
        muscle_soreness=2,
        goal="Build Muscle",
        planned_workout_type="Strength",
        available_time=60,
    )

    from pprint import pprint
    pprint(plan)