import { getPregnancyAdvice } from "./pregnancyEngine";
import { detectEmergency } from "./emergencyEngine";

/* ---------------- CONSTANTS ---------------- */

export const RISK_LEVEL = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const ALERT_LEVEL = {
  SAFE: "safe",
  WATCH: "watch",
  URGENT: "urgent",
};

/* ---------------- SYMPTOM WEIGHTS ---------------- */

const SYMPTOM_SCORE = {
  bleeding: 10,
  "severe abdominal pain": 10,
  "chest pain": 10,
  "no baby movement": 10,

  "blurred vision": 7,
  swelling: 5,
  headache: 4,
  dizziness: 4,

  fatigue: 2,
  nausea: 2,
  "back-pain": 2,
  stress: 1,
  "mood-swings": 1,

  fever: 4,
  vomiting: 4,
};

/* ---------------- HELPERS ---------------- */

const normalize = (arr) =>
  Array.isArray(arr)
    ? arr.map((s) => String(s).toLowerCase().trim())
    : [];

const clamp = (n, min, max) => {
  const v = Number(n);
  if (isNaN(v)) return min;
  return Math.max(min, Math.min(max, v));
};

/* ---------------- CORE ENGINE ---------------- */

export const analyzeSymptom = (input = {}) => {
  try {
    const symptoms = normalize(input.symptoms);
    const week = clamp(input.week, 1, 42);
    const streak = clamp(input.streak, 0, 999);

    /* ---------------- SCORE ---------------- */

    let score = 0;

    symptoms.forEach((s) => {
      score += SYMPTOM_SCORE[s] || 1;
    });

    // pregnancy scaling
    const weekBoost =
      week >= 28 ? 1.35 : week >= 13 ? 1.15 : 1;

    score *= weekBoost;

    /* ---------------- EMERGENCY LAYER ---------------- */

    const emergency = detectEmergency({
      symptoms,
      week,
    }) || {
      emergencyLevel: "safe",
      emergencyScore: 0,
    };

    /* ---------------- RISK ---------------- */

    let riskLevel = RISK_LEVEL.LOW;
    let alertLevel = ALERT_LEVEL.SAFE;

    if (score >= 18) {
      riskLevel = RISK_LEVEL.HIGH;
      alertLevel = ALERT_LEVEL.URGENT;
    } else if (score >= 8) {
      riskLevel = RISK_LEVEL.MEDIUM;
      alertLevel = ALERT_LEVEL.WATCH;
    }

    // emergency override (IMPORTANT FIX)
    if (emergency.emergencyLevel === "emergency") {
      riskLevel = RISK_LEVEL.HIGH;
      alertLevel = ALERT_LEVEL.URGENT;
    }

    if (emergency.emergencyLevel === "urgent" && riskLevel !== RISK_LEVEL.HIGH) {
      riskLevel = RISK_LEVEL.MEDIUM;
      alertLevel = ALERT_LEVEL.WATCH;
    }

    /* ---------------- CONFIDENCE ---------------- */

    let confidence = clamp((score / 20) * 100, 5, 98);

    if (emergency.emergencyLevel === "emergency") confidence = Math.max(confidence, 92);
    if (emergency.emergencyLevel === "urgent") confidence = Math.max(confidence, 82);

    /* ---------------- DOCTOR LOGIC LAYER ---------------- */

    const urgency =
      alertLevel === ALERT_LEVEL.URGENT
        ? "doctor"
        : alertLevel === ALERT_LEVEL.WATCH
        ? "monitor"
        : "normal";

    const pregnancyAdvice = getPregnancyAdvice(week);

    /* ---------------- AI OUTPUT LAYER ---------------- */

    const energy =
      riskLevel === RISK_LEVEL.HIGH
        ? "Low energy detected. Medical attention may be needed."
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "Mild fatigue likely. Rest recommended."
        : "Energy looks stable.";

    const mood =
      riskLevel === RISK_LEVEL.HIGH
        ? "⚠️ High concern detected"
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "🙂 Mild discomfort"
        : "😊 Stable condition";

    const insight =
      riskLevel === RISK_LEVEL.HIGH
        ? "High-risk symptom pattern detected. Medical review recommended."
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "Symptoms should be monitored carefully."
        : "Symptoms appear normal for pregnancy stage.";

    const alertMessage =
      alertLevel === ALERT_LEVEL.URGENT
        ? "Contact a healthcare provider soon."
        : alertLevel === ALERT_LEVEL.WATCH
        ? "Monitor symptoms and rest."
        : "No immediate concern.";

    const medicalSummary =
      emergency.emergencyLevel === "emergency"
        ? "EMERGENCY pattern detected"
        : riskLevel === RISK_LEVEL.HIGH
        ? "High risk pattern"
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "Moderate monitoring needed"
        : "Normal condition";

    /* ---------------- FINAL RESPONSE ---------------- */

    return {
      symptoms,
      week,
      streak,

      riskLevel,
      alertLevel,
      urgency,

      confidence,

      mood,
      energy,
      insight,

      pregnancyAdvice,
      alertMessage,
      medicalSummary,

      // emergency passthrough (safe structured)
      emergencyLevel: emergency.emergencyLevel,
      emergencyScore: emergency.emergencyScore || 0,

      timestamp: Date.now(),
    };
  } catch (err) {
    console.error("SymptomEngine v5 error:", err);

    return {
      symptoms: [],
      week: 1,
      streak: 0,

      riskLevel: RISK_LEVEL.LOW,
      alertLevel: ALERT_LEVEL.SAFE,
      urgency: "normal",

      confidence: 10,

      mood: "Stable",
      energy: "Normal",
      insight: "System fallback mode active",

      pregnancyAdvice: "Try again later",
      alertMessage: "No issue detected",
      medicalSummary: "Fallback system",

      emergencyLevel: "safe",
      emergencyScore: 0,

      timestamp: Date.now(),
    };
  }
};