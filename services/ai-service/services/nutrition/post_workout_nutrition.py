from typing import Dict, List, Optional


def _normalize_phase(phase: Optional[str]) -> str:
    if not phase:
        return "follicular"
    return str(phase).strip().lower()


def _normalize_goal(goal: Optional[str]) -> str:
    if not goal:
        return "Maintenance"
    value = str(goal).strip().lower()
    if "muscle" in value or "gain" in value:
        return "Muscle Gain"
    if "fat" in value or "loss" in value:
        return "Fat Loss"
    if "hormonal" in value or "balance" in value:
        return "Hormonal Balance"
    if "energy" in value:
        return "Improved Energy"
    return "Maintenance"


def _dedupe(items: List[str]) -> List[str]:
    seen = set()
    result = []
    for item in items:
        if item and item not in seen:
            seen.add(item)
            result.append(item)
    return result


def calculate_macros(weight, intensity, goal=None):
    protein = round(weight * 0.4)
    if goal == "Muscle Gain":
        protein = round(weight * 0.45)
    elif goal == "Fat Loss":
        protein = round(weight * 0.38)
    if intensity == "High":
        carbs = round(weight * 1.1)
        if goal == "Fat Loss":
            carbs = round(weight * 0.85)
    elif intensity == "Moderate":
        carbs = round(weight * 0.8)
        if goal == "Fat Loss":
            carbs = round(weight * 0.7)
    elif intensity == "Light":
        carbs = round(weight * 0.6)
    else:
        carbs = round(weight * 0.5)
    fats = round(weight * 0.2)
    if goal == "Muscle Gain":
        fats = round(weight * 0.22)
    elif goal == "Fat Loss":
        fats = round(weight * 0.18)
    calories = protein * 4 + carbs * 4 + fats * 9
    return calories, protein, carbs, fats


def calculate_hydration(weight, duration, intensity, recovery_score=None):
    base = max(800, int(weight * 18))
    extra = 250 if duration > 60 else 0
    extra += 250 if intensity == "High" else 150 if intensity == "Moderate" else 0
    if recovery_score is not None and recovery_score <= 4:
        extra += 100
    return f"{base + extra - 100}-{base + extra + 150} mL"


def electrolytes_needed(duration, intensity, recovery_score=None):
    return duration >= 60 or intensity == "High" or (recovery_score is not None and recovery_score <= 4)


def phase_recovery(phase):
    phase_key = _normalize_phase(phase)
    phase_map = {
        "menstrual": {"priorityNutrients": ["Iron", "Vitamin C", "Magnesium"], "foods": ["Spinach", "Lentils", "Orange", "Dates"], "tip": "You are in the menstrual phase, so prioritize iron-rich foods, magnesium, and steady hydration for support and recovery."},
        "follicular": {"priorityNutrients": ["Protein", "Complex Carbohydrates"], "foods": ["Chicken", "Rice", "Eggs", "Greek Yogurt"], "tip": "You are in the follicular phase, which is a good time to support recovery with balanced protein and energizing carbohydrates."},
        "ovulation": {"priorityNutrients": ["Protein", "Electrolytes"], "foods": ["Chicken", "Banana", "Rice", "Coconut Water"], "tip": "You are in the ovulation phase, so performance support and hydration are especially useful after training."},
        "early luteal": {"priorityNutrients": ["Protein", "Healthy Fats", "Magnesium"], "foods": ["Salmon", "Avocado", "Nuts", "Greek Yogurt"], "tip": "You are in the early luteal phase, where recovery and stable energy become increasingly important. Include protein, magnesium-rich foods, and adequate hydration."},
        "late luteal": {"priorityNutrients": ["Magnesium", "Fiber", "Vitamin B6"], "foods": ["Pumpkin Seeds", "Dark Chocolate", "Banana", "Leafy Greens"], "tip": "You are in the late luteal phase, so gentle recovery, fiber, and magnesium-rich foods can make a meaningful difference."},
    }
    return phase_map.get(phase_key, phase_map["follicular"])


def _goal_nutrients(goal: str) -> List[str]:
    return {"Muscle Gain": ["Protein", "Carbohydrates"], "Fat Loss": ["Protein", "Fiber"], "Hormonal Balance": ["Healthy Fats", "Omega-3", "Magnesium"], "Improved Energy": ["Iron", "Carbohydrates"], "Maintenance": ["Protein", "Hydration"]}.get(goal, [])


def _goal_foods(goal: str) -> List[str]:
    return {"Muscle Gain": ["Greek Yogurt", "Paneer", "Brown Rice", "Banana"], "Fat Loss": ["Eggs", "Leafy Greens", "Chickpeas", "Oats"], "Hormonal Balance": ["Salmon", "Walnuts", "Pumpkin Seeds", "Avocado"], "Improved Energy": ["Spinach", "Dates", "Quinoa", "Banana"], "Maintenance": ["Greek Yogurt", "Oats", "Banana", "Cottage Cheese"]}.get(goal, [])


def _intensity_foods(intensity: str) -> List[str]:
    return {"High": ["Rice", "Banana", "Peanut Butter"], "Moderate": ["Oats", "Apple", "Yogurt"], "Light": ["Fruit Smoothie", "Coconut Water", "Rice Cakes"]}.get(intensity, [])


def _nutrient_foods(priority_nutrients: List[str]) -> List[str]:
    mapping = {"Protein": ["Greek Yogurt", "Paneer", "Chicken"], "Electrolytes": ["Coconut Water", "Banana", "Orange"], "Hydration": ["Watermelon", "Cucumber", "Coconut Water"], "Omega-3": ["Salmon", "Walnuts", "Chia Seeds"], "Magnesium": ["Pumpkin Seeds", "Dark Chocolate", "Leafy Greens"], "Fiber": ["Oats", "Chickpeas", "Leafy Greens"], "Healthy Fats": ["Avocado", "Nuts", "Salmon"], "Iron": ["Spinach", "Dates", "Lentils"], "Complex Carbohydrates": ["Brown Rice", "Oats", "Quinoa"], "Carbohydrates": ["Rice", "Banana", "Oats"], "Vitamin C": ["Orange", "Kiwi", "Bell Peppers"], "Vitamin B6": ["Banana", "Chicken", "Potatoes"]}
    foods = []
    for nutrient in priority_nutrients:
        foods.extend(mapping.get(nutrient, []))
    return foods


def _build_priority_nutrients(phase_info: Dict, goal: str, intensity: str, duration: int, soreness: Optional[str], recovery_score: Optional[int]) -> List[str]:
    scores = {}
    for nutrient in phase_info["priorityNutrients"]:
        scores[nutrient] = scores.get(nutrient, 0) + 3
    for nutrient in _goal_nutrients(goal):
        scores[nutrient] = scores.get(nutrient, 0) + 3
    if intensity == "High":
        for nutrient in ["Electrolytes", "Carbohydrates", "Protein"]:
            scores[nutrient] = scores.get(nutrient, 0) + 2
    elif intensity == "Moderate":
        for nutrient in ["Protein", "Hydration"]:
            scores[nutrient] = scores.get(nutrient, 0) + 1
    if duration > 60:
        for nutrient in ["Electrolytes", "Hydration", "Carbohydrates"]:
            scores[nutrient] = scores.get(nutrient, 0) + 2
    if recovery_score is not None and recovery_score <= 4:
        for nutrient in ["Protein", "Electrolytes", "Hydration", "Omega-3"]:
            scores[nutrient] = scores.get(nutrient, 0) + 2
    soreness_value = str(soreness or "").lower()
    if "high" in soreness_value or "moderate" in soreness_value:
        for nutrient in ["Protein", "Magnesium", "Omega-3"]:
            scores[nutrient] = scores.get(nutrient, 0) + 2
    return _dedupe([nutrient for nutrient, _ in sorted(scores.items(), key=lambda item: item[1], reverse=True)][:3])


def recovery_foods(phase_info: Dict, goal: str, intensity: str, priority_nutrients: List[str]) -> List[str]:
    foods = phase_info["foods"] + _goal_foods(goal) + _intensity_foods(intensity) + _nutrient_foods(priority_nutrients)
    return _dedupe(foods)[:8]


def recovery_tip(intensity, phase_info: Dict):
    if intensity == "High":
        return "Consume protein and carbohydrates within 60 minutes after training, then hydrate well to support recovery."
    if intensity == "Moderate":
        return "Refuel with a balanced meal and fluids to support the next day of training."
    return phase_info["tip"]


def build_checklist(phase: str, goal: str, intensity: str, duration: int, soreness: Optional[str]) -> List[Dict]:
    try:
        from services.nutrition.checklist_generator import generate_post_workout_checklist
    except ModuleNotFoundError:
        try:
            from nutrition.checklist_generator import generate_post_workout_checklist
        except ModuleNotFoundError:
            from checklist_generator import generate_post_workout_checklist

    return generate_post_workout_checklist(
        phase=phase,
        goals=goal,
        workout_intensity=intensity,
        workout_duration=duration,
        soreness=soreness,
    )


def build_meal_suggestions(foods: List[str]) -> List[str]:
    suggestions = []
    if any(food in foods for food in ["Greek Yogurt", "Banana"]):
        suggestions.append("Breakfast: Greek Yogurt + Banana")
    if any(food in foods for food in ["Paneer", "Rice", "Leafy Greens"]):
        suggestions.append("Lunch: Rice + Paneer + Vegetables")
    if any(food in foods for food in ["Oats", "Banana", "Yogurt"]):
        suggestions.append("Snack: Oats + Fruit")
    if any(food in foods for food in ["Salmon", "Avocado", "Leafy Greens"]):
        suggestions.append("Dinner: Salmon + Salad + Rice")
    if not suggestions:
        suggestions = ["Breakfast: Greek Yogurt + Banana", "Lunch: Rice + Paneer + Vegetables", "Snack: Fruit + Nuts", "Dinner: Eggs + Toast + Salad"]
    return suggestions[:4]


def build_supplements(phase: str, goal: str, intensity: str, duration: int, soreness: Optional[str]) -> List[Dict]:
    supplements = []
    if _normalize_phase(phase) == "menstrual":
        supplements.append({"name": "Iron", "priority": "Recommended", "reason": "Supports recovery and replenishment during the menstrual phase."})
    if _normalize_phase(phase) in {"late luteal"} or "high" in str(soreness or "").lower():
        supplements.append({"name": "Magnesium", "priority": "Recommended", "reason": "Supports muscle relaxation and recovery when soreness is elevated."})
    if duration > 60 or intensity == "High":
        supplements.append({"name": "Electrolytes", "priority": "Recommended", "reason": "Helps replace what is lost during long or intense sessions."})
    if "high" in str(soreness or "").lower():
        supplements.append({"name": "Omega-3", "priority": "Optional", "reason": "May help with soreness and recovery."})
    if goal == "Muscle Gain":
        supplements.append({"name": "Protein Powder", "priority": "Optional", "reason": "Supports muscle gain and convenient post-workout protein."})
    if goal == "Muscle Gain" and intensity == "High":
        supplements.append({"name": "Creatine", "priority": "Optional", "reason": "Supports strength and recovery for high-demand sessions."})
    return supplements[:5]


def build_reasoning(phase: str, goal: str, intensity: str, duration: int, soreness: Optional[str], recovery_score: Optional[int]) -> List[str]:
    reasons = []
    if goal == "Muscle Gain":
        reasons.append("Protein was prioritized due to your muscle gain goal.")
    elif goal == "Fat Loss":
        reasons.append("Protein and fiber were emphasized to support recovery while keeping meals satiating.")
    elif goal == "Hormonal Balance":
        reasons.append("Healthy fats and magnesium were emphasized for hormonal support.")
    elif goal == "Improved Energy":
        reasons.append("Iron and carbohydrates were prioritized to support energy availability.")
    if intensity == "High":
        reasons.append("Electrolytes and carbohydrates were emphasized after a high-intensity workout.")
    elif intensity == "Moderate":
        reasons.append("Balanced carbohydrates and protein were selected for a moderate session.")
    if duration > 60:
        reasons.append("Hydration and electrolytes were increased because the session was longer than 60 minutes.")
    if recovery_score is not None and recovery_score <= 4:
        reasons.append("Recovery support was increased because your recovery score was low.")
    if "high" in str(soreness or "").lower():
        reasons.append("Magnesium and omega-3 were included because soreness was elevated.")
    phase_key = _normalize_phase(phase)
    if phase_key == "late luteal":
        reasons.append("Magnesium and fiber were emphasized during the late luteal phase.")
    elif phase_key == "menstrual":
        reasons.append("Iron and vitamin C were emphasized during the menstrual phase.")
    return reasons[:5]


def generate_post_workout_plan(weight, intensity, duration, workout_type, goal, phase, soreness=None, rpe=None, recovery_score=None, readiness_score=None, fatigue_score=None):
    try:
        from services.recovery_engine import generate_post_workout_plan as recovery_plan_gen
        plan = recovery_plan_gen(
            weight=weight,
            workoutType=workout_type,
            intensity=intensity,
            duration=duration,
            rpe=rpe,
            muscleSoreness=soreness,
            goal=goal,
            phase=phase,
            recovery_score=recovery_score,
            readiness_score=readiness_score,
            fatigue_score=fatigue_score,
        )
        normalized_goal = _normalize_goal(goal)
        plan["supplements"] = build_supplements(phase, normalized_goal, intensity, duration, soreness)
        return plan
    except Exception:
        normalized_goal = _normalize_goal(goal)
        calories, protein, carbs, fats = calculate_macros(weight, intensity, normalized_goal)
        phase_info = phase_recovery(phase)
        priority_nutrients = _build_priority_nutrients(phase_info, normalized_goal, intensity, duration, soreness, recovery_score)
        recommended_foods = recovery_foods(phase_info, normalized_goal, intensity, priority_nutrients)
        return {"calories": calories, "protein": protein, "carbs": carbs, "fats": fats, "hydration": calculate_hydration(weight, duration, intensity, recovery_score), "electrolytes": electrolytes_needed(duration, intensity, recovery_score), "priorityNutrients": priority_nutrients, "recommendedFoods": recommended_foods, "phaseFoods": phase_info["foods"], "phaseTip": phase_info["tip"], "recoveryTip": recovery_tip(intensity, phase_info), "checklist": build_checklist(phase, normalized_goal, intensity, duration, soreness), "mealSuggestions": build_meal_suggestions(recommended_foods), "supplements": build_supplements(phase, normalized_goal, intensity, duration, soreness), "reasoning": build_reasoning(phase, normalized_goal, intensity, duration, soreness, recovery_score)}


if __name__ == "__main__":
    from pprint import pprint
    pprint(generate_post_workout_plan(weight=55, intensity="High", duration=70, workout_type="Strength", goal="Build Muscle", phase="Follicular", soreness="High", recovery_score=3))
