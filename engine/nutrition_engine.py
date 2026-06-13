# ── Valid inputs ──────────────────────────────────────────
VALID_PHASES = ['Menstrual', 'Follicular', 'Ovulation', 'Early Luteal', 'Late Luteal']
VALID_WORKOUTS = ['Rest', 'Light Cardio', 'Intense Cardio', 'Strength Training', 'HIIT', 'Yoga/Pilates', 'Other']
VALID_INTENSITY = ['Low', 'Moderate', 'High']
VALID_SLEEP = ['<5 hours', '5-6 hours', '7-8 hours', '>8 hours']
VALID_GOALS = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Improved Energy', 'Better Sleep', 'Hormonal Balance']

# ── Scoring tables ────────────────────────────────────────

PHASE_SCORES = {
    'Menstrual': {
        "PROTEIN": 1,
        "CARBS": 0,
        "IRON": 3,
        "MAGNESIUM": 2,
        "HYDRATION": 2,
        "RECOVERY": 2
        },

    'Follicular': {
         "PROTEIN": 2,
        "CARBS": 2,
        "IRON": 0,
        "MAGNESIUM": 0,
        "HYDRATION": 1,
        "RECOVERY": 0
    },

    'Ovulation': {
        "PROTEIN": 2,
        "CARBS": 1,
        "IRON": 0,
        "MAGNESIUM": 0,
        "HYDRATION": 1,
        "RECOVERY": 1
    },

    'Early Luteal': {
         "PROTEIN": 2,
        "CARBS": 2,
        "IRON": 0,
        "MAGNESIUM": 2,
        "HYDRATION": 2,
        "RECOVERY": 1
    },

    'Late Luteal': {
        "PROTEIN": 1,
        "CARBS": 2,
        "IRON": 0,
        "MAGNESIUM": 3,
        "HYDRATION": 2,
        "RECOVERY": 2
    }
}

WORKOUT_SCORES = {
     "Rest": {
        "PROTEIN": 1,
        "CARBS": 0,
        "IRON": 0,
        "MAGNESIUM": 1,
        "HYDRATION": 1,
        "RECOVERY": 3
    },

    "Light Cardio": {
        "PROTEIN": 1,
        "CARBS": 1,
        "IRON": 0,
        "MAGNESIUM": 0,
        "HYDRATION": 2,
        "RECOVERY": 1
    },

    "Intense Cardio": {
        "PROTEIN": 1,
        "CARBS": 3,
        "IRON": 0,
        "MAGNESIUM": 1,
        "HYDRATION": 3,
        "RECOVERY": 2
    },

    "Strength Training": {
        "PROTEIN": 3,
        "CARBS": 2,
        "IRON": 0,
        "MAGNESIUM": 1,
        "HYDRATION": 1,
        "RECOVERY": 2
    },

    "HIIT": {
        "PROTEIN": 2,
        "CARBS": 3,
        "IRON": 0,
        "MAGNESIUM": 1,
        "HYDRATION": 3,
        "RECOVERY": 2
    },

    "Yoga/Pilates": {
        "PROTEIN": 0,
        "CARBS": 0,
        "IRON": 0,
        "MAGNESIUM": 2,
        "HYDRATION": 1,
        "RECOVERY": 2
    },

    "Other": {
        "PROTEIN": 1,
        "CARBS": 1,
        "IRON": 0,
        "MAGNESIUM": 1,
        "HYDRATION": 1,
        "RECOVERY": 1
    }
}

INTENSITY_SCORES = {
     "Low": {
        "PROTEIN": 0,
        "CARBS": 0,
        "IRON": 0,
        "MAGNESIUM": 0,
        "HYDRATION": 0,
        "RECOVERY": 0
    },

    "Moderate": {
        "PROTEIN": 1,
        "CARBS": 1,
        "IRON": 0,
        "MAGNESIUM": 0,
        "HYDRATION": 1,
        "RECOVERY": 1
    },

    "High": {
        "PROTEIN": 2,
        "CARBS": 3,
        "IRON": 0,
        "MAGNESIUM": 1,
        "HYDRATION": 2,
        "RECOVERY": 2
    }
 }

SLEEP_SCORES = { 
     "<5 hours": {
        "PROTEIN": 0,
        "CARBS": 0,
        "IRON": 0,
        "MAGNESIUM": 3,
        "HYDRATION": 1,
        "RECOVERY": 3
    },

    "5-6 hours": {
        "PROTEIN": 0,
        "CARBS": 0,
        "IRON": 0,
        "MAGNESIUM": 2,
        "HYDRATION": 1,
        "RECOVERY": 2
    },

    "7-8 hours": {
        "PROTEIN": 0,
        "CARBS": 0,
        "IRON": 0,
        "MAGNESIUM": 0,
        "HYDRATION": 0,
        "RECOVERY": 0
    },

    ">8 hours": {
        "PROTEIN": 0,
        "CARBS": 0,
        "IRON": 0,
        "MAGNESIUM": 0,
        "HYDRATION": 0,
        "RECOVERY": -1
    }
 }

GOAL_SCORES = { 
     "Weight Loss": {
        "PROTEIN": 3,
        "CARBS": -1,
        "IRON": 0,
        "MAGNESIUM": 1,
        "HYDRATION": 1,
        "RECOVERY": 1
    },

    "Muscle Gain": {
        "PROTEIN": 3,
        "CARBS": 2,
        "IRON": 0,
        "MAGNESIUM": 0,
        "HYDRATION": 1,
        "RECOVERY": 1
    },

    "Maintenance": {
        "PROTEIN": 1,
        "CARBS": 1,
        "IRON": 0,
        "MAGNESIUM": 0,
        "HYDRATION": 1,
        "RECOVERY": 0
    },

    "Improved Energy": {
        "PROTEIN": 1,
        "CARBS": 2,
        "IRON": 1,
        "MAGNESIUM": 1,
        "HYDRATION": 2,
        "RECOVERY": 1
    },

    "Better Sleep": {
        "PROTEIN": 0,
        "CARBS": 0,
        "IRON": 0,
        "MAGNESIUM": 3,
        "HYDRATION": 1,
        "RECOVERY": 2
    },

    "Hormonal Balance": {
        "PROTEIN": 1,
        "CARBS": 1,
        "IRON": 1,
        "MAGNESIUM": 2,
        "HYDRATION": 1,
        "RECOVERY": 1
    }
 }

# ── Nutrient metadata (for checklist + food suggestions) ──
NUTRIENT_INFO = {
    "protein": {
        "checklist_item": "Include a quality protein source in every meal",
        "foods": ["eggs", "Greek yogurt", "lentils", "paneer", "chicken", "tofu"]
    },
    "iron": {
        "checklist_item": "Eat an iron-rich meal for lunch",
        "foods": ["spinach", "lentils", "tofu", "pumpkin seeds", "dark chocolate"]
    },
    "magnesium": {
        "checklist_item": "Include a magnesium-rich food at dinner",
        "foods": ["almonds", "dark chocolate", "banana", "pumpkin seeds", "brown rice"]
    },
    "carbs": {
        "checklist_item": "Fuel with complex carbs before your workout",
        "foods": ["oats", "brown rice", "banana", "sweet potato", "whole wheat roti"]
    },
    "hydration": {
        "checklist_item": "Drink at least 2.5 litres of water today",
        "foods": ["coconut water", "cucumber", "watermelon", "buttermilk"]
    },
   
}

LIFESTYLE_INFO = {
    "recovery": {
    "checklist_item": "Prioritize recovery and stress management today",
    "foods": ["curd", "banana", "nuts", "berries"]
    }
}

# ── Helper functions ──────────────────────────────────────

def validate_inputs(phase, workout_type, intensity, sleep_quality, goal):
    if phase not in VALID_PHASES:
        raise ValueError(f"Invalid phase: {phase}. Must be one of {VALID_PHASES}")
    if workout_type not in VALID_WORKOUTS:
        raise ValueError(f"Invalid workout type: {workout_type}. Must be one of {VALID_WORKOUTS}")
    if intensity not in VALID_INTENSITY:
        raise ValueError(f"Invalid intensity: {intensity}. Must be one of {VALID_INTENSITY}")
    if sleep_quality not in VALID_SLEEP:
        raise ValueError(f"Invalid sleep quality: {sleep_quality}. Must be one of {VALID_SLEEP}")
    if goal not in VALID_GOALS:
        raise ValueError(f"Invalid goal: {goal}. Must be one of {VALID_GOALS}")
    
def _apply_deltas(scores, deltas):
    for nutrient, value in deltas.items():
        key = nutrient.lower()

        if key not in scores:
            continue

        scores[key] += value

    return scores

def _score_to_level(score):
    if score <= 1:   return "low"
    elif score <= 3: return "normal"
    elif score <= 5: return "high"
    else:            return "critical"
    
def _build_checklist(priority_nutrients, priority_lifestyle, workout_type):
    nutrient_checklist = []
    lifestyle_checklist = []

    for nutrient in priority_nutrients:
        if nutrient in NUTRIENT_INFO:
            nutrient_checklist.append(NUTRIENT_INFO[nutrient]["checklist_item"])
        
    for lifestyle in priority_lifestyle:
        if lifestyle in LIFESTYLE_INFO:
            lifestyle_checklist.append(LIFESTYLE_INFO[lifestyle]["checklist_item"])
   
    # Add workout-specific hydration recommendation
    if workout_type in WORKOUT_SCORES and WORKOUT_SCORES[workout_type]["HYDRATION"] >= 2:
        nutrient_checklist.append("Focus on hydration before and after your workout")
    
    return nutrient_checklist + lifestyle_checklist

# ── Main function ─────────────────────────────────────────
def get_recommendation(phase, workout_type, intensity, sleep_quality, goal):

    # 1. Validate inputs
    validate_inputs(phase, workout_type, intensity, sleep_quality, goal)

    # 2. Start with zero scores for all nutrients
    nutrient_scores = {n: 0 for n in NUTRIENT_INFO}
    lifestyle_scores = {l: 0 for l in LIFESTYLE_INFO}
    
    # 3. Apply each factor
    nutrient_scores = _apply_deltas(nutrient_scores, PHASE_SCORES[phase])
    nutrient_scores = _apply_deltas(nutrient_scores, WORKOUT_SCORES[workout_type])
    nutrient_scores = _apply_deltas(nutrient_scores, INTENSITY_SCORES[intensity])
    nutrient_scores = _apply_deltas(nutrient_scores, SLEEP_SCORES[sleep_quality])
    nutrient_scores = _apply_deltas(nutrient_scores, GOAL_SCORES[goal])

    lifestyle_scores = _apply_deltas(lifestyle_scores, PHASE_SCORES[phase])
    lifestyle_scores = _apply_deltas(lifestyle_scores, WORKOUT_SCORES[workout_type])
    lifestyle_scores = _apply_deltas(lifestyle_scores, INTENSITY_SCORES[intensity])
    lifestyle_scores = _apply_deltas(lifestyle_scores, SLEEP_SCORES[sleep_quality])
    lifestyle_scores = _apply_deltas(lifestyle_scores, GOAL_SCORES[goal])
    
    # 4. Convert scores to levels
    nutrient_levels = {nutrient: _score_to_level(score) for nutrient, score in nutrient_scores.items()}
    lifestyle_levels = {lifestyle: _score_to_level(score) for lifestyle, score in lifestyle_scores.items()}
    
    # 5. Priority nutrients — top 3 by score
    priority_nutrients = [
        nutrient
        for nutrient, score in
        sorted(nutrient_scores.items(), key=lambda x: x[1], reverse=True)
        if score > 0
    ][:3]   

    priority_lifestyle = []
    if lifestyle_scores.get("recovery", 0) >= 2:
        priority_lifestyle.append("recovery")

    # 6. Build checklist and food suggestions
    checklist = _build_checklist(priority_nutrients, priority_lifestyle, workout_type)
    food_suggestions = []
    for nutrient in priority_nutrients:
        food_suggestions += NUTRIENT_INFO[nutrient]["foods"][:2]

    for lifestyle in priority_lifestyle:
        food_suggestions += LIFESTYLE_INFO[lifestyle]["foods"][:2]
    
    # 7. Sleep advice
    intensity_advice = None
    if lifestyle_scores.get("recovery", 0) >= 4:
        intensity_advice = "Consider lowering workout intensity today — your recovery capacity is reduced."
    
    # 8. Return
    return {
        "phase": phase,
        "nutrient_scores": nutrient_scores, 
        "lifestyle_scores": lifestyle_scores,
        "nutrient_levels": nutrient_levels,
        "lifestyle_levels": lifestyle_levels,
        "priority_nutrients": priority_nutrients,
        "priority_lifestyle": priority_lifestyle,
        "checklist": checklist,
        "food_suggestions": list(dict.fromkeys(food_suggestions)),  # deduplicate
        "intensity_advice": intensity_advice
    }