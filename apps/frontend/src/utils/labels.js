/**
 * Rhythm Single Source of Truth Score & Load Label Helpers
 * Ensures consistent label mapping across all cards & views.
 */

export function getReadinessLabel(score) {
  const s = typeof score === "number" ? score : parseFloat(score) || 0;
  if (s >= 90) return "Peak Performance";
  if (s >= 75) return "Training Ready";
  if (s >= 60) return "Balanced";
  if (s >= 45) return "Recovery Recommended";
  return "Recovery First";
}

export function getTrainingLoadLabel(load) {
  if (typeof load === "object" && load !== null) {
    return load.label || "Medium";
  }
  if (typeof load === "string" && load.trim().length > 0) {
    return load;
  }
  return "Medium";
}

export function getConfidenceLabel(confidence) {
  if (confidence == null) return "High Confidence";
  return `${confidence}% Confidence`;
}
