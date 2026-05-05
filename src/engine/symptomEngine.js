import { getUrgency } from "./urgencyEngine";
import { getPregnancyAdvice } from "./pregnancyEngine";

/* ---------------- CONSTANTS ---------------- */

const RISK_LEVEL = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

const ALERT_LEVEL = {
  SAFE: "Safe",
  WATCH: "Watch",
  URGENT: "Urgent",
};

/* ---------------- WEIGHTED AI MAP ---------------- */

const SYMPTOM_SCORE = {
  "bleeding": 10,
  "severe abdominal pain": 10,
  "chest pain": 10,
  "no baby movement": 10,

  "blurred vision": 7,
  "swelling": 5,
  "headache": 4,
  "dizziness": 4,

  "fatigue": 2,
  "nausea": 2,
  "back-pain": 2,
  "vomiting": 3,
  "fever": 5,
  "cramps": 4,

  "stress": 1,
  "mood-swings": 1,
};

/* ---------------- HELPERS ---------------- */

const normalize = (arr) =>
  Array.isArray(arr) ? arr.map((s) => s.toLowerCase().trim()) : [];

const clamp = (n, min, max) =>
  Math.max(min, Math.min(max, isNaN(n) ? min : n));

/* ---------------- ENGINE ---------------- */

export const analyzeSymptom = (input = {}) => {
  try {
    const symptoms = normalize(input.symptoms);
    const week = clamp(Number(input.week), 1, 42);
    const streak = clamp(Number(input.streak), 0, 999);

    let score = 0;
    symptoms.forEach((s) => {
      score += SYMPTOM_SCORE[s] || 1;
    });

    const weekBoost = week >= 28 ? 1.3 : week >= 13 ? 1.1 : 1;
    score *= weekBoost;

    let riskLevel = RISK_LEVEL.LOW;
    let alertLevel = ALERT_LEVEL.SAFE;

    if (score >= 18) {
      riskLevel = RISK_LEVEL.HIGH;
      alertLevel = ALERT_LEVEL.URGENT;
    } else if (score >= 8) {
      riskLevel = RISK_LEVEL.MEDIUM;
      alertLevel = ALERT_LEVEL.WATCH;
    }

    const confidence = clamp(Math.round((score / 20) * 100), 10, 95);

    const urgency =
      riskLevel === "high"
        ? "Doctor"
        : riskLevel === "medium"
        ? "Monitor"
        : "Normal";

    const pregnancyAdvice = getPregnancyAdvice(week);

    return {
      symptoms,
      week,
      streak,
      riskLevel,
      alertLevel,
      urgency,
      confidence,
      pregnancyAdvice,
      mood:
        riskLevel === "high"
          ? "⚠️ Concerning symptoms"
          : riskLevel === "medium"
          ? "🙂 Mild discomfort"
          : "😊 Normal",
      energy:
        riskLevel === "high"
          ? "Low energy"
          : riskLevel === "medium"
          ? "Moderate fatigue"
          : "Stable",
      insight:
        riskLevel === "high"
          ? "Immediate attention recommended."
          : riskLevel === "medium"
          ? "Monitor symptoms."
          : "Normal pregnancy symptoms.",
      timestamp: Date.now(),
    };
  } catch (e) {
    return {
      riskLevel: "low",
      confidence: 20,
      insight: "Fallback mode",
    };
  }
};