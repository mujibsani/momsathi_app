/* ---------------- ANALYZE HISTORY ---------------- */
export const analyzeHistory = (history = []) => {
  const safe = Array.isArray(history) ? history : [];

  const total = safe.length;

  const high = safe.filter(i => i?.urgency === "high").length;
  const medium = safe.filter(i => i?.urgency === "medium").length;
  const low = safe.filter(i => i?.urgency === "low").length;

  // recent trend (last 5)
  const last5 = safe.slice(0, 5);

  const worseningCount = last5.filter(i => i?.urgency === "high").length;

  const trend =
    worseningCount >= 2
      ? "worsening"
      : last5.length === 0
      ? "none"
      : "stable";

  // most common problem
  const problemCount = {};
  safe.forEach(item => {
    if (!item?.problem) return;
    problemCount[item.problem] =
      (problemCount[item.problem] || 0) + 1;
  });

  const commonProblem =
    Object.keys(problemCount).length > 0
      ? Object.keys(problemCount).reduce((a, b) =>
          problemCount[a] > problemCount[b] ? a : b
        )
      : null;

  return {
    total,
    high,
    medium,
    low,
    trend,
    commonProblem
  };
};

/* ---------------- INSIGHTS ENGINE ---------------- */
export const generateInsights = (analysis) => {
  const insights = [];

  if (!analysis) return insights;

  const { total, high, low, trend, commonProblem } = analysis;

  if (total === 0) {
    insights.push("You have a clean health history so far.");
    return insights;
  }

  // pattern insight
  if (commonProblem) {
    insights.push(
      `You frequently reported ${commonProblem}. This may indicate a recurring condition.`
    );
  }

  // risk insight
  if (high >= 2) {
    insights.push(
      "Multiple high-risk symptoms detected. Consider medical attention if this continues."
    );
  }

  // trend insight
  if (trend === "worsening") {
    insights.push(
      "Your symptoms appear to be increasing recently. Monitoring is strongly advised."
    );
  } else if (trend === "stable") {
    insights.push("Your symptom pattern appears stable.");
  }

  // positive signal
  if (low > high) {
    insights.push("Most of your symptoms are mild, which is a good sign.");
  }

  return insights;
};

/* ---------------- ALERT ENGINE ---------------- */
export const generateAlerts = (history = []) => {
  const alerts = [];

  if (!history || history.length === 0) return alerts;

  const last = history[0];

  if (last?.urgency === "high") {
    alerts.push("Recent high-risk symptom detected.");
  }

  const highCount = history.filter(i => i?.urgency === "high").length;

  if (highCount >= 3) {
    alerts.push("Repeated high-risk symptoms detected.");
  }

  // repeated same problem alert
  const last3 = history.slice(0, 3);
  const sameProblem =
    last3.length === 3 &&
    last3.every(x => x.problem === last3[0].problem);

  if (sameProblem) {
    alerts.push(
      `You reported ${last3[0].problem} multiple times recently.`
    );
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

  const last3 = history.slice(0, 3);

  const sameProblem =
    last3.length === 3 &&
    last3.every(x => x.problem === last3[0].problem);

  if (high >= 3) {
    predictions.push(
      "There is a possibility of symptom escalation in the coming days."
    );
  }

  if (stress >= 2) {
    predictions.push(
      "Stress patterns may begin to impact your physical health."
    );
  }

  if (sameProblem) {
    predictions.push(
      `${last3[0].problem} may continue if underlying causes are not addressed.`
    );
  }

  if (history.length > 10) {
    predictions.push(
      "Long-term tracking suggests continued monitoring is recommended."
    );
  }

  return predictions;
};

/* ---------------- SUMMARY (NEW CORE FEATURE) ---------------- */
export const generateSummary = (analysis, predictions = []) => {
  if (!analysis) return "";

  const { total, high, trend, commonProblem } = analysis;

  let summary = `This week you recorded ${total} symptom${
    total > 1 ? "s" : ""
  }. `;

  if (commonProblem) {
    summary += `The most common issue was ${commonProblem}. `;
  }

  if (high > 0) {
    summary += `${high} high-risk case${
      high > 1 ? "s were" : " was"
    } observed. `;
  } else {
    summary += "No high-risk symptoms were observed. ";
  }

  if (trend === "worsening") {
    summary += "Your symptom trend appears to be increasing. ";
  } else if (trend === "stable") {
    summary += "Your overall condition appears stable. ";
  }

  if (predictions.length > 0) {
    summary +=
      "Future indicators suggest monitoring your condition closely.";
  }

  return summary;
};