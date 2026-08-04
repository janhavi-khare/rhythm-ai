def get_phase_description(phase: str) -> str:
    phase = (phase or "").lower()

    mapping = {
        "menstrual": "Recovery Phase",
        "follicular": "Energy Rising",
        "ovulation": "Peak Performance",
        "early luteal": "Recovery Focus",
        "late luteal": "Energy Conservation",
    }

    return mapping.get(phase, "Daily Wellness")


def get_readiness_label(score: int) -> str:
    if score >= 85:
        return "Peak Performance"

    if score >= 70:
        return "Ready to Train"

    if score >= 55:
        return "Moderate Readiness"

    return "Recovery Recommended"


def get_fatigue_label(score: int) -> str:
    if score < 35:
        return "Low"

    if score < 70:
        return "Moderate"

    return "High"


def get_workout_badge(score: int) -> str:
    if score >= 85:
        return "Peak Session"
    elif score >= 70:
        return "Target Session"
    elif score >= 55:
        return "Moderate Session"
    else:
        return "Recovery Session"
