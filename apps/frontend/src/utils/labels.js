/**
 * Rhythm Single Source of Truth Score & Load Label Helpers
 * Ensures consistent label mapping across all cards & views.
 */

export function getReadinessLabel(score) {
  const s = typeof score === "number" ? score : parseFloat(score) || 0;
  if (s >= 81) return "High Readiness";
  if (s >= 61) return "Good Readiness";
  if (s >= 41) return "Moderate Readiness";
  if (s >= 21) return "Low Readiness";
  return "Recovery Required";
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
