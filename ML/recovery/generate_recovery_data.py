import random
import numpy as np

BASE_RECOVERY = 60

def generate_phase():
    phases = [
        "Menstrual",
        "Follicular",
        "Ovulation",
        "Early Luteal",
        "Late Luteal",
    ]

    weights = [0.17, 0.31, 0.10, 0.21, 0.21]
    return random.choices(phases, weights=weights, k=1)[0]


def generate_sleep_hours(phase):
    mean = 7.0

    if phase == "Menstrual":
        mean -= 0.3
    elif phase == "Follicular":
        mean += 0.2
    elif phase == "Ovulation":
        mean += 0.1
    elif phase == "Late Luteal":
        mean -= 0.4

    sleep_hours = np.random.normal(loc=mean, scale=1)
    sleep_hours = np.clip(sleep_hours, 3.5, 9.5)

    return round(float(sleep_hours), 1)


def generate_sleep_quality(sleep_hours, phase):

    if sleep_hours <= 5:
        mean_quality = 1.8
    elif sleep_hours <= 7:
        mean_quality = 3.0
    elif sleep_hours <= 8.5:
        mean_quality = 4.0
    else:
        mean_quality = 4.5

    if phase == "Late Luteal":
        mean_quality -= 0.3
    elif phase == "Menstrual":
        mean_quality -= 0.2
    elif phase == "Follicular":
        mean_quality += 0.2

    quality = np.random.normal(mean_quality, 0.6)
    quality = np.clip(quality, 1, 5)

    return int(round(quality))


def calculate_energy(sleep_hours, sleep_quality, muscle_soreness, phase):
    energy = 3.0

    # Sleep Duration
    energy += 0.15 * (sleep_hours - 7)

    # Sleep Quality
    energy += 0.30 * (sleep_quality - 3)

    # Muscle soreness reduces perceived energy
    energy -= 0.25 * (muscle_soreness - 2)

    # Phase adjustments
    if phase == "Follicular":
        energy += 0.3
    elif phase == "Ovulation":
        energy += 0.5
    elif phase == "Menstrual":
        energy -= 0.3
    elif phase == "Late Luteal":
        energy -= 0.4

    energy += np.random.normal(0, 0.5)

    energy = np.clip(energy, 1, 5)

    return int(round(energy))


def generate_mood(
    energy,
    sleep_quality,
    phase,
):
    mood = 3.0

    mood += 0.45 * (energy - 3)
    mood += 0.15 * (sleep_quality - 3)

    if phase == "Follicular":
        mood += 0.2
    elif phase == "Ovulation":
        mood += 0.4
    elif phase == "Menstrual":
        mood -= 0.3
    elif phase == "Late Luteal":
        mood -= 0.5

    mood += np.random.normal(0, 0.6)

    mood = np.clip(mood, 1, 5)

    return int(round(mood))


def generate_acute_load():

    if random.random() < 0.2:
        acute_load = np.random.uniform(0, 150)
    else:
        acute_load = np.random.gamma(shape=2.5, scale=120)

    return float(np.clip(acute_load, 0, 800))


def generate_chronic_load(acute_load):

    variation = np.random.normal(0, 80)

    chronic_load = acute_load + variation

    chronic_load = np.clip(
        chronic_load,
        0,
        max(acute_load + 100, 0)
    )

    return float(chronic_load)


def calculate_sleep_debt(sleep_hours):

    debt = max(0, 8 - sleep_hours)

    return round(float(debt), 1)


def calculate_muscle_soreness(acute_load):

    soreness = (
        1
        + acute_load / 200
        + np.random.normal(0, 0.3)
    )

    soreness = np.clip(soreness, 1, 5)

    return int(round(soreness))


PHASE_ADJUSTMENTS = {
    "Menstrual": -3,
    "Follicular": 2,
    "Ovulation": 4,
    "Early Luteal": 1,
    "Late Luteal": -2,
}

def calculate_recovery_score(
    phase,
    sleep_hours,
    sleep_quality,
    energy,
    mood,
    muscle_soreness,
    sleep_debt,
    acute_load,
):

    score = 60

    # Primary Recovery Drivers
    score += (sleep_hours - 7) * 5
    score += (sleep_quality - 3) * 6

    # Training Stress
    score -= (muscle_soreness - 1) * 5
    score -= acute_load / 50

    # Sleep Debt
    score -= sleep_debt * 3

    # Secondary Indicators
    score += (energy - 3) * 1.5
    score += (mood - 3) * 0.5

    # Phase
    score += PHASE_ADJUSTMENTS[phase]

    # Biological variability
    score += np.random.normal(0, 3)

    score = np.clip(score, 0, 100)

    return round(float(score), 1)

def generate_features():

    phase = generate_phase()

    sleep_hours = generate_sleep_hours(phase)

    sleep_quality = generate_sleep_quality(
        sleep_hours,
        phase,
    )

    acute_load = generate_acute_load()

    chronic_load = generate_chronic_load(
        acute_load,
    )

    muscle_soreness = calculate_muscle_soreness(
        acute_load,
    )

    sleep_debt = calculate_sleep_debt(
        sleep_hours,
    )

    energy = calculate_energy(
        sleep_hours,
        sleep_quality,
        muscle_soreness,
        phase,
    )

    mood = generate_mood(
        energy,
        sleep_quality,
        phase,
    )

    recovery_score = calculate_recovery_score(
        phase,
        sleep_hours,
        sleep_quality,
        energy,
        mood,
        muscle_soreness,
        sleep_debt,
        acute_load,
    )

    return {
        "phase": phase,
        "sleepHours": sleep_hours,
        "sleepQuality": sleep_quality,
        "energy": energy,
        "mood": mood,
        "muscleSoreness": muscle_soreness,
        "sleepDebt": sleep_debt,
        "acuteLoad": round(acute_load, 1),
        "chronicLoad": round(chronic_load, 1),
        "recoveryScore": recovery_score,
    }
