/* ---------------- ANALYZE HISTORY ---------------- */
export const analyzeHistory = (history = []) => {
  const safe = Array.isArray(history) ? history : [];

  const total = safe.length;

  const high = safe.filter(i => i?.urgency === "high").length;
  const medium = safe.filter(i => i?.urgency === "medium").length;
  const low = safe.filter(i => i?.urgency === "low").length;

  // recent trend
  const last5 = safe.slice(0, 5);

  const trend =
    last5.filter(i => i?.urgency === "high").length >= 2
      ? "worsening"
      : "stable";

  return {
    total,
    high,
    medium,
    low,
    trend
  };
};

/* ---------------- INSIGHTS ENGINE ---------------- */
export const generateInsights = (analysis) => {
  const insights = [];

  if (!analysis) return insights;

  if (analysis.total === 0) {
    insights.push("You have a clean health history so far.");
    return insights;
  }

  if (analysis.high > 2) {
    insights.push("You had multiple high-risk symptoms recently.");
  }

  if (analysis.trend === "worsening") {
    insights.push("Your symptoms trend is increasing — monitor closely.");
  } else {
    insights.push("Your symptom pattern looks stable.");
  }

  if (analysis.low > analysis.high) {
    insights.push("Most symptoms are mild — good sign.");
  }

  return insights;
};

/* ---------------- ALERT ENGINE ---------------- */
export const generateAlerts = (history = []) => {
  const alerts = [];

  if (!history || history.length === 0) return alerts;

  const last = history[0];

  if (last?.urgency === "high") {
    alerts.push("Recent high-risk symptom detected");
  }

  const highCount = history.filter(i => i?.urgency === "high").length;

  if (highCount >= 3) {
    alerts.push("Repeated high-risk symptoms detected");
  }

  return alerts;
};

/* ---------------- PREDICTION ENGINE ---------------- */
export const generatePredictions = (history = []) => {
  const predictions = [];

  if (!history || history.length === 0) return predictions;

  const high = history.filter(i => i?.urgency === "high").length;

  const stress = history.filter(i =>
    i?.problem?.toLowerCase().includes("stress")
  ).length;

  if (high >= 3) {
    predictions.push("Possible symptom escalation risk in next days");
  }

  if (stress >= 2) {
    predictions.push("Stress pattern may affect physical symptoms");
  }

  if (history.length > 10) {
    predictions.push("Long-term monitoring recommended");
  }

  return predictions;
};