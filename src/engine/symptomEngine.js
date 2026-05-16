import { getPregnancyAdvice } from "./pregnancyEngine";
import { detectEmergency } from "./emergencyEngine";

/* ---------------- CONSTANTS ---------------- */

const RISK_LEVEL = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const ALERT_LEVEL = {
  SAFE: "Safe",
  WATCH: "Watch",
  URGENT: "Urgent",
};

/* ---------------- WEIGHTED SYMPTOM MAP ---------------- */

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

const normalize = (symptoms) => {
  if (!Array.isArray(symptoms)) return [];

  return symptoms.map((s) =>
    String(s).toLowerCase().trim()
  );
};

const clamp = (num, min, max) => {
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
};

/* ---------------- AI REASONING CORE ---------------- */

export const analyzeSymptom = (input = {}) => {
  try {
    /* ---------------- INPUT ---------------- */

    const symptoms = normalize(input.symptoms);

    const week = clamp(
      Number(input.week),
      1,
      42
    );

    const streak = clamp(
      Number(input.streak),
      0,
      999
    );

    const apiData = input.apiData || null;

    /* ======================================================
       🧠 SCORE ENGINE
    ====================================================== */

    let score = 0;

    symptoms.forEach((s) => {
      score += SYMPTOM_SCORE[s] || 1;
    });

    /* ---------------- PREGNANCY WEEK BOOST ---------------- */

    let weekRiskBoost = 1;

    if (week >= 28) {
      weekRiskBoost = 1.35;
    } else if (week >= 13) {
      weekRiskBoost = 1.15;
    }

    score = score * weekRiskBoost;

    /* ======================================================
       🚨 EMERGENCY ENGINE
    ====================================================== */

    const emergency = detectEmergency({
      symptoms,
      week,
    });

    /* ======================================================
       📊 RISK CLASSIFICATION
    ====================================================== */

    let riskLevel = RISK_LEVEL.LOW;
    let alertLevel = ALERT_LEVEL.SAFE;

    if (score >= 18) {
      riskLevel = RISK_LEVEL.HIGH;
      alertLevel = ALERT_LEVEL.URGENT;
    } else if (score >= 8) {
      riskLevel = RISK_LEVEL.MEDIUM;
      alertLevel = ALERT_LEVEL.WATCH;
    }

    /* ---------------- EMERGENCY OVERRIDE ---------------- */

    if (
      emergency.emergencyLevel === "emergency"
    ) {
      riskLevel = RISK_LEVEL.HIGH;
      alertLevel = ALERT_LEVEL.URGENT;
    }

    if (
      emergency.emergencyLevel === "urgent" &&
      riskLevel !== RISK_LEVEL.HIGH
    ) {
      riskLevel = RISK_LEVEL.MEDIUM;
      alertLevel = ALERT_LEVEL.WATCH;
    }

    /* ======================================================
       🎯 CONFIDENCE ENGINE
    ====================================================== */

    let confidence = Math.round(
      (score / 20) * 100
    );

    confidence = clamp(confidence, 5, 98);

    /* emergency boost */

    if (
      emergency.emergencyLevel === "emergency"
    ) {
      confidence = Math.max(confidence, 92);
    }

    if (
      emergency.emergencyLevel === "urgent"
    ) {
      confidence = Math.max(confidence, 82);
    }

    /* ======================================================
       🤰 PREGNANCY CONTEXT
    ====================================================== */

    const pregnancyAdvice =
      getPregnancyAdvice(week);

    /* ======================================================
       ⚡ ENERGY ANALYSIS
    ====================================================== */

    const energy =
      riskLevel === RISK_LEVEL.HIGH
        ? "Low energy detected. Your body may require immediate medical attention."
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "Moderate fatigue or discomfort may occur. Hydration and rest are important."
        : "Energy levels appear stable and appropriate for this stage of pregnancy.";

    /* ======================================================
       😊 MOOD ANALYSIS
    ====================================================== */

    const mood =
      riskLevel === RISK_LEVEL.HIGH
        ? "⚠️ Elevated concern detected"
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "🙂 Mild symptom discomfort detected"
        : "😊 Stable pregnancy condition";

    /* ======================================================
       🧠 AI INSIGHT
    ====================================================== */

    let insight =
      "Symptoms appear within expected pregnancy patterns.";

    if (riskLevel === RISK_LEVEL.HIGH) {
      insight =
        "The current symptom pattern may require urgent medical review. Higher-risk indicators were detected.";
    } else if (
      riskLevel === RISK_LEVEL.MEDIUM
    ) {
      insight =
        "Symptoms should be monitored carefully. Changes in intensity or duration should not be ignored.";
    }

    /* ---------------- WEEK INTELLIGENCE ---------------- */

    if (week >= 28) {
      insight +=
        " Late-stage pregnancy requires closer monitoring for safety.";
    }

    /* ---------------- STREAK INTELLIGENCE ---------------- */

    if (streak >= 7) {
      insight +=
        " Your consistent tracking helps improve health awareness.";
    } else if (streak >= 3) {
      insight +=
        " Consistent symptom tracking detected.";
    }

    /* ======================================================
       🔔 ALERT MESSAGE
    ====================================================== */

    const alertMessage =
      alertLevel === ALERT_LEVEL.URGENT
        ? "Please consider contacting your healthcare provider soon."
        : alertLevel === ALERT_LEVEL.WATCH
        ? "Monitor symptoms carefully and prioritize rest."
        : "No immediate danger detected.";

    /* ======================================================
       🏥 MEDICAL SUMMARY
    ====================================================== */

    const medicalSummary =
      emergency.emergencyLevel === "emergency"
        ? "Emergency-level symptoms detected."
        : emergency.emergencyLevel === "urgent"
        ? "Urgent pregnancy monitoring recommended."
        : riskLevel === RISK_LEVEL.HIGH
        ? "High-risk symptom pattern identified."
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "Moderate symptom monitoring advised."
        : "Condition appears relatively stable.";

    /* ======================================================
       📦 FINAL AI RESPONSE
    ====================================================== */

    return {
      symptoms,
      week,
      streak,

      riskLevel,
      alertLevel,

      confidence,

      mood,
      energy,
      insight,

      pregnancyAdvice,

      alertMessage,
      medicalSummary,

      /* 🚨 emergency system */
      ...emergency,

      timestamp: Date.now(),
    };

  } catch (err) {
    console.error(
      "SymptomEngine Error:",
      err
    );

    /* ---------------- SAFE FALLBACK ---------------- */

    return {
      symptoms: [],
      week: 1,
      streak: 0,

      riskLevel: RISK_LEVEL.LOW,
      alertLevel: ALERT_LEVEL.SAFE,

      confidence: 10,

      mood: "🙂 Stable",
      energy: "Normal",
      insight:
        "The AI system could not fully analyze symptoms at the moment.",

      pregnancyAdvice:
        "Please try again later.",

      alertMessage:
        "No major issue detected.",

      medicalSummary:
        "Fallback safety system activated.",

      emergencyLevel: "safe",
      emergencyTitle: "No Emergency",
      emergencyReason:
        "Emergency system unavailable.",
      emergencyAction:
        "Monitor symptoms carefully.",
      emergencyScore: 10,

      timestamp: Date.now(),
    };
  }
};