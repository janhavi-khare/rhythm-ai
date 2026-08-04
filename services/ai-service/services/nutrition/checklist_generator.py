"""
Rhythm AI Checklist Generator Module

Generates TWO completely independent dynamic checklists based on user context:
1. Pre-workout checklist (Fuel Up): 6–8 dynamic tasks for pre-training preparation.
2. Post-workout checklist (Recovery): 7–9 dynamic tasks for optimal post-workout recovery.

Both checklists are dynamically computed from:
- menstrual phase
- goals
- workout intensity
- workout duration
- workout type
- hydration target
- priority nutrients
- recovery score
"""

from typing import List, Dict, Any, Optional, Union


def _norm_str(val: Any) -> str:
    if val is None:
        return ""
    return str(val).strip().lower()


def generate_pre_workout_checklist(
    phase: Optional[str] = "Follicular",
    goals: Optional[Union[List[str], str]] = None,
    workout_intensity: str = "Moderate",
    workout_duration: int = 45,
    workout_type: str = "Strength Training",
    hydration_target: str = "500–600 mL",
    priority_nutrients: Optional[List[Any]] = None,
    recovery_score: Optional[float] = 75.0,
    **kwargs
) -> List[Dict[str, Any]]:
    """
    Generate dynamic Pre-Workout (Fuel Up) Checklist (6 to 8 items).
    Each item contains: { "id": "...", "label": "...", "completed": false }
    """
    norm_phase = _norm_str(phase)
    
    if isinstance(goals, list):
        goal_str = " ".join([_norm_str(g) for g in goals])
    else:
        goal_str = _norm_str(goals)
        
    norm_intensity = _norm_str(workout_intensity or kwargs.get("intensity"))
    type_lower = _norm_str(workout_type or kwargs.get("workoutType"))
    
    # Normalize priority nutrients to lowercase strings
    nutrients_list = []
    if priority_nutrients:
        for item in priority_nutrients:
            if isinstance(item, dict):
                nutrients_list.append(_norm_str(item.get("name") or item.get("title")))
            else:
                nutrients_list.append(_norm_str(item))
    nutrients_str = " ".join(nutrients_list)

    hyd_text = hydration_target if isinstance(hydration_target, str) and hydration_target.strip() else "500–600 mL"

    candidates = []

    # 1. Hydration
    candidates.append({
        "id": "pre_hydration",
        "category": "Hydration",
        "label": f"Drink {hyd_text} of water 30–60 minutes before training.",
        "priority": 100,
        "completed": False
    })

    # 2. Meal timing
    w_time = _norm_str(kwargs.get("workout_time") or kwargs.get("plannedWorkoutTime"))
    if norm_intensity in ["high", "intense"] or workout_duration >= 60:
        meal_msg = "Consume your pre-workout fuel meal 60–90 minutes prior to session."
    elif w_time == "morning":
        meal_msg = "Eat a light pre-workout breakfast 30–60 minutes before training."
    else:
        meal_msg = "Time your pre-workout snack 45–60 minutes before exercise."
    candidates.append({
        "id": "pre_meal_timing",
        "category": "Meal timing",
        "label": meal_msg,
        "priority": 95,
        "completed": False
    })

    # 3. Warm-up
    candidates.append({
        "id": "pre_warmup",
        "category": "Warm-up",
        "label": "Execute a 5–10 minute dynamic warm-up targeting major joint complexes.",
        "priority": 92,
        "completed": False
    })

    # 4. Protein
    if "protein" in nutrients_str or "muscle" in goal_str or "strength" in type_lower:
        candidates.append({
            "id": "pre_protein",
            "category": "Protein",
            "label": "Include 15–25g easily digestible protein in pre-workout fuel.",
            "priority": 90,
            "completed": False
        })

    # 5. Complex carbohydrates
    if workout_duration >= 45 or norm_intensity in ["high", "moderate", "intense"] or "carbohydrate" in nutrients_str or "carbs" in nutrients_str:
        candidates.append({
            "id": "pre_carbs",
            "category": "Complex carbohydrates",
            "label": "Fuel with complex carbs (oats/rice/sweet potato) for sustained energy.",
            "priority": 88,
            "completed": False
        })

    # 6. Electrolytes
    if norm_intensity in ["high", "intense"] or workout_duration >= 60 or norm_phase in ["ovulation"] or "electrolyte" in nutrients_str:
        candidates.append({
            "id": "pre_electrolytes",
            "category": "Electrolytes",
            "label": "Pre-hydrate with an electrolyte beverage to support muscle contractions.",
            "priority": 85,
            "completed": False
        })

    # 7. Mobility
    soreness_val = _norm_str(kwargs.get("soreness") or kwargs.get("muscleSoreness"))
    if type_lower in ["strength training", "yoga", "hiit"] or "moderate" in soreness_val or "high" in soreness_val:
        candidates.append({
            "id": "pre_mobility",
            "category": "Mobility",
            "label": "Perform targeted hip and thoracic mobility drills before lifting.",
            "priority": 84,
            "completed": False
        })

    # 8. Healthy fats
    if norm_phase in ["late luteal", "early luteal"] or workout_duration >= 60 or "fat" in nutrients_str:
        candidates.append({
            "id": "pre_healthy_fats",
            "category": "Healthy fats",
            "label": "Include a small portion of healthy fats (nuts/seeds) for stable blood sugar.",
            "priority": 82,
            "completed": False
        })

    # 9. Avoid heavy meals
    if norm_intensity in ["high", "intense"] or type_lower in ["hiit", "cardio"]:
        candidates.append({
            "id": "pre_avoid_heavy",
            "category": "Avoid heavy meals",
            "label": "Avoid high-fat or heavy fried foods immediately before training.",
            "priority": 80,
            "completed": False
        })

    # 10. Carry water bottle
    if workout_duration >= 45 or type_lower in ["cardio", "hiit", "strength training"]:
        candidates.append({
            "id": "pre_carry_water",
            "category": "Carry water bottle",
            "label": "Prepare and carry a full water bottle for intra-workout hydration.",
            "priority": 78,
            "completed": False
        })

    # 11. Caffeine timing
    energy_val = kwargs.get("energy") or kwargs.get("subjectiveEnergy") or 3
    try:
        energy_num = int(energy_val)
    except (ValueError, TypeError):
        energy_num = 3

    if energy_num <= 2 or w_time in ["morning", "early morning"] or "endurance" in goal_str:
        candidates.append({
            "id": "pre_caffeine_timing",
            "category": "Caffeine timing",
            "label": "Time pre-workout caffeine (coffee/green tea) 30–45 min prior if needed.",
            "priority": 75,
            "completed": False
        })

    # Determine target task count dynamically (6 to 8 items)
    if norm_intensity in ["high", "intense"] or workout_duration >= 60:
        target_count = 8
    elif norm_intensity == "moderate" or workout_duration >= 45:
        target_count = 7
    else:
        target_count = 6

    # Sort candidates by priority and slice to target count
    candidates.sort(key=lambda item: item["priority"], reverse=True)
    selected = candidates[:target_count]

    # Return required schema { "id": "...", "label": "...", "completed": false }
    return [
        {
            "id": item["id"],
            "label": item["label"],
            "completed": False
        }
        for item in selected
    ]


def generate_post_workout_checklist(
    phase: Optional[str] = "Follicular",
    goals: Optional[Union[List[str], str]] = None,
    workout_intensity: str = "Moderate",
    workout_duration: int = 45,
    workout_type: str = "Strength Training",
    hydration_target: str = "800–1000 mL",
    priority_nutrients: Optional[List[Any]] = None,
    recovery_score: Optional[float] = 75.0,
    **kwargs
) -> List[Dict[str, Any]]:
    """
    Generate dynamic Post-Workout (Recovery) Checklist (7 to 9 items).
    Each item contains: { "id": "...", "label": "...", "completed": false }
    """
    norm_phase = _norm_str(phase)
    
    if isinstance(goals, list):
        goal_str = " ".join([_norm_str(g) for g in goals])
    else:
        goal_str = _norm_str(goals)
        
    norm_intensity = _norm_str(workout_intensity or kwargs.get("intensity"))
    type_lower = _norm_str(workout_type or kwargs.get("workoutType"))

    nutrients_list = []
    if priority_nutrients:
        for item in priority_nutrients:
            if isinstance(item, dict):
                nutrients_list.append(_norm_str(item.get("name") or item.get("title")))
            else:
                nutrients_list.append(_norm_str(item))
    nutrients_str = " ".join(nutrients_list)

    hyd_text = hydration_target if isinstance(hydration_target, str) and hydration_target.strip() else "800–1000 mL"
    rec_val = float(recovery_score) if recovery_score is not None else 75.0
    soreness_val = _norm_str(kwargs.get("soreness") or kwargs.get("muscleSoreness"))

    candidates = []

    # 1. Hydration
    candidates.append({
        "id": "post_hydration",
        "category": "Hydration",
        "label": f"Rehydrate with {hyd_text} of water post-workout.",
        "priority": 100,
        "completed": False
    })

    # 2. Recovery protein
    candidates.append({
        "id": "post_recovery_protein",
        "category": "Recovery protein",
        "label": "Consume 25–35g leucine-rich protein within 45–60 minutes.",
        "priority": 98,
        "completed": False
    })

    # 3. Recovery meal
    candidates.append({
        "id": "post_recovery_meal",
        "category": "Recovery meal",
        "label": "Eat a balanced recovery meal within 60–90 minutes post-session.",
        "priority": 95,
        "completed": False
    })

    # 4. Stretching
    candidates.append({
        "id": "post_stretching",
        "category": "Stretching",
        "label": "Perform 8–10 minutes of static stretching focusing on trained muscle groups.",
        "priority": 92,
        "completed": False
    })

    # 5. Electrolytes
    if norm_intensity in ["high", "intense"] or workout_duration >= 45 or rec_val < 75 or "electrolyte" in nutrients_str:
        candidates.append({
            "id": "post_electrolytes",
            "category": "Electrolytes",
            "label": "Replenish sodium, potassium, and magnesium with electrolyte fluid.",
            "priority": 90,
            "completed": False
        })

    # 6. Recovery carbohydrates
    if norm_intensity in ["high", "moderate", "intense"] or workout_duration >= 45 or "carbohydrate" in nutrients_str:
        candidates.append({
            "id": "post_recovery_carbs",
            "category": "Recovery carbohydrates",
            "label": "Replenish muscle glycogen with quality complex carbohydrates.",
            "priority": 88,
            "completed": False
        })

    # 7. Magnesium
    if norm_phase in ["late luteal", "early luteal", "menstrual"] or rec_val < 75 or soreness_val in ["moderate", "high", "severe"] or "magnesium" in nutrients_str:
        candidates.append({
            "id": "post_magnesium",
            "category": "Magnesium",
            "label": "Include magnesium-rich foods (pumpkin seeds/leafy greens) or supplement tonight.",
            "priority": 86,
            "completed": False
        })

    # 8. Iron (if appropriate)
    if norm_phase in ["menstrual", "late luteal"] or "iron" in nutrients_str:
        candidates.append({
            "id": "post_iron",
            "category": "Iron",
            "label": "Prioritize iron-rich foods paired with Vitamin C to support oxygen transport.",
            "priority": 84,
            "completed": False
        })

    # 9. Sleep
    if rec_val < 80 or norm_phase in ["late luteal", "menstrual"] or "fatigue" in goal_str:
        candidates.append({
            "id": "post_sleep",
            "category": "Sleep",
            "label": "Prioritize 8+ hours of uninterrupted sleep tonight for cellular repair.",
            "priority": 82,
            "completed": False
        })

    # 10. Foam rolling
    if soreness_val in ["moderate", "high", "severe"] or norm_intensity in ["high", "intense"]:
        candidates.append({
            "id": "post_foam_rolling",
            "category": "Foam rolling",
            "label": "Foam roll tight muscle groups for 5–10 minutes to relieve tension.",
            "priority": 80,
            "completed": False
        })

    # 11. Walking
    if type_lower in ["strength training", "hiit"] or soreness_val in ["moderate", "high"]:
        candidates.append({
            "id": "post_walking",
            "category": "Walking",
            "label": "Take a 10-minute light cooldown walk to promote metabolic clearance.",
            "priority": 78,
            "completed": False
        })

    # 12. Monitor soreness
    if rec_val < 70 or soreness_val != "none":
        candidates.append({
            "id": "post_monitor_soreness",
            "category": "Monitor soreness",
            "label": "Track muscle soreness and joint feedback over the next 24 hours.",
            "priority": 76,
            "completed": False
        })

    # 13. Mobility
    if norm_phase in ["luteal", "early luteal", "late luteal", "menstrual"] or type_lower == "strength training":
        candidates.append({
            "id": "post_mobility",
            "category": "Mobility",
            "label": "Perform gentle hip and spinal mobility flow to enter parasympathetic recovery.",
            "priority": 74,
            "completed": False
        })

    # Determine target task count dynamically (7 to 9 items)
    if rec_val < 60 or norm_intensity in ["high", "intense"] or workout_duration >= 60:
        target_count = 9
    elif norm_intensity == "moderate" or workout_duration >= 45:
        target_count = 8
    else:
        target_count = 7

    # Sort candidates by priority and slice to target count
    candidates.sort(key=lambda item: item["priority"], reverse=True)
    selected = candidates[:target_count]

    return [
        {
            "id": item["id"],
            "label": item["label"],
            "completed": False
        }
        for item in selected
    ]