from ai.shared.physiological_state import PhysiologicalState
from ai.shared.feature_vector import FeatureVector


def predict(feature_vector: FeatureVector) -> PhysiologicalState:
    """Placeholder interface for physiological state prediction.

    This function currently returns an empty PhysiologicalState instance.
    Future implementation will use feature_vector and a model to predict physiology.
    """
    return PhysiologicalState()
