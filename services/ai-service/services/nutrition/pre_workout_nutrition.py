from typing import Dict

def phase_recommendations(phase):
    if not phase:
        phase = "follicular"
    phase = str(phase).lower()

    if phase == "menstrual":
        return {
            "priorityNutrients": [
                "Iron",
                "Vitamin C",
                "Magnesium"
            ],
            "foods": [
                "Spinach",
                "Dates",
                "Orange",
                "Dark Chocolate"
            ],
            "tip":
            "Choose easily digestible meals and stay hydrated."
        }
    elif phase == "follicular":
        return {
            "priorityNutrients": [
                "Complex Carbohydrates",
                "Protein"
            ],
            "foods": [
                "Oats",
                "Brown Rice",
                "Eggs",
                "Greek Yogurt"
            ],
            "tip":
            "Your body is well prepared for higher training intensity."
        }
    elif phase == "ovulation":
        return {
            "priorityNutrients": [
                "Protein",
                "Electrolytes"
            ],
            "foods": [
                "Chicken",
                "Banana",
                "Coconut Water",
                "Rice"
            ],
            "tip":
            "A good phase for performance-focused sessions."
        }
    elif phase == "early luteal":
        return {
            "priorityNutrients": [
                "Protein",
                "Healthy Fats"
            ],
            "foods": [
                "Salmon",
                "Nuts",
                "Avocado",
                "Greek Yogurt"
            ],
            "tip":
            "Support recovery and maintain consistent energy."
        }
    else:
        return {
            "priorityNutrients": [
                "Magnesium",
                "Vitamin B6",
                "Fiber"
            ],
            "foods": [
                "Pumpkin Seeds",
                "Banana",
                "Dark Chocolate",
                "Leafy Greens"
            ],
            "tip":
            "Manage cravings with balanced meals and hydrate well."
        }

def calculate_macros(
    weight: float,
    intensity: str,
):
    protein = round(weight * 0.3)
    if intensity == "High":
        carbs = round(weight * 1.2)
    elif intensity == "Moderate":
        carbs = round(weight * 0.8)
    elif intensity == "Light":
        carbs = round(weight * 0.5)
    else:
        carbs = round(weight * 0.3)

    fats = round(weight * 0.15)

    calories = (
        protein * 4 +
        carbs * 4 +
        fats * 9
    )

    return calories, protein, carbs, fats

def hydration(intensity="Moderate", weight=60.0, duration=45):
    if intensity == "High":
        return "600-750 mL"
    elif intensity == "Moderate":
        return "500-600 mL"
    elif intensity == "Light":
        return "350-500 mL"
    return "300-400 mL"

def meal_timing(workout_time):
    if not workout_time:
        return "60-90 minutes before workout"
    workout_time = str(workout_time).lower()
    if workout_time == "morning":
        return "30-60 minutes before workout"
    return "60-90 minutes before workout"


def focus_nutrients(intensity):

    if intensity == "High":
        return [
            "Complex Carbohydrates",
            "Electrolytes",
            "Protein"
        ]

    elif intensity == "Moderate":
        return [
            "Carbohydrates",
            "Protein"
        ]

    return [
        "Light Carbohydrates",
        "Hydration"
    ]


def recommended_foods(intensity="Moderate", phase="follicular", goal="Build Muscle"):

    if intensity == "High":

        return [

            "Oats with Banana",

            "Peanut Butter Toast",

            "Greek Yogurt with Fruits",

            "Rice + Eggs",

            "Fruit Smoothie"

        ]

    elif intensity == "Moderate":

        return [

            "Banana",

            "Peanut Butter Sandwich",

            "Curd with Fruits",

            "Oats"

        ]

    return [

        "Apple",

        "Banana",

        "Coconut Water"

    ]


def generate_pre_workout_plan(
    weight: float,
    intensity: str,
    workout_type: str,
    workout_time: str,
    goal: str,
    phase: str,
) -> Dict:

    calories, protein, carbs, fats = calculate_macros(
        weight,
        intensity,
    )

    phase_info = phase_recommendations(phase)

    return {

        "calories": calories,

        "protein": protein,

        "carbs": carbs,

        "fats": fats,

        "hydration": hydration(intensity),

        "mealTiming": meal_timing(workout_time),

        "focusNutrients": focus_nutrients(intensity),

        "recommendedFoods": recommended_foods(intensity, phase, goal),

        "priorityNutrients": phase_info["priorityNutrients"],

        "phaseFoods": phase_info["foods"],

        "phaseTip": phase_info["tip"],

    }


if __name__ == "__main__":

    plan = generate_pre_workout_plan(

        weight=55,

        intensity="High",

        workout_type="Strength",

        workout_time="Evening",

        goal="Build Muscle",

        phase="Follicular"

    )

    from pprint import pprint

    pprint(plan)