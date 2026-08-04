from dataclasses import dataclass
from typing import Dict


@dataclass
class AIOutputs:
    phase: Dict
    readiness: Dict
    fatigue: Dict
    workout: Dict
    nutrition: Dict