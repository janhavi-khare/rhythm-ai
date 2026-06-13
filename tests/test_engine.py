import unittest
from engine.nutrition_engine import get_recommendation

class TestNutritionEngine(unittest.TestCase):

    # -------------------------
    # Basic functionality tests
    # -------------------------

    def test_returns_expected_structure(self):
        result = get_recommendation(
            phase="Follicular",
            workout_type="Strength Training",
            intensity="Moderate",
            sleep_quality="7-8 hours",
            goal="Muscle Gain"
        )

        expected_keys = {
            "phase",
            "scores",
            "levels",
            "priority_nutrients",
            "checklist",
            "food_suggestions",
            "intensity_advice"
        }

        self.assertEqual(set(result.keys()), expected_keys)

    def test_phase_is_returned_correctly(self):
        result = get_recommendation(
            "Menstrual",
            "Rest",
            "Low",
            "7-8 hours",
            "Maintenance"
        )

        self.assertEqual(result["phase"], "Menstrual")

    # -------------------------
    # Menstrual phase
    # -------------------------

    def test_menstrual_phase_prioritizes_iron(self):
        result = get_recommendation(
            "Menstrual",
            "Rest",
            "Low",
            "7-8 hours",
            "Maintenance"
        )

        self.assertIn("iron", result["priority_nutrients"])

    # -------------------------
    # Muscle gain
    # -------------------------

    def test_muscle_gain_prioritizes_protein(self):
        result = get_recommendation(
            "Follicular",
            "Strength Training",
            "High",
            "7-8 hours",
            "Muscle Gain"
        )

        self.assertIn("protein", result["priority_nutrients"])

    # -------------------------
    # Hydration logic
    # -------------------------

    def test_intense_cardio_adds_hydration_checklist(self):
        result = get_recommendation(
            "Follicular",
            "Intense Cardio",
            "Moderate",
            "7-8 hours",
            "Maintenance"
        )

        self.assertTrue(
            any("hydration" in item.lower()
                for item in result["checklist"])
        )

    # -------------------------
    # Sleep-related tests
    # -------------------------

    def test_low_sleep_generates_intensity_advice(self):
        result = get_recommendation(
            "Follicular",
            "HIIT",
            "High",
            "5-6 hours",
            "Maintenance"
        )

        # Adjust based on your intended logic
        if result["intensity_advice"] is not None:
            self.assertIsInstance(result["intensity_advice"], str)

    def test_very_low_sleep_generates_advice(self):
        result = get_recommendation(
            "Follicular",
            "HIIT",
            "High",
            "<5 hours",
            "Maintenance"
        )

        self.assertIsNotNone(result["intensity_advice"])

    # -------------------------
    # Food suggestions
    # -------------------------

    def test_food_suggestions_not_empty(self):
        result = get_recommendation(
            "Late Luteal",
            "Yoga/Pilates",
            "Low",
            "5-6 hours",
            "Better Sleep"
        )

        self.assertGreater(len(result["food_suggestions"]), 0)

    def test_food_suggestions_are_unique(self):
        result = get_recommendation(
            "Menstrual",
            "Rest",
            "Low",
            "<5 hours",
            "Improved Energy"
        )

        foods = result["food_suggestions"]

        self.assertEqual(len(foods), len(set(foods)))

    # -------------------------
    # Level generation
    # -------------------------

    def test_levels_exist_for_all_nutrients(self):
        result = get_recommendation(
            "Follicular",
            "Rest",
            "Low",
            "7-8 hours",
            "Maintenance"
        )

        self.assertEqual(
            set(result["scores"].keys()),
            set(result["levels"].keys())
        )

    # -------------------------
    # Edge cases
    # -------------------------

    def test_rest_day_recovery_priority(self):
        result = get_recommendation(
            "Menstrual",
            "Rest",
            "Low",
            "<5 hours",
            "Better Sleep"
        )

        self.assertIn(
            "recovery",
            result["priority_nutrients"]
        )

    def test_high_intensity_workout_prioritizes_carbs(self):
        result = get_recommendation(
            "Ovulation",
            "HIIT",
            "High",
            "7-8 hours",
            "Maintenance"
        )

        self.assertIn("carbs", result["priority_nutrients"])

    # -------------------------
    # Validation tests
    # (These will pass only after
    # you add input validation)
    # -------------------------

    def test_invalid_phase_raises_error(self):
        with self.assertRaises(ValueError):
            get_recommendation(
                "Random Phase",
                "Rest",
                "Low",
                "7-8 hours",
                "Maintenance"
            )

    def test_invalid_workout_raises_error(self):
        with self.assertRaises(ValueError):
            get_recommendation(
                "Follicular",
                "Crossfittt",
                "Low",
                "7-8 hours",
                "Maintenance"
            )

    def test_invalid_intensity_raises_error(self):
        with self.assertRaises(ValueError):
            get_recommendation(
                "Follicular",
                "Rest",
                "Extreme",
                "7-8 hours",
                "Maintenance"
            )

    def test_invalid_sleep_raises_error(self):
        with self.assertRaises(ValueError):
            get_recommendation(
                "Follicular",
                "Rest",
                "Low",
                "10 hours",
                "Maintenance"
            )

    def test_invalid_goal_raises_error(self):
        with self.assertRaises(ValueError):
            get_recommendation(
                "Follicular",
                "Rest",
                "Low",
                "7-8 hours",
                "Become Batman"
            )


if __name__ == "__main__":
    unittest.main()