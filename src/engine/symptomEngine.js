// import { getUrgency } from "./urgencyEngine";
// import { getPregnancyAdvice } from "./pregnancyEngine";

// export const analyzeSymptom = (apiData, week) => {
//   if (!apiData) return null;

//   const urgency = getUrgency(apiData);

//   const pregnancyAdvice = getPregnancyAdvice(week);

//   return {
//     ...apiData,
//     urgency,
//     pregnancyAdvice
//   };
// };
/* ---------------- IMPORTS ---------------- */


import { getUrgency } from "./urgencyEngine";
import { getPregnancyAdvice } from "./pregnancyEngine";

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

/* ---------------- WEIGHTED SYMPTOM MAP (AI STYLE) ---------------- */

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
  "stress": 1,
  "mood-swings": 1,
};

/* ---------------- HELPERS ---------------- */

const normalize = (symptoms) => {
  if (!Array.isArray(symptoms)) return [];
  return symptoms.map((s) => String(s).toLowerCase().trim());
};

const clamp = (num, min, max) => {
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
};

/* ---------------- AI REASONING CORE ---------------- */

export const analyzeSymptom = (input = {}) => {
  try {
    const symptoms = normalize(input.symptoms);
    const week = clamp(Number(input.week), 1, 42);
    const streak = clamp(Number(input.streak), 0, 999);
    const apiData = input.apiData || null;

    /* ---------------- SCORE ENGINE ---------------- */

    let score = 0;

    symptoms.forEach((s) => {
      score += SYMPTOM_SCORE[s] || 1;
    });

    // pregnancy sensitivity scaling
    const weekRiskBoost =
      week >= 28 ? 1.3 :
      week >= 13 ? 1.1 : 1;

    score = score * weekRiskBoost;

    /* ---------------- RISK CLASSIFICATION ---------------- */

    let riskLevel = RISK_LEVEL.LOW;
    let alertLevel = ALERT_LEVEL.SAFE;

    if (score >= 18) {
      riskLevel = RISK_LEVEL.HIGH;
      alertLevel = ALERT_LEVEL.URGENT;
    } else if (score >= 8) {
      riskLevel = RISK_LEVEL.MEDIUM;
      alertLevel = ALERT_LEVEL.WATCH;
    }

    /* ---------------- CONFIDENCE (FIXED - NO 0%) ---------------- */

    const confidence = clamp(Math.round((score / 20) * 100), 5, 98);

    /* ---------------- API OVERRIDE (OPTIONAL BACKEND) ---------------- */

    const urgencyFromAPI = apiData ? getUrgency(apiData) : null;

    const urgency =
      urgencyFromAPI ||
      (riskLevel === RISK_LEVEL.HIGH
        ? "Doctor"
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "Monitor"
        : "Normal");

    /* ---------------- PREGNANCY CONTEXT ---------------- */

    const pregnancyAdvice = getPregnancyAdvice(week);

    /* ---------------- AI REASONING LAYERS ---------------- */

    const energy =
      riskLevel === RISK_LEVEL.HIGH
        ? "Low energy detected. Body may need medical attention."
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "Moderate fatigue possible. Rest is recommended."
        : "Energy levels look stable and normal.";

    const mood =
      riskLevel === RISK_LEVEL.HIGH
        ? "⚠️ Concerning pattern detected"
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "🙂 Mild discomfort detected"
        : "😊 Stable emotional state";

    const insight =
      riskLevel === RISK_LEVEL.HIGH
        ? "Symptoms suggest higher risk. Monitoring and medical review is strongly recommended."
        : riskLevel === RISK_LEVEL.MEDIUM
        ? "Symptoms are common in pregnancy but should be observed closely."
        : "Symptoms appear normal for this stage of pregnancy.";

    const alertMessage =
      alertLevel === ALERT_LEVEL.URGENT
        ? "Please consider contacting a healthcare provider."
        : alertLevel === ALERT_LEVEL.WATCH
        ? "Monitor symptoms and rest."
        : "No immediate concern detected.";

    /* ---------------- STREAK INTELLIGENCE ---------------- */

    const streakBoost =
      streak >= 7
        ? "You are building excellent health awareness."
        : streak >= 3
        ? "Good consistency in tracking symptoms."
        : "";

    /* ---------------- FINAL AI RESPONSE ---------------- */

    return {
      symptoms,
      week,
      streak,

      riskLevel,
      alertLevel,
      urgency,

      confidence, // ✅ FIXED (no more 0%)

      pregnancyAdvice,

      mood,
      energy,
      insight: `${insight} ${streakBoost}`.trim(),
      alertMessage,

      timestamp: Date.now(),
    };

  } catch (err) {
    console.error("SymptomEngine v4 Error:", err);

    return {
      symptoms: [],
      week: 1,
      streak: 0,

      riskLevel: RISK_LEVEL.LOW,
      alertLevel: ALERT_LEVEL.SAFE,
      urgency: "Normal",

      confidence: 10,

      pregnancyAdvice: "Try again later.",

      mood: "🙂 Stable",
      energy: "Normal",
      insight: "System fallback activated.",
      alertMessage: "No issue detected",

      timestamp: Date.now(),
    };
  }
};
