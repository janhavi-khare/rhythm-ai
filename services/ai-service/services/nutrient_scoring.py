from collections import defaultdict


NUTRIENTS = [
    "protein",
    "carbohydrates",
    "healthy_fats",
    "iron",
    "magnesium",
    "calcium",
    "vitamin_d",
    "vitamin_c",
    "omega3",
    "fiber",
    "hydration",
    "electrolytes",
]


class NutrientScorer:

    def __init__(self):
        self.scores = defaultdict(int)
        self.reasons = defaultdict(list)

    def add(self, nutrient, points, reason):
        self.scores[nutrient] += points
        self.reasons[nutrient].append(reason)

    ###########################################################
    # GOALS
    ###########################################################

    def score_goals(self, goals):

        if not goals:
            return

        for goal in goals:

            if goal == "Muscle Gain":
                self.add("protein", 4, "Muscle Gain goal")
                self.add("carbohydrates", 3, "Muscle Gain goal")
                self.add("hydration", 1, "Muscle Gain goal")

            elif goal == "Fat Loss":
                self.add("protein", 3, "Fat Loss goal")
                self.add("fiber", 3, "Fat Loss goal")
                self.add("hydration", 2, "Fat Loss goal")

            elif goal == "Hormonal Balance":
                self.add("healthy_fats", 3, "Hormonal Balance")
                self.add("omega3", 3, "Hormonal Balance")
                self.add("magnesium", 2, "Hormonal Balance")

            elif goal == "Improved Energy":
                self.add("iron", 2, "Energy support")
                self.add("carbohydrates", 2, "Energy support")
                self.add("hydration", 2, "Energy support")

            elif goal == "Maintenance":
                self.add("protein", 2, "Maintenance")
                self.add("hydration", 2, "Maintenance")

    ###########################################################
    # MENSTRUAL PHASE
    ###########################################################

    def score_phase(self, phase):

        if not phase:
            return

        phase = phase.lower()

        if "menstrual" in phase:

            self.add("iron", 4, "Menstrual phase")
            self.add("vitamin_c", 2, "Iron absorption")
            self.add("hydration", 2, "Fluid replacement")
            self.add("protein", 1, "Recovery")

        elif "follicular" in phase:

            self.add("protein", 2, "Follicular phase")
            self.add("carbohydrates", 2, "Higher training capacity")
            self.add("hydration", 1, "General hydration")

        elif "ovulation" in phase:

            self.add("protein", 2, "Ovulation")
            self.add("hydration", 2, "Higher performance")
            self.add("electrolytes", 2, "Sweat losses")

        elif "early luteal" in phase:

            self.add("protein", 3, "Early Luteal")
            self.add("carbohydrates", 2, "Higher energy demand")
            self.add("magnesium", 3, "PMS prevention")
            self.add("calcium", 2, "PMS prevention")
            self.add("hydration", 2, "Hydration")

        elif "late luteal" in phase:

            self.add("magnesium", 4, "Late Luteal")
            self.add("healthy_fats", 3, "Hormonal support")
            self.add("fiber", 2, "Digestion")
            self.add("hydration", 2, "Hydration")

    ###########################################################
    # RECOVERY
    ###########################################################

    def score_recovery(self, recovery):

        if recovery is None:
            return

        if recovery >= 80:

            self.add("protein", 1, "Maintain recovery")

        elif recovery >= 60:

            self.add("protein", 2, "Moderate recovery")
            self.add("hydration", 2, "Moderate recovery")

        else:

            self.add("protein", 4, "Poor recovery")
            self.add("hydration", 4, "Poor recovery")
            self.add("electrolytes", 3, "Poor recovery")
            self.add("omega3", 2, "Reduce inflammation")

    ###########################################################
    # READINESS
    ###########################################################

    def score_readiness(self, readiness):

        if readiness is None:
            return

        if readiness < 50:
            self.add("protein", 2, "Low readiness")
            self.add("hydration", 2, "Low readiness")

    ###########################################################
    # FATIGUE
    ###########################################################

    def score_fatigue(self, fatigue):

        if fatigue is None:
            return

        if fatigue >= 70:
            self.add("magnesium", 3, "High fatigue")
            self.add("hydration", 2, "High fatigue")
            self.add("omega3", 2, "Recovery")

    ###########################################################
    # SLEEP
    ###########################################################

    def score_sleep(self, sleep):

        if not sleep:
            return

        sleep = sleep.lower()

        if sleep == "poor":

            self.add("magnesium", 2, "Poor sleep")
            self.add("protein", 1, "Poor sleep")
            self.add("hydration", 1, "Poor sleep")

    ###########################################################
    # STRESS
    ###########################################################

    def score_stress(self, stress):

        if not stress:
            return

        stress = stress.lower()

        if stress in ["high", "very high"]:

            self.add("magnesium", 3, "Stress")
            self.add("omega3", 2, "Stress")
            self.add("hydration", 1, "Stress")

    ###########################################################
    # ENERGY
    ###########################################################

    def score_energy(self, energy):

        if energy is None:
            return

        if energy <= 2:

            self.add("carbohydrates", 2, "Low energy")
            self.add("iron", 2, "Low energy")
            self.add("hydration", 1, "Low energy")

    ###########################################################
    # SORENESS
    ###########################################################

    def score_soreness(self, soreness):

        if not soreness:
            return

        soreness = soreness.lower()

        if soreness in ["moderate", "high", "severe"]:

            self.add("protein", 3, "Muscle soreness")
            self.add("omega3", 2, "Inflammation")
            self.add("hydration", 2, "Recovery")

    ###########################################################
    # WORKOUT
    ###########################################################

    def score_workout(self, intensity, duration):

        if duration and duration >= 60:

            self.add("carbohydrates", 2, "Long workout")
            self.add("hydration", 3, "Long workout")
            self.add("electrolytes", 3, "Long workout")

        if intensity:

            intensity = intensity.lower()

            if intensity == "intense":

                self.add("protein", 2, "High intensity")
                self.add("carbohydrates", 2, "High intensity")
                self.add("hydration", 2, "High intensity")

    ###########################################################
    # MAIN
    ###########################################################

    def calculate(
        self,
        profile,
        checkin,
        predictions,
        workout=None,
    ):

        self.score_goals(profile.get("goals", []))

        self.score_phase(predictions.get("phase"))

        self.score_recovery(predictions.get("recovery"))

        self.score_readiness(predictions.get("readiness"))

        self.score_fatigue(predictions.get("fatigue"))

        self.score_sleep(checkin.get("sleepQuality"))

        self.score_stress(checkin.get("stress"))

        self.score_energy(checkin.get("subjectiveEnergy"))

        self.score_soreness(checkin.get("soreness"))

        if workout:

            self.score_workout(
                workout.get("intensity"),
                workout.get("duration"),
            )

        ranked = sorted(
            self.scores.items(),
            key=lambda x: x[1],
            reverse=True,
        )

        return {
            "scores": dict(self.scores),
            "top_priorities": ranked[:3],
            "all_priorities": ranked,
            "reasons": dict(self.reasons),
        }


def score_nutrients(profile, checkin, predictions, workout=None):
    scorer = NutrientScorer()
    return scorer.calculate(profile, checkin, predictions, workout)