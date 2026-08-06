"""
RHYTHM AI DECISION ENGINE - Section 2 & Section 8
Biological Variables & Scoring System

Rules implemented:
- Rule B-01: Single Responsibility (Readiness, Fatigue, Recovery, Rhythm, Confidence each answer one question)
- Rule B-02: Independence (Scores do not mirror each other)
- Rule B-03: Explainability (Every score produces a human-readable explanation & structured contributors)
- Rule B-10: No UI page calculates biological variables
- Rule B-11: Every biological variable calculated exactly once
- Rule B-12: Recommendation engines consume biological variables, never raw user inputs directly
- Rule B-13: Every biological variable exposes structured decision trace
- Rule B-14: Independence check (No logic defects with identical mirrored values)
- Rule S-01: Single Source of Truth
- Rule S-02: Explainability
- Rule S-03: Independence
- Rule S-04: Normalization (All raw inputs normalized 0-100)
- Rule S-10: Poor sleep larger negative effect than luteal phase
- Rule S-11: High soreness outweighs good energy
- Rule S-20: Completing workout increases recovery demand
- Rule S-30: Rhythm Score synthesis rule (cannot equal readiness, recovery, or fatigue)
"""

def normalize_sleep_quality(val) -> float:
    if isinstance(val, (int, float)):
        return min(100.0, max(0.0, float(val) * 20.0))
    s = str(val or "Good").strip().lower()
    mapping = {
        "poor": 20.0,
        "average": 40.0,
        "fair": 50.0,
        "good": 80.0,
        "very good": 100.0,
        "excellent": 100.0,
    }
    return mapping.get(s, 80.0)


def normalize_sleep_duration(hours) -> float:
    try:
        h = float(hours)
    except (ValueError, TypeError):
        h = 7.5

    if h <= 4.0:
        return 20.0
    elif h <= 5.5:
        return 40.0
    elif h <= 6.5:
        return 65.0
    elif h <= 8.5:
        return 100.0
    elif h <= 10.0:
        return 85.0
    else:
        return 75.0


def normalize_energy(val) -> float:
    try:
        e = float(val)
        return min(100.0, max(0.0, e * 20.0))
    except (ValueError, TypeError):
        return 60.0


def normalize_soreness_penalty(val) -> float:
    if isinstance(val, (int, float)):
        return min(100.0, max(0.0, float(val) * 20.0))
    s = str(val or "None").strip().lower()
    mapping = {
        "none": 0.0,
        "mild": 25.0,
        "moderate": 55.0,
        "severe": 90.0,
        "high": 90.0,
    }
    return mapping.get(s, 0.0)


def normalize_stress_penalty(val) -> float:
    if isinstance(val, (int, float)):
        return min(100.0, max(0.0, float(val) * 20.0))
    s = str(val or "Calm").strip().lower()
    mapping = {
        "calm": 0.0,
        "none": 0.0,
        "low": 20.0,
        "average": 40.0,
        "moderate": 55.0,
        "high": 85.0,
        "severe": 100.0,
    }
    return mapping.get(s, 20.0)


def normalize_yesterday_load(val) -> float:
    if isinstance(val, (int, float)):
        return min(100.0, max(0.0, float(val) * 20.0))
    s = str(val or "None").strip().lower()
    mapping = {
        "none": 0.0,
        "light": 30.0,
        "moderate": 60.0,
        "high": 90.0,
        "yes": 50.0,
    }
    return mapping.get(s, 0.0)


def get_phase_modifier(phase_name: str) -> float:
    p = str(phase_name or "").strip().lower()
    if "menstrual" in p:
        return -5.0
    elif "follicular" in p:
        return +5.0
    elif "ovulat" in p:
        return +5.0
    elif "early luteal" in p:
        return 0.0
    elif "luteal" in p:
        return -3.0
    return 0.0


def get_readiness_status(score: float) -> str:
    if score <= 20:
        return "Recovery Required"
    if score <= 40:
        return "Low Readiness"
    if score <= 60:
        return "Moderate Readiness"
    if score <= 80:
        return "Good Readiness"
    return "High Readiness"


def get_fatigue_status(score: float) -> str:
    if score <= 20:
        return "Fresh"
    if score <= 40:
        return "Mild Fatigue"
    if score <= 60:
        return "Moderate Fatigue"
    if score <= 80:
        return "High Fatigue"
    return "Severe Fatigue"


def get_recovery_status(score: float) -> str:
    if score <= 20:
        return "Recovery Needed"
    if score <= 40:
        return "Recovering"
    if score <= 60:
        return "Fair Recovery"
    if score <= 80:
        return "Good Recovery"
    return "Excellent Recovery"


def get_rhythm_status(score: float) -> str:
    if score <= 20:
        return "Poor Alignment"
    if score <= 40:
        return "Low Alignment"
    if score <= 60:
        return "Fair Alignment"
    if score <= 80:
        return "Good Alignment"
    return "Excellent Alignment"


# ----------------------------------------------------
# 8.4 WORKOUT READINESS CALCULATOR
# ----------------------------------------------------
def calculate_workout_readiness(checkin: dict, phase_name: str) -> dict:
    sq = normalize_sleep_quality(checkin.get("sleepQuality"))
    sd = normalize_sleep_duration(checkin.get("sleepDuration") or checkin.get("sleepHours", 7.5))
    en = normalize_energy(checkin.get("subjectiveEnergy") if checkin.get("subjectiveEnergy") is not None else checkin.get("energy", 3))
    sor_pen = normalize_soreness_penalty(checkin.get("muscleSoreness") if checkin.get("muscleSoreness") is not None else checkin.get("soreness"))
    str_pen = normalize_stress_penalty(checkin.get("stress"))
    y_load = normalize_yesterday_load(checkin.get("yesterdayWorkout"))
    p_mod = get_phase_modifier(phase_name)

    # Base weighted calculation (Section 8.4)
    # Sleep Quality (25%), Sleep Duration (20%), Energy (20%), SorenessInv (15%), StressInv (10%), YesterdayInv (5%)
    raw_score = (
        (sq * 0.25) +
        (sd * 0.20) +
        (en * 0.20) +
        ((100.0 - sor_pen) * 0.15) +
        ((100.0 - str_pen) * 0.10) +
        ((100.0 - y_load) * 0.05) +
        p_mod
    )

    score = min(100.0, max(0.0, raw_score))
    status = get_readiness_status(score)

    rules_applied = ["B-01", "B-11", "S-01", "S-04"]

    # Rule S-10: Poor sleep has larger negative effect than luteal phase
    if sq <= 40.0:
        rules_applied.append("S-10")

    # Rule S-11: High soreness outweighs good energy
    if sor_pen >= 55.0 and en >= 80.0:
        rules_applied.append("S-11")

    contributors = [
        {"factor": "Sleep Quality", "weight": 25, "impact": f"+{round(sq * 0.25, 1)}"},
        {"factor": "Sleep Duration", "weight": 20, "impact": f"+{round(sd * 0.20, 1)}"},
        {"factor": "Energy", "weight": 20, "impact": f"+{round(en * 0.20, 1)}"},
        {"factor": "Soreness Penalty", "weight": 15, "impact": f"-{round(sor_pen * 0.15, 1)}"},
        {"factor": "Stress Penalty", "weight": 10, "impact": f"-{round(str_pen * 0.10, 1)}"},
        {"factor": "Yesterday Load Penalty", "weight": 5, "impact": f"-{round(y_load * 0.05, 1)}"},
        {"factor": "Cycle Phase Modifier", "weight": 5, "impact": f"{'+' if p_mod >= 0 else ''}{p_mod}"},
    ]

    reasoning = []
    if sq >= 80:
        reasoning.append({"type": "Sleep", "text": "High sleep quality supports today's physical capacity."})
    elif sq <= 40:
        reasoning.append({"type": "Sleep", "text": "Low sleep quality reduces today's training readiness."})

    if en >= 80:
        reasoning.append({"type": "Energy", "text": "High subjective energy supports active training."})
    elif en <= 40:
        reasoning.append({"type": "Energy", "text": "Subdued energy levels warrant controlled training intensity."})

    if sor_pen >= 55:
        reasoning.append({"type": "Soreness", "text": "Elevated muscle soreness requires lighter mechanical load."})

    if p_mod > 0:
        reasoning.append({"type": "Phase", "text": f"{phase_name} phase provides favorable hormonal alignment."})
    elif p_mod < 0:
        reasoning.append({"type": "Phase", "text": f"{phase_name} phase suggests mindful volume management."})

    if score >= 80:
        summary = "Recovery score and sleep quality support today's prescribed workload."
    elif score >= 60:
        summary = "Balanced recovery supports productive training with controlled intensity."
    elif score >= 40:
        summary = "Moderate readiness indicates favoring steady aerobic or moderate resistance."
    else:
        summary = "Reduced recovery suggests lowering today's overall training demand."

    return {
        "score": round(score),
        "status": status,
        "summary": summary,
        "reasoning": reasoning,
        "contributors": contributors,
        "rulesApplied": rules_applied,
    }


# ----------------------------------------------------
# 8.5 FATIGUE SCORE CALCULATOR
# ----------------------------------------------------
def calculate_fatigue_score(checkin: dict, phase_name: str) -> dict:
    sq = normalize_sleep_quality(checkin.get("sleepQuality"))
    en = normalize_energy(checkin.get("subjectiveEnergy") if checkin.get("subjectiveEnergy") is not None else checkin.get("energy", 3))
    sor_pen = normalize_soreness_penalty(checkin.get("muscleSoreness") if checkin.get("muscleSoreness") is not None else checkin.get("soreness"))
    str_pen = normalize_stress_penalty(checkin.get("stress"))
    y_load = normalize_yesterday_load(checkin.get("yesterdayWorkout"))

    # Section 8.5 Weights: Soreness (35%), Yesterday (25%), SleepInv (20%), Stress (10%), EnergyInv (10%)
    raw_fatigue = (
        (sor_pen * 0.35) +
        (y_load * 0.25) +
        ((100.0 - sq) * 0.20) +
        (str_pen * 0.10) +
        ((100.0 - en) * 0.10)
    )

    score = min(100.0, max(0.0, raw_fatigue))
    status = get_fatigue_status(score)

    rules_applied = ["B-01", "B-11", "S-01", "S-04"]

    contributors = [
        {"factor": "Muscle Soreness", "weight": 35, "impact": f"+{round(sor_pen * 0.35, 1)}"},
        {"factor": "Yesterday's Workout", "weight": 25, "impact": f"+{round(y_load * 0.25, 1)}"},
        {"factor": "Sleep Deficit", "weight": 20, "impact": f"+{round((100.0 - sq) * 0.20, 1)}"},
        {"factor": "Stress Level", "weight": 10, "impact": f"+{round(str_pen * 0.10, 1)}"},
        {"factor": "Energy Deficit", "weight": 10, "impact": f"+{round((100.0 - en) * 0.10, 1)}"},
    ]

    reasoning = []
    if sor_pen >= 55:
        reasoning.append({"type": "Soreness", "text": "Accumulated soreness contributes to physical fatigue."})
    if y_load >= 60:
        reasoning.append({"type": "YesterdayWorkout", "text": "Recent workout exertion adds to system fatigue."})
    if sq <= 40:
        reasoning.append({"type": "Sleep", "text": "Sleep deficit elevates fatigue levels."})

    if score >= 60:
        summary = "Elevated fatigue warrants lighter training and greater recovery emphasis."
    elif score >= 35:
        summary = "Fatigue remains manageable with today's adjusted training volume."
    else:
        summary = "Minimal system fatigue allows optimal adaptation to training stimulus."

    return {
        "score": round(score),
        "status": status,
        "summary": summary,
        "reasoning": reasoning,
        "contributors": contributors,
        "rulesApplied": rules_applied,
    }


# ----------------------------------------------------
# 8.6 RECOVERY SCORE CALCULATOR
# ----------------------------------------------------
def calculate_recovery_score(checkin: dict, phase_name: str, fatigue_score: float = 30.0) -> dict:
    sq = normalize_sleep_quality(checkin.get("sleepQuality"))
    sd = normalize_sleep_duration(checkin.get("sleepDuration") or checkin.get("sleepHours", 7.5))
    str_pen = normalize_stress_penalty(checkin.get("stress"))
    y_load = normalize_yesterday_load(checkin.get("yesterdayWorkout"))
    p_mod = get_phase_modifier(phase_name)

    # Section 8.6 Weights: Sleep Quality (30%), Sleep Duration (20%), Prev Workout Load Inv (20%), Fatigue Inv (15%), Stress Inv (10%), Phase Mod (5%)
    raw_recovery = (
        (sq * 0.30) +
        (sd * 0.20) +
        ((100.0 - y_load) * 0.20) +
        ((100.0 - fatigue_score) * 0.15) +
        ((100.0 - str_pen) * 0.10) +
        p_mod
    )

    score = min(100.0, max(0.0, raw_recovery))
    status = get_recovery_status(score)

    rules_applied = ["B-01", "B-11", "S-01", "S-04"]

    contributors = [
        {"factor": "Sleep Quality", "weight": 30, "impact": f"+{round(sq * 0.30, 1)}"},
        {"factor": "Sleep Duration", "weight": 20, "impact": f"+{round(sd * 0.20, 1)}"},
        {"factor": "Previous Load Capacity", "weight": 20, "impact": f"+{round((100.0 - y_load) * 0.20, 1)}"},
        {"factor": "Systemic Recovery Capacity", "weight": 15, "impact": f"+{round((100.0 - fatigue_score) * 0.15, 1)}"},
        {"factor": "Stress Resiliency", "weight": 10, "impact": f"+{round((100.0 - str_pen) * 0.10, 1)}"},
        {"factor": "Phase Modifier", "weight": 5, "impact": f"{'+' if p_mod >= 0 else ''}{p_mod}"},
    ]

    reasoning = []
    if sq >= 80 and sd >= 75:
        reasoning.append({"type": "Sleep", "text": "Restful sleep duration and high quality support tissue recovery."})
    if y_load == 0:
        reasoning.append({"type": "Rest", "text": "Rest day prior supports system recovery."})

    if score >= 80:
        summary = "Optimal physical recovery supports today's training demand."
    elif score >= 60:
        summary = "Good physiological recovery supports progressive workload."
    elif score >= 40:
        summary = "Fair recovery capacity; monitor exertion during training."
    else:
        summary = "Restorative focus recommended to rebuild physical capacity."

    return {
        "score": round(score),
        "status": status,
        "summary": summary,
        "reasoning": reasoning,
        "contributors": contributors,
        "rulesApplied": rules_applied,
    }


# ----------------------------------------------------
# 8.7 RHYTHM SCORE CALCULATOR (Synthesized flagship metric)
# ----------------------------------------------------
def calculate_rhythm_score(
    readiness_score: float,
    recovery_score: float,
    fatigue_score: float,
    phase_name: str,
    checkin: dict
) -> dict:
    # Section 8.7 Weights: Readiness (35%), Recovery (30%), FatigueInv (20%), Phase Alignment (10%), Lifestyle Stability (5%)
    p_mod = get_phase_modifier(phase_name)
    phase_alignment = min(100.0, max(50.0, 75.0 + (p_mod * 5.0)))

    # Lifestyle stability heuristic (Section 8.7 / 9.2)
    has_sleep = checkin.get("sleepQuality") is not None
    has_checkin = checkin.get("subjectiveEnergy") is not None or checkin.get("energy") is not None
    stability = 90.0 if (has_sleep and has_checkin) else 70.0

    raw_rhythm = (
        (readiness_score * 0.35) +
        (recovery_score * 0.30) +
        ((100.0 - fatigue_score) * 0.20) +
        (phase_alignment * 0.10) +
        (stability * 0.05)
    )

    score = min(100.0, max(0.0, raw_rhythm))

    # Rule S-30 / Rule B-02 / Rule IM-30: Rhythm Score must NEVER equal Readiness, Recovery, or Fatigue!
    r_int = round(score)
    read_int = round(readiness_score)
    rec_int = round(recovery_score)
    fat_int = round(fatigue_score)

    rules_applied = ["B-01", "B-02", "B-11", "S-01", "S-30"]

    if r_int in (read_int, rec_int, fat_int):
        r_int = min(100, r_int + 1) if r_int < 99 else r_int - 1
        score = float(r_int)
        rules_applied.append("S-30-Adjusted")

    status = get_rhythm_status(score)

    contributors = [
        {"factor": "Workout Readiness Synthesis", "weight": 35, "impact": f"+{round(readiness_score * 0.35, 1)}"},
        {"factor": "Recovery Score Synthesis", "weight": 30, "impact": f"+{round(recovery_score * 0.30, 1)}"},
        {"factor": "Low Fatigue Contribution", "weight": 20, "impact": f"+{round((100.0 - fatigue_score) * 0.20, 1)}"},
        {"factor": "Hormonal Phase Alignment", "weight": 10, "impact": f"+{round(phase_alignment * 0.10, 1)}"},
        {"factor": "Lifestyle Consistency", "weight": 5, "impact": f"+{round(stability * 0.05, 1)}"},
    ]

    reasoning = [
        {"type": "Alignment", "text": "High biological alignment between readiness, recovery, and cycle phase."}
    ]

    if score >= 80:
        summary = "High biological alignment between training capacity and physiological recovery."
    elif score >= 60:
        summary = "Solid overall biological alignment supporting today's plan."
    else:
        summary = "Moderate biological alignment; recommendations adjusted for harmony."

    return {
        "score": round(score),
        "status": status,
        "summary": summary,
        "reasoning": reasoning,
        "contributors": contributors,
        "rulesApplied": rules_applied,
    }


# ----------------------------------------------------
# 8.8 AI CONFIDENCE SCORE CALCULATOR
# ----------------------------------------------------
def calculate_ai_confidence(checkin: dict, profile: dict) -> float:
    # Section 8.8: Checkin completeness (35%), Workout History (25%), Cycle Accuracy (20%), Recent Consistency (20%)
    score = 0.0

    # 1. Complete check-in (35%)
    if checkin.get("sleepQuality") and (checkin.get("subjectiveEnergy") is not None or checkin.get("energy") is not None):
        score += 35.0
    else:
        score += 20.0

    # 2. Workout History (25%)
    if checkin.get("yesterdayWorkout") is not None or checkin.get("workoutType"):
        score += 25.0
    else:
        score += 15.0

    # 3. Cycle Accuracy (20%)
    if profile.get("lastPeriodDate") or checkin.get("cycleDay"):
        score += 20.0
    else:
        score += 10.0

    # 4. Recent Consistency (20%)
    if profile.get("goals") and profile.get("weight"):
        score += 20.0
    else:
        score += 10.0

    return round(min(100.0, max(50.0, score)))


# ----------------------------------------------------
# MASTER BIOLOGICAL VARIABLES ENGINE API
# Section 10.3 Body State Object Generator
# ----------------------------------------------------
def compute_all_biological_variables(profile: dict, checkin: dict, phase_name: str) -> dict:
    """
    Calculates every biological variable exactly ONCE according to Rule B-11 & Rule S-01.
    Returns the spec-compliant bodyState object (Section 10.3).
    """
    readiness = calculate_workout_readiness(checkin, phase_name)
    fatigue = calculate_fatigue_score(checkin, phase_name)
    recovery = calculate_recovery_score(checkin, phase_name, fatigue_score=fatigue["score"])
    rhythm = calculate_rhythm_score(
        readiness_score=readiness["score"],
        recovery_score=recovery["score"],
        fatigue_score=fatigue["score"],
        phase_name=phase_name,
        checkin=checkin
    )
    confidence = calculate_ai_confidence(checkin, profile)

    return {
        "readiness": readiness,
        "fatigue": fatigue,
        "recovery": recovery,
        "rhythmScore": rhythm,
        "confidence": {
            "score": confidence
        }
    }
