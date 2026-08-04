"""
Meal Generator

Converts nutrient priorities into practical meal suggestions.

Returns:
- Meal timing
- Meal ideas
- Recommended foods
- Foods to limit
"""

from typing import List


# -----------------------------------------
# FOOD DATABASE
# -----------------------------------------

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
        "Milk"
    ],

    "carbohydrates": [
        "Oats",
        "Banana",
        "Brown Rice",
        "Sweet Potato",
        "Whole Wheat Bread",
        "Poha",
        "Idli",
        "Quinoa"
    ],

    "healthy_fats": [
        "Almonds",
        "Walnuts",
        "Peanut Butter",
        "Avocado",
        "Seeds",
        "Olive Oil"
    ],

    "iron": [
        "Spinach",
        "Rajma",
        "Kala Chana",
        "Lentils",
        "Soybeans",
        "Dates"
    ],

    "magnesium": [
        "Pumpkin Seeds",
        "Dark Chocolate",
        "Almonds",
        "Cashews",
        "Spinach"
    ],

    "calcium": [
        "Milk",
        "Curd",
        "Paneer",
        "Tofu"
    ],

    "vitamin_c": [
        "Orange",
        "Guava",
        "Kiwi",
        "Lemon",
        "Amla"
    ],

    "vitamin_d": [
        "Eggs",
        "Fatty Fish",
        "Fortified Milk"
    ],

    "omega3": [
        "Walnuts",
        "Flax Seeds",
        "Chia Seeds",
        "Fish"
    ],

    "fiber": [
        "Apple",
        "Oats",
        "Vegetables",
        "Beans",
        "Fruits"
    ]
}


# -----------------------------------------
# MEAL TEMPLATES
# -----------------------------------------

PRE_WORKOUT = {

    "Breakfast": [
        "Oats + Banana + Milk",
        "Poha + Curd",
        "Whole Wheat Toast + Peanut Butter",
        "Greek Yogurt + Fruits"
    ],

    "Snack": [
        "Banana",
        "Dates",
        "Fruit Smoothie",
        "Trail Mix"
    ]
}


POST_WORKOUT = {

    "Meal": [
        "Rice + Paneer + Vegetables",
        "Dal + Roti + Salad",
        "Chicken + Rice + Vegetables",
        "Tofu Stir Fry + Rice"
    ],

    "Snack": [
        "Protein Shake",
        "Greek Yogurt",
        "Milk + Banana",
        "Paneer Sandwich"
    ]
}


# -----------------------------------------
# FUNCTIONS
# -----------------------------------------

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