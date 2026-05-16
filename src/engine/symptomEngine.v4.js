import { getUrgency } from "./urgencyEngine";
import { getPregnancyAdvice } from "./pregnancyEngine";

/* ---------------- EMERGENCY FLAGS ---------------- */
const EMERGENCY_SYMPTOMS = [
  "chest pain",
  "severe abdominal pain",
  "no baby movement",
  "heavy bleeding",
  "fainting",
];

const HIGH_RISK = [
  "bleeding",
  "blurred vision",
  "swelling",
  "severe headache",
];

const MEDIUM_RISK = [
  "dizziness",
  "nausea",
  "fatigue",
  "back pain",
];

/* ---------------- SCORE SYSTEM ---------------- */
const SCORE_MAP = {
  "chest pain": 100,
  "severe abdominal pain": 100,
  "no baby movement": 100,
  "heavy bleeding": 100,

  bleeding: 85,
  "blurred vision": 70,
  swelling: 60,
  "severe headache": 65,

  dizziness: 40,
  nausea: 30,
  fatigue: 20,
  "back pain": 20,
};

/* ---------------- HELPERS ---------------- */
const normalize = (arr) =>
  Array.isArray(arr)
    ? arr.map((s) => String(s).toLowerCase().trim())
    : [];

/* ---------------- CORE ENGINE V4 ---------------- */
export const analyzeSymptomV4 = (input = {}) => {
  try {
    const symptoms = normalize(input.symptoms);
    const week = Math.max(1, Math.min(42, Number(input.week) || 1));
    const streak = Number(input.streak) || 0;

    let score = 0;
    let isEmergency = false;

    /* ---------------- SCORING ---------------- */
    symptoms.forEach((s) => {
      const val = SCORE_MAP[s] || 5;
      score += val;

      if (EMERGENCY_SYMPTOMS.includes(s)) {
        isEmergency = true;
      }
    });

    /* pregnancy scaling */
    const pregnancyFactor = week >= 28 ? 1.3 : 1.1;
    score *= pregnancyFactor;

    /* clamp */
    score = Math.min(100, Math.max(0, score));

    /* ---------------- TRIAGE LEVEL ---------------- */
    let level =
      score >= 80 ? "CRITICAL" :
      score >= 50 ? "HIGH" :
      score >= 25 ? "MODERATE" :
      "LOW";

    /* emergency override */
    if (isEmergency) level = "EMERGENCY";

    /* ---------------- CONFIDENCE (FIXED) ---------------- */
    const confidence = Math.round(
      Math.min(98, Math.max(20, score))
    );

    /* ---------------- URGENCY ---------------- */
    const urgency = getUrgency(input.apiData || null) || level;

    /* ---------------- MEDICAL TEXT ---------------- */
    const pregnancyAdvice = getPregnancyAdvice(week);

    const insight =
      level === "EMERGENCY"
        ? "Critical symptom pattern detected. Immediate medical attention is recommended."
        : level === "HIGH"
        ? "High-risk symptom pattern. Monitor closely and consult a doctor."
        : level === "MODERATE"
        ? "Moderate symptoms. Observation and rest recommended."
        : "Low-risk symptoms. Likely normal pregnancy variation.";

    const energy =
      level === "EMERGENCY"
        ? "Severely reduced energy state detected"
        : level === "HIGH"
        ? "Low energy likely"
        : "Stable energy pattern";

    const mood =
      level === "EMERGENCY"
        ? "⚠️ Critical alert state"
        : level === "HIGH"
        ? "⚠️ Concerning pattern"
        : "🙂 Stable";

    const emergencyAction =
      level === "EMERGENCY"
        ? "🚨 Seek emergency medical care immediately"
        : level === "HIGH"
        ? "📞 Contact healthcare provider today"
        : "🧘 Monitor symptoms and rest";

    /* ---------------- FINAL OUTPUT ---------------- */
    return {
      symptoms,
      week,
      streak,

      level,
      urgency,

      score,
      confidence,

      isEmergency,

      mood,
      energy,
      insight,
      pregnancyAdvice,
      emergencyAction,

      timestamp: Date.now(),
    };

  } catch (e) {
    return {
      level: "LOW",
      urgency: "Normal",
      score: 0,
      confidence: 50,
      mood: "🙂 Stable",
      energy: "Normal",
      insight: "System fallback",
      emergencyAction: "Monitor symptoms",
      pregnancyAdvice: "",
      timestamp: Date.now(),
    };
  }
};