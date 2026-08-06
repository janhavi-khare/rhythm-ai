"""
Checklist Generator

Builds dynamic pre-workout and recovery checklists
using nutrition priorities and workout context.
"""

from typing import List


def _add(task_list, title, description, priority):

    task_list.append({
        "title": title,
        "description": description,
        "priority": priority,
        "completed": False
    })


# ---------------------------------------------------------
# PRE WORKOUT
# ---------------------------------------------------------

FOODS = {
    "protein": [
        "Greek Yogurt",
        "Paneer",
        "Tofu",
        "Eggs",
        "Chicken Breast",
        "Fish",
        "Soy Chunks",
        "Lentils",
        "Milk",
    ],

    "carbohydrates": [
        "Oats",
        "Banana",
        "Brown Rice",
        "Sweet Potato",
        "Whole Wheat Bread",
        "Poha",
        "Idli",
        "Quinoa",
    ],

    "healthy_fats": [
        "Almonds",
        "Walnuts",
        "Peanut Butter",
        "Avocado",
        "Seeds",
        "Olive Oil",
    ],

    "iron": [
        "Spinach",
        "Rajma",
        "Kala Chana",
        "Lentils",
        "Soybeans",
        "Dates",
    ],

    "magnesium": [
        "Pumpkin Seeds",
        "Dark Chocolate",
        "Almonds",
        "Cashews",
        "Spinach",
    ],

    "calcium": [
        "Milk",
        "Curd",
        "Paneer",
        "Tofu",
    ],

    "vitamin_c": [
        "Orange",
        "Guava",
        "Kiwi",
        "Lemon",
        "Amla",
    ],

    "vitamin_d": [
        "Eggs",
        "Fatty Fish",
        "Fortified Milk",
    ],

    "omega3": [
        "Walnuts",
        "Flax Seeds",
        "Chia Seeds",
        "Fish",
    ],

    "fiber": [
        "Apple",
        "Oats",
        "Vegetables",
        "Beans",
        "Fruits",
    ],
}


PRE_WORKOUT_MEALS = {
    "Breakfast": [
        "Oats + Banana + Milk",
        "Poha + Curd",
        "Whole Wheat Toast + Peanut Butter",
        "Greek Yogurt + Fruits",
    ],

    "Snack": [
        "Banana",
        "Dates",
        "Fruit Smoothie",
        "Trail Mix",
    ],
}


POST_WORKOUT_MEALS = {
    "Meal": [
        "Rice + Paneer + Vegetables",
        "Dal + Roti + Salad",
        "Chicken + Rice + Vegetables",
        "Tofu Stir Fry + Rice",
    ],

    "Snack": [
        "Protein Shake",
        "Greek Yogurt",
        "Milk + Banana",
        "Paneer Sandwich",
    ],
}

def generate_pre_workout_checklist(
    nutrients,
    hydration_target,
    workout_time,
    phase,
    intensity
):

    checklist = []

    # Hydration

    _add(
        checklist,
        "Hydration",
        f"Drink {hydration_target} mL water before training.",
        10
    )

    # Meal timing

    if workout_time == "Morning":

        meal = "Eat a light meal 30–60 min before training."

    else:

        meal = "Eat a balanced meal 60–90 min before training."

    _add(
        checklist,
        "Pre-workout Meal",
        meal,
        9
    )

    # Nutrient priorities

    for nutrient, score in nutrients[:3]:

        if nutrient == "protein":

            _add(
                checklist,
                "Protein",
                "Include a protein source in your meal.",
                score
            )

        elif nutrient == "carbohydrates":

            _add(
                checklist,
                "Carbohydrates",
                "Choose complex carbohydrates for sustained energy.",
                score
            )

        elif nutrient == "healthy_fats":

            _add(
                checklist,
                "Healthy Fats",
                "Include healthy fats in moderation.",
                score
            )

        elif nutrient == "hydration":

            _add(
                checklist,
                "Hydration",
                "Keep sipping water before training.",
                score
            )

        elif nutrient == "iron":

            _add(
                checklist,
                "Iron",
                "Pair iron-rich foods with Vitamin C.",
                score
            )

        elif nutrient == "magnesium":

            _add(
                checklist,
                "Magnesium",
                "Include magnesium-rich foods today.",
                score
            )

    # Warm-up

    _add(
        checklist,
        "Warm-up",
        "Complete a 5–10 minute dynamic warm-up.",
        8
    )

    # Phase reminder

    if phase:

        _add(
            checklist,
            "Cycle Awareness",
            f"Adjust your effort according to your {phase.lower()} phase.",
            6
        )

    # High intensity

    if intensity == "Intense":

        _add(
            checklist,
            "Electrolytes",
            "Consider an electrolyte drink if sweating heavily.",
            7
        )

    # General reminder

    _add(
        checklist,
        "Avoid",
        "Avoid heavy fried meals immediately before training.",
        5
    )

    checklist.sort(
        key=lambda x: x["priority"],
        reverse=True
    )

    return checklist


# ---------------------------------------------------------
# POST WORKOUT
# ---------------------------------------------------------

def generate_post_workout_checklist(
    nutrients,
    hydration_target,
    recovery_score,
    soreness,
    phase
):

    checklist = []

    _add(
        checklist,
        "Hydration",
        f"Drink {hydration_target} mL water.",
        10
    )

    _add(
        checklist,
        "Recovery Meal",
        "Eat within 60 minutes after training.",
        10
    )

    # Nutrient priorities

    for nutrient, score in nutrients[:5]:

        if nutrient == "protein":

            _add(
                checklist,
                "Protein",
                "Consume 20–30 g protein.",
                score
            )

        elif nutrient == "carbohydrates":

            _add(
                checklist,
                "Carbohydrates",
                "Replenish glycogen with quality carbs.",
                score
            )

        elif nutrient == "healthy_fats":

            _add(
                checklist,
                "Healthy Fats",
                "Include a healthy fat source today.",
                score
            )

        elif nutrient == "magnesium":

            _add(
                checklist,
                "Magnesium",
                "Support muscle recovery with magnesium-rich foods.",
                score
            )

        elif nutrient == "omega3":

            _add(
                checklist,
                "Omega-3",
                "Include anti-inflammatory fats.",
                score
            )

        elif nutrient == "electrolytes":

            _add(
                checklist,
                "Electrolytes",
                "Replace electrolytes after training.",
                score
            )

        elif nutrient == "iron":

            _add(
                checklist,
                "Iron",
                "Prioritize iron-rich foods if appropriate.",
                score
            )

    # Stretch

    _add(
        checklist,
        "Stretch",
        "Stretch for 10 minutes.",
        8
    )

    # Soreness

    if soreness in ["Moderate", "High", "Severe"]:

        _add(
            checklist,
            "Recovery",
            "Prioritize mobility and foam rolling.",
            8
        )

    # Recovery score

    if recovery_score is not None:

        if recovery_score < 60:

            _add(
                checklist,
                "Sleep",
                "Aim for at least 8 hours of sleep tonight.",
                9
            )

    # Phase

    if phase:

        _add(
            checklist,
            "Cycle Awareness",
            f"Recovery recommendations adjusted for your {phase.lower()} phase.",
            6
        )

    checklist.sort(
        key=lambda x: x["priority"],
        reverse=True
    )
    
def get_priority_foods(priority_list: List):

    foods = []

    for nutrient, _ in priority_list:

        if nutrient in FOODS:

            foods.extend(FOODS[nutrient][:2])

    # remove duplicates

    unique = []

    for food in foods:

        if food not in unique:
            unique.append(food)

    return unique[:8]


def meal_timing(workout_time):

    workout_time = (workout_time or "").lower()

    if workout_time == "morning":

        return {
            "pre_workout": "30-60 minutes before workout",
            "post_workout": "Within 60 minutes after workout"
        }

    if workout_time == "afternoon":

        return {
            "pre_workout": "60-90 minutes before workout",
            "post_workout": "Within 60 minutes after workout"
        }

    return {
        "pre_workout": "60-90 minutes before workout",
        "post_workout": "Within 60 minutes after workout"
    }


def generate_pre_workout_meals(priority_list, workout_time):

    return {

        "mealTiming": meal_timing(workout_time),

        "recommendedMeals": PRE_WORKOUT,

        "recommendedFoods": get_priority_foods(priority_list),

        "avoid": [

            "Heavy fried meals",

            "Large meals immediately before workout",

            "Excess sugar",

            "Alcohol"

        ]
    }


def generate_post_workout_meals(priority_list):

    return {

        "recommendedMeals": POST_WORKOUT,

        "recommendedFoods": get_priority_foods(priority_list),

        "avoid": [

            "Skipping post-workout meal",

            "Alcohol",

            "Highly processed foods"

        ]
    }

    return checklist