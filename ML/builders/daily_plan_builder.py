from datetime import datetime

from builders.ui_labels import (
    get_phase_description,
    get_readiness_label,
    get_fatigue_label,
    get_workout_badge,
)


def build_daily_plan(
    profile,
    checkin,
    phase,
    readiness,
    fatigue,
    workout,
    nutrition,
):
    phase_name = phase.get("prediction")

    readiness_score = readiness.get("score", 0)
    fatigue_score = fatigue.get("score", 0)

    priority_nutrients = []

    for i, nutrient in enumerate(nutrition.get("priorityNutrients", [])):
        priority_nutrients.append({
        "rank": i + 1,
        "name": nutrient,
        "priority": "High Priority" if i == 0 else "Essential",
        "icon": "protein" if nutrient.lower() == "protein" else "water"
        })

    recommendation_factors = []

    if checkin.get("sleepQuality"):
        recommendation_factors.append(
            f"Sleep Quality: {checkin['sleepQuality']}"
        )

    if checkin.get("subjectiveEnergy"):
        recommendation_factors.append(
            f"Energy Level: {checkin['subjectiveEnergy']}/5"
        )

    if checkin.get("stress"):
        recommendation_factors.append(
            f"Stress Level: {checkin['stress']}"
        )

    if checkin.get("yesterdayWorkout"):
        recommendation_factors.append(
            f"Yesterday's Workout: {checkin['yesterdayWorkout']}"
        )

    recommendation_factors.append(
        f"Current Phase: {phase_name}"
    )

    try:
        from services.nutrition.checklist_generator import generate_pre_workout_checklist
    except ModuleNotFoundError:
        try:
            from nutrition.checklist_generator import generate_pre_workout_checklist
        except ModuleNotFoundError:
            from checklist_generator import generate_pre_workout_checklist

    dur_val = 45
    raw_dur = workout.get("duration")
    if isinstance(raw_dur, (int, float)):
        dur_val = int(raw_dur)

    items = generate_pre_workout_checklist(
        phase=phase_name,
        goals=profile.get("goals"),
        workout_intensity=workout.get("intensity", "Moderate"),
        workout_duration=dur_val,
        workout_type=workout.get("focus") or workout.get("workoutObjective") or "Strength Training",
        hydration_target=nutrition.get("hydration", "500–600 mL"),
        priority_nutrients=nutrition.get("priorityNutrients", []),
        recovery_score=readiness_score,
        soreness=checkin.get("muscleSoreness"),
        energy=checkin.get("subjectiveEnergy"),
        workout_time=checkin.get("plannedWorkoutTime"),
    )

    checklist = {
        "title": "Fuel Up Checklist",
        "subtitle": "Pre-Workout Preparation",
        "completed": sum(1 for item in items if item.get("completed")),
        "total": len(items),
        "items": items,
    }

    workout_title = workout.get("focus") or workout.get("workoutObjective") or "Today's Target Session"
    
    coming_soon_card = {
        "title": "AI Pattern Discovery",
        "badge": "Coming Soon",
        "body": (
            "Complete more check-ins and workouts to unlock personalized "
            "AI-driven insights about your recovery, cycle, and performance trends."
        ),
        "cta": "View Insights"
    }

    raw_hydration = nutrition.get("hydration", "500-600 mL")
    hydration_val = raw_hydration.replace(" mL", "") if isinstance(raw_hydration, str) else str(raw_hydration)

    return {
        "generatedAt": datetime.utcnow().isoformat(),

        "mode": "PRE_WORKOUT",

        "bodySnapshot": {

            "phase": {
                "name": phase_name,
                "description": get_phase_description(
                    phase_name
                ),
                "confidence": phase.get("confidence", 95),
            },

            "readiness": {
                "score": readiness_score,
                "label": get_readiness_label(
                    readiness_score
                ),
            },

            "fatigue": {
                "score": fatigue_score,
                "label": get_fatigue_label(
                    fatigue_score
                ),
            },

            "sleep": {
                "quality": checkin.get("sleepQuality", "Good"),
            },

            "energy": {
                "level": checkin.get(
                    "subjectiveEnergy", 3
                ),
            },

            "stress": {
                "level": checkin.get("stress", "Moderate")
            },

            "soreness": checkin.get(
                "muscleSoreness",
                "None"
            ),
        },


        "workout": {
            "title": workout_title,
            "displayTitle": workout_title,
            "duration": f"{workout.get('duration')} min" if isinstance(workout.get('duration'), (int, float)) else str(workout.get('duration') or "45 min"),
            "intensity": workout.get("intensity"),
            "badge": get_workout_badge(readiness_score),
            "available": True,
            "reasoning": workout.get("reasoning") or workout.get("reasons", []),
            "reasons": workout.get("reasons", []),
            "workoutObjective": workout.get("workoutObjective"),
            "trainingStyle": workout.get("trainingStyle"),
            "coachTone": workout.get("coachTone"),
            "trainingLoad": workout.get("trainingLoad"),
            "confidence": workout.get("confidence", 90),
            "bodyStatus": workout.get("bodyStatus"),
            "priorities": workout.get("priorities"),
            "coachSummary": workout.get("coachSummary"),
            "coachMessage": workout.get("coachMessage"),
            "volume": workout.get("volume"),
            "restIntervals": workout.get("restIntervals"),
            "warmup": workout.get("warmup"),
            "cooldown": workout.get("cooldown"),
            "todayRecoveryFocus": workout.get("todayRecoveryFocus"),
            "recoveryFocus": workout.get("recoveryFocus"),
        },

        "nutrition": {
            "priorityNutrients": priority_nutrients,

            "recommendedFoods": nutrition.get("recommendedFoods", []),
            "foods": nutrition.get("recommendedFoods", []),

            "hydration": {
                "title": "Hydration",
                "subtitle": "Fluid Intake Target",
                "badge": "Target",
                "value": hydration_val,
                "unit": "mL",
                "icon": "water"
            },
            "hydrationTarget": raw_hydration,

            "macros": {
                "calories": nutrition.get("calories") or 378,
                "protein": nutrition.get("protein") or 19,
                "carbs": nutrition.get("carbs") or 53,
                "fats": nutrition.get("fats") or 9,
                "fiber": nutrition.get("fiber") or 8,
            },

            "mealSuggestions": [
                {"type": "Breakfast", "title": "Overnight Oats + Almond Butter & Berries", "text": "Low glycemic index for sustained morning energy", "calories": 320, "protein": 14},
                {"type": "Lunch", "title": "Grilled Chicken Bowl & Quinoa", "text": "Leucine-rich for muscle synthesis during Luteal", "calories": 480, "protein": 42},
                {"type": "Dinner", "title": "Baked Salmon & Roasted Sweet Potato", "text": "Omega-3 anti-inflammatory recovery profile", "calories": 420, "protein": 35},
                {"type": "Snacks", "title": "Greek Yogurt + Honey & Walnuts", "text": "Probiotics for gut health and slow-release casein", "calories": 180, "protein": 18}
            ],

            "coachMessage": nutrition.get("coachMessage") or nutrition.get("phaseTip") or "Fuel your body with nutrient-dense foods aligned with today's activity level.",
            "tip": nutrition.get("phaseTip"),
        },

        "checklist": checklist,

        "recommendationFactors":
            recommendation_factors,
            
        "comingSoonCard": coming_soon_card,
        
        "user": {
            "id": str(profile.get("_id", "")),
            "firstName": profile.get("name", "User").split()[0],
            "streak": profile.get("streak", 0)
        },

        "greeting": "Hello",

        "streak": profile.get("streak", 0),
    }
