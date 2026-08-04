from typing import Dict, List, Optional, Union, Any

MEAL_LOOKUP = {
    "High": ["Rice + Paneer + Vegetables", "Greek Yogurt + Banana", "Chicken + Rice", "Dal + Roti + Salad"],
    "Moderate": ["Paneer Wrap + Fruit", "Greek Yogurt + Honey", "Dal + Roti", "Chicken Sandwich"],
    "Light": ["Fruit Smoothie", "Curd + Oats", "Coconut Water + Banana", "Lentil Soup + Toast"],
}

FOODS_LOOKUP = {
    "High": ["Chicken", "Paneer", "Rice", "Greek Yogurt", "Banana", "Eggs", "Oats"],
    "Moderate": ["Paneer", "Greek Yogurt", "Banana", "Curd", "Oats", "Fruit"],
    "Light": ["Banana", "Curd", "Coconut Water", "Apple", "Soup", "Toast"],
}

PRIORITY_NUTRIENTS_MAP = {
    "menstrual": ["Iron", "Vitamin C", "Magnesium"],
    "follicular": ["Protein", "Complex Carbs", "Electrolytes"],
    "ovulation": ["Protein", "Electrolytes", "Hydration"],
    "early luteal": ["Protein", "Healthy Fats", "Magnesium"],
    "late luteal": ["Magnesium", "Vitamin B6", "Fiber"],
}

COACH_MESSAGES = {
    "Celebrate": "Excellent effort today. Recovery is your next workout.",
    "Encourage": "Solid session completed! Small recovery habits now compound into performance.",
    "Recover": "Heavy session demand today. Give your body full space to adapt and repair.",
    "Educate": "Consistency beats intensity. Nourish your body and allow physiological rest.",
}


def _norm(val: Optional[str]) -> str:
    return str(val or "").strip().lower()


def _build_recovery_metrics(rec_score: float, fatigue_score: float, intensity: str, duration: int, soreness: str, rpe: Optional[float]) -> Dict[str, Any]:
    sore = _norm(soreness)
    i_norm = _norm(intensity)
    rpe_val = rpe or 6.0

    # Status (Athlete state)
    if rec_score < 40 or fatigue_score >= 75 or (i_norm == "high" and duration >= 70):
        status = "Recovery Priority"
    elif rec_score < 60 or fatigue_score >= 55 or sore in ["severe", "high", "strong"]:
        status = "Needs Attention"
    elif rec_score >= 80 and fatigue_score < 35:
        status = "Excellent"
    else:
        status = "Good"

    # Recovery Demand (Workout demand)
    demand_score = (3 if i_norm == "high" else (2 if i_norm == "moderate" else 1)) + (3 if duration >= 60 else (2 if duration >= 45 else 1)) + (3 if rpe_val >= 8 else (2 if rpe_val >= 5 else 1))
    recovery_demand = "High" if demand_score >= 7 else ("Moderate" if demand_score >= 4 else "Low")

    # Estimated Recovery Time
    if recovery_demand == "High" or status == "Recovery Priority":
        estimated_recovery = "24–48 hours"
    elif recovery_demand == "Moderate":
        estimated_recovery = "12–24 hours"
    else:
        estimated_recovery = "6–12 hours"

    return {
        "status": status,
        "score": int(rec_score),
        "recoveryDemand": recovery_demand,
        "estimatedRecovery": estimated_recovery,
        "load": recovery_demand,
        "recoveryLoad": {"load": recovery_demand, "score": demand_score},
    }


def _build_body_status(rec_score: float, fatigue_score: float, soreness: str, electrolytes: bool) -> Dict[str, str]:
    sore = _norm(soreness)
    energy_label = "Optimal" if rec_score >= 80 else ("Recovering" if rec_score >= 50 else "Depleted")
    hydration_label = "Needs Attention" if electrolytes else "Optimal"
    muscle_label = "High Soreness" if sore in ["severe", "high"] else ("Moderate Fatigue" if fatigue_score >= 50 or sore == "moderate" else "Mild Strain")
    return {"energy": energy_label, "hydration": hydration_label, "muscles": muscle_label}


def _build_nutrition_module(weight: float, intensity: str, duration: int, goal: str, rec_score: float, phase: str) -> Dict[str, Any]:
    i_norm = _norm(intensity)
    p_mult = 0.45 if "muscle" in _norm(goal) else (0.38 if "fat" in _norm(goal) else 0.4)
    c_mult = 1.1 if i_norm == "high" else (0.8 if i_norm == "moderate" else 0.5)
    
    protein = round(weight * p_mult, 1)
    carbs = round(weight * c_mult, 1)
    fats = round(weight * 0.2, 1)
    calories = int(protein * 4 + carbs * 4 + fats * 9)

    base_h = max(600, int(weight * 12)) + max(0, duration - 30) * 8 + (250 if i_norm == "high" else (150 if i_norm == "moderate" else 0))
    hydration_target = f"{max(500, base_h - 100)}–{base_h + 150} mL"
    electrolytes = duration >= 60 or i_norm == "high" or rec_score < 50

    priority_nutrients = PRIORITY_NUTRIENTS_MAP.get(_norm(phase), ["Protein", "Complex Carbs", "Electrolytes"])
    rec_foods = FOODS_LOOKUP.get(intensity.capitalize() if intensity else "Moderate", FOODS_LOOKUP["Moderate"])
    meal_suggestions = MEAL_LOOKUP.get(intensity.capitalize() if intensity else "Moderate", MEAL_LOOKUP["Moderate"])

    return {
        "protein": protein, "carbs": carbs, "fats": fats, "calories": calories,
        "hydration": hydration_target, "electrolytes": electrolytes,
        "priorityNutrients": priority_nutrients, "recoveryFoods": rec_foods, "foods": rec_foods,
        "mealSuggestions": meal_suggestions,
    }


def _build_checklist_module(hydration_target: str, protein: float, carbs: float, electrolytes: bool) -> List[Dict[str, Any]]:
    items = [
        {"id": "hydration", "label": f"Drink {hydration_target} fluids after training.", "completed": False},
        {"id": "protein", "label": f"Consume {int(protein)}g protein within 60 minutes.", "completed": False},
        {"id": "carbs", "label": f"Include {int(carbs)}g carbs to replenish energy.", "completed": False},
        {"id": "sleep", "label": "Prioritize 8 hours of sleep tonight.", "completed": False},
        {"id": "mobility", "label": "Perform 5-10 minutes of post-workout light stretching.", "completed": False},
        {"id": "recovery-meal", "label": "Keep next meal protein-forward and balanced.", "completed": False},
    ]
    if electrolytes:
        items.append({"id": "electrolytes", "label": "Replace electrolytes lost during training.", "completed": False})
    return items


def _build_coach_module(metrics: Dict[str, Any], nutrition: Dict[str, Any], duration: int, intensity: str, phase: str) -> Dict[str, Any]:
    demand = metrics["recoveryDemand"]
    status = metrics["status"]
    
    if demand == "High" or status == "Recovery Priority":
        tone = "Recover"
        tomorrow = "Recovery Recommended"
    elif intensity.capitalize() == "High":
        tone = "Celebrate"
        tomorrow = "Light Movement Focus"
    elif status == "Excellent":
        tone = "Encourage"
        tomorrow = "High Intensity Appropriate"
    else:
        tone = "Educate"
        tomorrow = "Ready for Moderate Strength"

    summary = f"Today's {duration}-min session created a {demand.lower()} recovery demand. Prioritize hydration and {int(nutrition['protein'])}g protein within the next hour."
    message = COACH_MESSAGES.get(tone, "Recovery is where progress happens.")

    stages = [
        {"title": "Refuel", "description": "Protein + carbohydrates"},
        {"title": "Rehydrate", "description": "Water + electrolytes"},
        {"title": "Repair", "description": "Sleep and mobility"},
        {"title": "Adapt", "description": "Allow physiological recovery"},
    ]

    return {
        "coachTone": tone, "coachSummary": summary, "coachMessage": message,
        "tomorrowRecommendation": tomorrow, "stages": stages,
    }


def generate_post_workout_plan(
    weight: float = 60.0,
    workoutType: str = "Strength Training",
    intensity: str = "Moderate",
    duration: int = 45,
    rpe: Optional[float] = None,
    muscleSoreness: Optional[str] = None,
    goal: Optional[str] = "Build Muscle",
    phase: str = "Follicular",
    **kwargs,
) -> Dict[str, Any]:
    """
    Rhythm Recovery Intelligence Engine - Single Source of Truth for Post-Workout Recovery.
    """
    w_type = kwargs.get("workout_type") or workoutType or "Strength Training"
    soreness = kwargs.get("soreness") or muscleSoreness or "None"
    u_goal = kwargs.get("goal") or goal or "Build Muscle"
    u_phase = kwargs.get("phase") or phase or "Follicular"
    norm_intensity = intensity.capitalize() if intensity else "Moderate"

    rec_score = float(kwargs.get("recovery_score") or kwargs.get("recovery") or 75.0)
    fatigue_score = float(kwargs.get("fatigue_score") or kwargs.get("fatigue") or max(10.0, 100.0 - rec_score))

    # Build Modules
    metrics = _build_recovery_metrics(rec_score, fatigue_score, norm_intensity, duration, soreness, rpe)
    nutrition = _build_nutrition_module(weight, norm_intensity, duration, u_goal, rec_score, u_phase)
    body_status = _build_body_status(rec_score, fatigue_score, soreness, nutrition["electrolytes"])

    try:
        from services.nutrition.checklist_generator import generate_post_workout_checklist
    except ModuleNotFoundError:
        try:
            from nutrition.checklist_generator import generate_post_workout_checklist
        except ModuleNotFoundError:
            from checklist_generator import generate_post_workout_checklist

    checklist = generate_post_workout_checklist(
        phase=u_phase,
        goals=u_goal,
        workout_intensity=norm_intensity,
        workout_duration=duration,
        workout_type=w_type,
        hydration_target=nutrition["hydration"],
        priority_nutrients=nutrition["priorityNutrients"],
        recovery_score=rec_score,
        soreness=soreness,
    )
    coach = _build_coach_module(metrics, nutrition, duration, norm_intensity, u_phase)

    # Priorities & Recovery Focus
    priorities = ["Protein", "Hydration", "Sleep"]
    if nutrition["electrolytes"] and "Electrolytes" not in priorities:
        priorities[2] = "Electrolytes"
    if _norm(soreness) in ["high", "severe", "strong"]:
        priorities[2] = "Magnesium"

    # Expanded 4-Step Timeline
    low_hyd = nutrition["hydration"].split("–")[0]
    timeline = [
        {"time": "Immediately", "task": f"Rehydrate with {low_hyd} mL water" + (" + Electrolytes" if nutrition["electrolytes"] else "")},
        {"time": "Within 60 min", "task": f"Recovery Meal ({int(nutrition['protein'])}g protein + {int(nutrition['carbs'])}g carbs)"},
        {"time": "Tonight", "task": "Prioritize 8 hours of quality sleep for muscle repair"},
        {"time": "Tomorrow Morning", "task": f"{coach['tomorrowRecommendation']} — assess soreness before training"},
    ]

    # Data Completeness Confidence Calculation
    confidence_val = 100
    if rpe is None: confidence_val -= 10
    if muscleSoreness is None and kwargs.get("soreness") is None: confidence_val -= 5
    if kwargs.get("sleep") is None and kwargs.get("sleepQuality") is None: confidence_val -= 10
    if not workoutType and not kwargs.get("workout_type"): confidence_val -= 5
    confidence = max(50, confidence_val)

    # Reasoning
    reasoning = [
        {"type": "Workout", "text": f"{duration}-minute {norm_intensity.lower()} session generated {metrics['recoveryDemand'].lower()} recovery demand."},
        {"type": "Recovery", "text": f"Recovery score of {int(rec_score)}/100 status set to {metrics['status']}."},
        {"type": "Phase", "text": f"{u_phase} phase guidance prioritized {', '.join(nutrition['priorityNutrients'][:2])}."},
    ]
    reasons = [f"[{r['type']}] {r['text']}" for r in reasoning]

    # Single Consolidated Dictionary
    return {
        # Legacy fields
        "protein": nutrition["protein"],
        "carbs": nutrition["carbs"],
        "fats": nutrition["fats"],
        "calories": nutrition["calories"],
        "hydration": nutrition["hydration"],
        "electrolytes": nutrition["electrolytes"],
        "recoveryFoods": nutrition["recoveryFoods"],
        "foods": nutrition["foods"],
        "priorityNutrients": nutrition["priorityNutrients"],
        "recoveryTip": coach["coachSummary"],
        "phaseTip": f"{u_phase} phase recovery guidance applied.",
        "checklist": checklist,
        "mealSuggestions": nutrition["mealSuggestions"],
        "reasoning": reasoning,
        "reasons": reasons,
        # Recovery Intelligence Engine fields
        "status": metrics["status"],
        "score": metrics["score"],
        "recoveryDemand": metrics["recoveryDemand"],
        "estimatedRecovery": metrics["estimatedRecovery"],
        "load": metrics["load"],
        "recoveryLoad": metrics["recoveryLoad"],
        "bodyStatus": body_status,
        "priorities": priorities,
        "timeline": timeline,
        "todayRecoveryFocus": priorities,
        "recoveryFocus": {
            "title": "Today's Recovery Focus",
            "items": priorities,
        },
        "coachTone": coach["coachTone"],
        "coachSummary": coach["coachSummary"],
        "coachMessage": coach["coachMessage"],
        "tomorrowRecommendation": coach["tomorrowRecommendation"],
        "confidence": confidence,
        "stages": coach["stages"],
    }


generate_recovery_plan = generate_post_workout_plan
calculate_recovery_plan = generate_post_workout_plan


if __name__ == "__main__":
    from pprint import pprint
    plan = generate_post_workout_plan(
        weight=60.0, workoutType="Strength Training", intensity="High", duration=60,
        rpe=8.0, muscleSoreness="Moderate", goal="Build Muscle", phase="Follicular", recovery_score=78.0,
    )
    pprint(plan)
