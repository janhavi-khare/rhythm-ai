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
    if score >= 81:
        return "High Readiness"
    if score >= 61:
        return "Good Readiness"
    if score >= 41:
        return "Moderate Readiness"
    if score >= 21:
        return "Low Readiness"
    return "Recovery Required"


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


def get_readiness_summary(score: int, sleep_quality: str = "Good", energy: int = 3) -> str:
    if score >= 80:
        return "Recovery score and sleep quality support today's prescribed workload."
    elif score >= 60:
        return "Balanced recovery supports productive training with controlled intensity."
    else:
        return "Reduced recovery suggests lowering today's overall training demand."


def get_fatigue_summary(score: int) -> str:
    if score >= 60:
        return "Elevated fatigue warrants lighter training and greater recovery emphasis."
    elif score >= 35:
        return "Fatigue remains manageable with today's adjusted training volume."
    else:
        return "Minimal system fatigue allows optimal adaptation to training stimulus."


def get_phase_summary(phase_name: str) -> str:
    phase = (phase_name or "").lower()
    if "follicular" in phase:
        return "Current hormonal profile supports progressive training and energy production."
    elif "ovulation" in phase or "ovulatory" in phase:
        return "Estrogen peak provides high neurological drive and strength capacity."
    elif "early luteal" in phase:
        return "Transitioning hormones favor steady aerobic and metabolic conditioning."
    elif "luteal" in phase:
        return "Recovery-focused training better aligns with today's biological state."
    elif "menstrual" in phase or "period" in phase:
        return "Restorative movement supports biological recovery during active menses."
    return "Hormonal profile aligns with balanced training and recovery protocol."
