#given a period start date, figure out what cycle day the user is on and which phase that maps to.
from datetime import datetime, timedelta

def calculate_cycle_day(period_start_date, current_date, cycle_length=None):
    # Calculate the difference in days between the current date and the period start date
    raw_day = (current_date - period_start_date).days + 1  # +1 to make it 1-indexed

    # If a cycle_length is provided, wrap days that exceed the cycle length
    if cycle_length and raw_day > cycle_length:
        # Wrap into the next cycle(s) using 1-indexed modulo arithmetic
        cycle_day = ((raw_day - 1) % cycle_length) + 1
    else:
        cycle_day = raw_day

    return cycle_day


def determine_phase(cycle_day, cycle_length, period_length):
    # Normalize cycle_day into the valid 1..cycle_length range when needed
    if cycle_length and (cycle_day > cycle_length or cycle_day < 1):
        cycle_day = ((cycle_day - 1) % cycle_length) + 1

    x = cycle_length - period_length
    ovulation_day = period_length + (x // 2)  # Approximate ovulation day

    # Define the phases based on the cycle day
    if 1 <= cycle_day <= period_length:
        return "Menstrual"
    elif period_length < cycle_day < ovulation_day - 2:
        return "Follicular"
    elif ovulation_day - 2 <= cycle_day <= ovulation_day + 2:
        return "Ovulation"
    elif ovulation_day + 2 < cycle_day < cycle_length - 4:
        return "Early Luteal"
    elif cycle_length - 4 <= cycle_day <= cycle_length:
        return "Late Luteal"
    else:
        return "Invalid cycle day"
    
def get_phase_info(phase: str) -> dict:
    # Normalize phase input to match keys
    key = phase.strip().lower()

    phase_info = {
        "menstrual": {
            "label": "Menstrual Phase",
            "hormones": "Low estrogen and progesterone levels.",
            "description": "Recovery-focused if symptoms are severe; intensity based on how the you feels"
        },
        "follicular": {
            "label": "Follicular Phase",
            "hormones": "Rising estrogen levels.",
            "description": "Energy and strength are increasing. Often a good window for higher training loads"
        },
        "ovulation": {
            "label": "Ovulation",
            "hormones": "Peak estrogen levels and a surge in luteinizing hormone (LH).",
            "description": "You likely feel strong and energetic. Great time for high-intensity training."
        },
        "early luteal": {
            "label": "Early Luteal Phase",
            "hormones": "Rising progesterone levels.",
            "description": "Recovery becomes increasingly important. Focus on moderate intensity and listen to your body."
        },
        "late luteal": {
            "label": "Late Luteal Phase",
            "hormones": "High progesterone levels.",
            "description": "Intensity may need adjustment depending on symptoms. Prioritize recovery and be flexible with training plans."
        }
    }

    return phase_info.get(key, {"label": "Unknown phase", "hormones": "", "description": ""})   

# -----------------------------------------------------------------------------

def get_cycle_data(
    period_start_date,
    current_date,
    cycle_length,
    period_length
):

    cycle_day = calculate_cycle_day(
        period_start_date,
        current_date,
        cycle_length
    )

    phase = determine_phase(
        cycle_day,
        cycle_length,
        period_length
    )

    info = get_phase_info(phase)
    days_remaining = max(0, cycle_length - cycle_day)
    progress = round((cycle_day / cycle_length) * 100)

    phase_order = [
        "Menstrual",
        "Follicular",
        "Ovulation",
        "Early Luteal",
        "Late Luteal"
    ]
    
    current_index = phase_order.index(phase)
    next_phase = phase_order[(current_index + 1) % len(phase_order)]

    return {
        "cycleDay": cycle_day,
        "phase": phase,
        "daysRemaining": days_remaining,
        "progress": progress,
        "nextPhase": next_phase,
        "info": info
    }