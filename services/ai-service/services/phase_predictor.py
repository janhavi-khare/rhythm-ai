import joblib
import pandas as pd
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__), "phase_classifier.pkl"
)

model = joblib.load(MODEL_PATH)

SLEEP_MAP = {
    "Poor": 0,
    "Average": 1,
    "Good": 2,
    "Very Good": 3
}

BLOATING_MAP = {
    "None": 0,
    "Mild": 2,
    "Moderate": 4,
    "Severe": 5
}

CRAVINGS_MAP = {
    "None": 0,
    "Low": 2,
    "Mild": 2,
    "Strong": 5
}


def predict_phase(checkin):
    # Safely extract energy from subjectiveEnergy or energy with fallback 3
    raw_energy = checkin.get("subjectiveEnergy")
    if raw_energy is None:
        raw_energy = checkin.get("energy", 3)
    try:
        energy = int(raw_energy)
    except (ValueError, TypeError):
        energy = 3

    # Safely extract sleep quality with fallback "Good"
    sleep_quality = checkin.get("sleepQuality") or "Good"
    sleep_val = SLEEP_MAP.get(sleep_quality, SLEEP_MAP.get("Good", 2))

    # Safely extract cycle day
    cycle_day = checkin.get("cycleDay", 14)
    try:
        cycle_day = int(cycle_day)
    except (ValueError, TypeError):
        cycle_day = 14

    # Temporary cap for the current ML model
    cycle_day = min(cycle_day, 28)

    """# Rule-based overrides
    if cycle_day <= 5:
        return {
            "prediction": "Menstrual",
            "confidence": 0.98
        }

    if 13 <= cycle_day <= 16:
        return {
            "prediction": "Ovulation",
            "confidence": 0.95
        }

    if cycle_day >= 26:
        return {
            "prediction": "Luteal",
            "confidence": 0.95
        }"""

    # Otherwise continue to the ML model

    # Safely extract optional mood with fallback 3
    raw_mood = checkin.get("mood")
    if raw_mood is None:
        mood = 3
    else:
        try:
            mood = int(raw_mood)
        except (ValueError, TypeError):
            mood = 3

    # Safely extract optional bloating with fallback "None" (0)
    bloating = checkin.get("bloating") or "None"
    bloating_val = BLOATING_MAP.get(bloating, 0)

    # Safely extract optional cravings with fallback "None" (0)
    cravings = checkin.get("cravings") or "None"
    cravings_val = CRAVINGS_MAP.get(cravings, 0)

    df = pd.DataFrame([{
        "cycle_day": cycle_day,
        "sleep_quality": sleep_val,
        "energy": energy,
        "mood": mood,
        "bloating": bloating_val,
        "cravings": cravings_val
    }])

    try:
        prediction = model.predict(df)[0]
        confidence = float(model.predict_proba(df).max())
    except Exception:
        prediction = "Follicular"
        confidence = 0.85

    prediction = model.predict(df)[0]
    probabilities = model.predict_proba(df)[0]

    return {
        "prediction": prediction,
        "confidence": round(confidence, 2)
    }