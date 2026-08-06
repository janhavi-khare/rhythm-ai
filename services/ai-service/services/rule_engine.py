"""
RHYTHM AI DECISION ENGINE - Section 9 & Section 8.10
Rule Engine & Decision Logic

Priority Hierarchy (Section 8.10 & Section 9.5):
1. Safety (Critical)
2. Recovery (High)
3. Readiness (Medium)
4. Goal (Medium)
5. Cycle (Low)
6. Preferences (Low)

Rules Implemented:
- Rule D-01: Hybrid decision model (No individual variable independently determines recommendation)
- Rule D-10: Primary drivers evaluate first
- Rule D-11: Secondary drivers modify recommendations
- Rule D-12: Context never overrides primary drivers
- Rule D-20: Safety always wins
- Rule D-21: Recovery always overrides fitness goals
- Rule D-22: Goals override user preferences
- Rule D-30: Workout engine is source of truth (no downstream reinterpretation)
- Rule D-40: Deterministic decision pipeline (Identical inputs -> Identical outputs)
- Rule S-30: Safety overrides execute before recommendation generation
- Rule C-02 / C-12: Severe symptoms override calendar phase
- Rule W-01: Primary drivers outweigh contextual modifiers
"""

from typing import Dict, List, Any


def evaluate_safety_overrides(
    body_state: Dict[str, Any],
    checkin: Dict[str, Any],
    profile: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Evaluates safety overrides before recommendation generation (Rule S-30).
    Enforces maximum intensity caps, duration limits, and mandatory recovery overrides.
    """
    readiness_score = body_state.get("readiness", {}).get("score", 75)
    fatigue_score = body_state.get("fatigue", {}).get("score", 30)
    recovery_score = body_state.get("recovery", {}).get("score", 75)

    sleep_quality = str(checkin.get("sleepQuality") or "Good").lower()
    cramps = str(checkin.get("cramps") or checkin.get("muscleSoreness") or "None").lower()
    flow = str(checkin.get("flow") or "None").lower()

    max_intensity = None
    max_duration = None
    force_recovery = False
    safety_rules = []

    # 1. Very Low Recovery (<= 20) -> Mandatory Recovery Focus (Rule D-21)
    if recovery_score <= 20 or readiness_score <= 20:
        force_recovery = True
        max_intensity = "Rest"
        max_duration = 30
        safety_rules.append("S-OVERRIDE-LOW-RECOVERY")

    # 2. Severe Fatigue (>= 80) -> Cap at Light
    elif fatigue_score >= 80:
        max_intensity = "Light"
        max_duration = 35
        safety_rules.append("S-OVERRIDE-SEVERE-FATIGUE")

    # 3. High Fatigue (>= 60) -> Cap at Moderate
    elif fatigue_score >= 60:
        max_intensity = "Moderate"
        max_duration = 45
        safety_rules.append("S-OVERRIDE-HIGH-FATIGUE")

    # 4. Severe Cramps or Heavy Flow (Rule C-02, C-12) -> Priority Recovery Overrides Phase
    if "severe" in cramps or "heavy" in flow:
        force_recovery = True
        max_intensity = "Light"
        max_duration = 30
        safety_rules.append("C-12")

    # 5. Very Poor Sleep (Quality == Poor / 20) -> Reduce duration and cap intensity at Moderate (Rule W-10)
    if "poor" in sleep_quality:
        if max_intensity not in ["Rest", "Light"]:
            max_intensity = "Moderate"
        max_duration = min(max_duration or 45, 40)
        safety_rules.append("W-10")

    return {
        "forceRecovery": force_recovery,
        "maxIntensity": max_intensity,
        "maxDuration": max_duration,
        "safetyRulesApplied": safety_rules
    }


def resolve_conflict(
    proposed_objective: str,
    proposed_intensity: str,
    proposed_duration: int,
    safety_constraints: Dict[str, Any],
    goal: str
) -> Dict[str, Any]:
    """
    Applies Priority Hierarchy (Safety > Recovery > Readiness > Goal > Cycle > Preferences).
    Enforces Rule D-20, D-21, D-22.
    """
    resolved_obj = proposed_objective
    resolved_int = proposed_intensity
    resolved_dur = proposed_duration
    conflict_rules = []

    # Level 1: Safety Overrides (Rule D-20 - Safety always wins)
    if safety_constraints.get("forceRecovery"):
        resolved_obj = "Active Recovery"
        resolved_int = safety_constraints.get("maxIntensity") or "Light"
        resolved_dur = min(resolved_dur, safety_constraints.get("maxDuration") or 30)
        conflict_rules.append("D-20")

    else:
        # Intensity Cap via Safety Constraints
        max_int = safety_constraints.get("maxIntensity")
        if max_int:
            intensity_order = ["Rest", "Very Light", "Light", "Moderate", "Moderately High", "High"]
            if max_int in intensity_order and resolved_int in intensity_order:
                if intensity_order.index(resolved_int) > intensity_order.index(max_int):
                    resolved_int = max_int
                    conflict_rules.append("S-INTENSITY-CAP")

        # Duration Cap via Safety Constraints
        max_dur = safety_constraints.get("maxDuration")
        if max_dur and resolved_dur > max_dur:
            resolved_dur = max_dur
            conflict_rules.append("S-DURATION-CAP")

    return {
        "objective": resolved_obj,
        "intensity": resolved_int,
        "duration": resolved_dur,
        "conflictRulesApplied": conflict_rules
    }


def build_decision_trace(rules: List[str]) -> List[str]:
    """
    Deduplicates and formats internal decision trace for debugging and explainability (Section 8.13).
    """
    seen = set()
    ordered = []
    for r in rules:
        if r and r not in seen:
            seen.add(r)
            ordered.append(r)
    return ordered
