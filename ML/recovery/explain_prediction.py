import joblib
import pandas as pd
import shap
from pathlib import Path

# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "recovery_model.pkl"
ENCODER_PATH = BASE_DIR / "label_encoder.pkl"

# ==========================================================
# Load Model & Encoder
# ==========================================================

model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)

explainer = shap.TreeExplainer(model)

# ==========================================================
# Friendly Names
# ==========================================================

FEATURE_MESSAGES = {
    "sleepHours": {
        "positive": "Sufficient sleep duration",
        "negative": "Insufficient sleep duration",
    },
    "sleepQuality": {
        "positive": "Good sleep quality",
        "negative": "Poor sleep quality",
    },
    "energy": {
        "positive": "High energy level",
        "negative": "Low energy level",
    },
    "mood": {
        "positive": "Positive mood",
        "negative": "Low mood",
    },
    "muscleSoreness": {
        "positive": "Low muscle soreness",
        "negative": "High muscle soreness",
    },
    "sleepDebt": {
        "positive": "Minimal sleep debt",
        "negative": "High sleep debt",
    },
    "acuteLoad": {
        "positive": "Manageable training load",
        "negative": "High recent training load",
    },
    "chronicLoad": {
        "positive": "Well-adapted training history",
        "negative": "Training history needs attention",
    },
    "phase": {
        "positive": "Current cycle phase is favorable",
        "negative": "Current cycle phase may reduce recovery",
    },
}

# ==========================================================
# Explain Prediction Function
# ==========================================================

def explain_prediction(input_data: dict):

    sample = pd.DataFrame([input_data])

    sample["phase"] = encoder.transform(sample["phase"])

    prediction = model.predict(sample)[0]

    shap_values = explainer(sample)

    values = shap_values.values[0]

    positive = []
    negative = []

    for feature, value in zip(sample.columns, values):

        if value >= 0:
            positive.append(
                (
                    FEATURE_MESSAGES[feature]["positive"],
                    float(value),
                )
            )

        else:
            negative.append(
                (
                    FEATURE_MESSAGES[feature]["negative"],
                    float(abs(value)),
                )
            )

    positive.sort(key=lambda x: x[1], reverse=True)
    negative.sort(key=lambda x: x[1], reverse=True)

    return {
        "recoveryScore": round(float(prediction), 1),

        "topPositiveFactors": [
            x[0] for x in positive[:3]
        ],

        "topNegativeFactors": [
            x[0] for x in negative[:3]
        ],

        "positiveSHAP": positive[:3],

        "negativeSHAP": negative[:3],
    }


# ==========================================================
# Example
# ==========================================================

sample_input = {
    "phase": "Follicular",
    "sleepHours": 8.1,
    "sleepQuality": 5,
    "energy": 5,
    "mood": 4,
    "muscleSoreness": 2,
    "sleepDebt": 0,
    "acuteLoad": 40,
    "chronicLoad": 45,
}

result = explain_prediction(sample_input)

print("\nRecovery Score:", result["recoveryScore"])

print("\nTop Positive Factors")

for factor in result["positiveSHAP"]:
    print(f"[+] {factor[0]} (+{factor[1]:.2f})")

print("\nTop Negative Factors")

for factor in result["negativeSHAP"]:
    print(f"[-] {factor[0]} (-{factor[1]:.2f})")