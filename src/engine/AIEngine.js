import { sendNotification } from "../engine/notificationEngine";

/* ---------------- MAIN AI ENGINE ---------------- */
export const AIEngine = {
  
  /* ---------- ANALYZE SINGLE SYMPTOM ---------- */
  analyzeSymptom: (apiResponse, week) => {
    if (!apiResponse) return null;

    const severity = apiResponse.severity || "low";

    let urgency = "low";
    if (severity === "high") urgency = "high";
    else if (severity === "medium") urgency = "medium";

    return {
      ...apiResponse,
      week,
      urgency,
      timestamp: Date.now()
    };
  },

  /* ---------- ANALYZE FULL HISTORY ---------- */
  analyzeHistory: (history = []) => {
    if (!history.length) return { riskScore: 0 };

    let high = 0;
    let medium = 0;

    history.forEach((h) => {
      if (h.urgency === "high") high++;
      else if (h.urgency === "medium") medium++;
    });

    const riskScore = high * 5 + medium * 2;

    return {
      total: history.length,
      high,
      medium,
      riskScore
    };
  },

  /* ---------- HEALTH SCORE ---------- */
  getHealthScore: (history = []) => {
    const analysis = AIEngine.analyzeHistory(history);

    const score = Math.max(100 - analysis.riskScore * 5, 20);

    return {
      score,
      status:
        score > 80
          ? "Good"
          : score > 50
          ? "Moderate"
          : "Risky"
    };
  },

  /* ---------- INSIGHTS ---------- */
  generateInsights: (history = []) => {
    if (!history.length) return [];

    const insights = [];

    const highCount = history.filter(h => h.urgency === "high").length;

    if (highCount > 2) {
      insights.push("You have repeated high-risk symptoms recently.");
    }

    if (history.length > 5) {
      insights.push("Frequent symptom tracking improves prediction accuracy.");
    }

    return insights;
  },

  /* ---------- ALERT SYSTEM ---------- */
  generateAlerts: (history = []) => {
    if (!history.length) return [];

    const alerts = [];

    const last = history[0];

    if (last?.urgency === "high") {
      alerts.push("High-risk symptom detected recently.");
    }

    return alerts;
  },

  /* ---------- PREDICTIONS ---------- */
  generatePredictions: (history = []) => {
    if (!history.length) return [];

    const predictions = [];

    const high = history.filter(h => h.urgency === "high").length;

    if (high >= 3) {
      predictions.push("Risk trend increasing — monitor closely.");
    } else {
      predictions.push("Condition appears stable.");
    }

    return predictions;
  },

  /* ---------- SMART NOTIFICATION DECISION ---------- */
  handleSmartNotification: async (history = []) => {
    if (!history.length) return;

    const last = history[0];

    const recentHigh = history.slice(0, 3).filter(
      h => h.urgency === "high"
    ).length;

    // RULE 1: repeated high risk
    if (recentHigh >= 2) {
      await sendNotification(
        "🚨 Health Warning",
        "Multiple high-risk symptoms detected. Consider medical advice."
      );
      return;
    }

    // RULE 2: single high risk
    if (last?.urgency === "high") {
      await sendNotification(
        "⚠️ Alert",
        "High-risk symptom recorded. Stay cautious."
      );
    }
  }
};