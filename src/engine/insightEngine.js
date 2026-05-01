import { getDailyUpdate } from "./dailyEngine";

/* ---------------- INSIGHT TEMPLATES ---------------- */

const LOW_ENERGY_INSIGHTS = [
  "Take it slow today. Your body is working hard behind the scenes.",
  "Rest is not optional today — it's essential for your baby's growth.",
  "Listen to your body and avoid overexertion."
];

const NORMAL_INSIGHTS = [
  "Your pregnancy is progressing steadily and beautifully.",
  "A balanced day today supports your baby’s healthy development.",
  "Small consistent care makes a big difference."
];

const HIGH_ENERGY_INSIGHTS = [
  "You’re in a strong phase—perfect time for light activity.",
  "Your energy levels can support gentle movement today.",
  "Stay active but listen to your body’s signals."
];

const EARLY_WEEK_INSIGHTS = [
  "Early stage: focus on nutrition and rest.",
  "Your baby is forming the foundation of life right now.",
  "Every healthy choice matters deeply at this stage."
];

const LATE_WEEK_INSIGHTS = [
  "Final phase: prepare mentally and physically for delivery.",
  "Your baby is getting ready for the world.",
  "Stay calm and focus on breathing and relaxation."
];

/* ---------------- MAIN ENGINE ---------------- */

export const getDailyInsight = ({
  week = 1,
  streak = 1,
  symptoms = []
}) => {
  const base = getDailyUpdate(week);

  let insightPool = NORMAL_INSIGHTS;

  /* ---------------- WEEK LOGIC ---------------- */
  if (week <= 12) insightPool = EARLY_WEEK_INSIGHTS;
  else if (week >= 30) insightPool = LATE_WEEK_INSIGHTS;

  /* ---------------- SYMPTOM LOGIC ---------------- */
  const hasFatigue = symptoms.includes("fatigue");
  const hasPain = symptoms.includes("pain");
  const hasNausea = symptoms.includes("nausea");

  if (hasFatigue || hasPain) {
    insightPool = LOW_ENERGY_INSIGHTS;
  }

  if (streak >= 5 && !hasPain) {
    insightPool = HIGH_ENERGY_INSIGHTS;
  }

  /* ---------------- PICK INSIGHT ---------------- */
  const index = (week + streak) % insightPool.length;
  const insight = insightPool[index];

  /* ---------------- FINAL OUTPUT ---------------- */

  return {
    ...base,

    insight, // ⭐ MAIN AI OUTPUT

    badge:
      week <= 12
        ? "Early Care Phase"
        : week <= 27
        ? "Growth Phase"
        : "Final Preparation Phase",

    streakMessage:
      streak >= 7
        ? "🔥 Amazing consistency! You're building strong care habits."
        : `Day ${streak} of your pregnancy journey`
  };
};