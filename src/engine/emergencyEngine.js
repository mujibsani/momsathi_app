/* ---------------- EMERGENCY LEVELS ---------------- */

export const EMERGENCY = {
  SAFE: "safe",
  WATCH: "watch",
  URGENT: "urgent",
  EMERGENCY: "emergency",
};

/* ---------------- HIGH RISK DIRECT SYMPTOMS ---------------- */

const DIRECT_EMERGENCY = [
  "bleeding",
  "chest pain",
  "no baby movement",
  "severe abdominal pain",
];

/* ---------------- PATTERN RULES ---------------- */

const hasAll = (arr, required) =>
  required.every((r) => arr.includes(r));

/* ---------------- MAIN ENGINE ---------------- */

export const detectEmergency = ({
  symptoms = [],
  week = 1,
}) => {
  try {
    const s = symptoms.map((i) =>
      String(i).toLowerCase().trim()
    );

    /* ---------------- DEFAULT ---------------- */

    let emergencyLevel = EMERGENCY.SAFE;

    let emergencyTitle = "No Emergency Detected";

    let emergencyReason =
      "Current symptom pattern does not indicate immediate danger.";

    let emergencyAction =
      "Continue monitoring symptoms and rest.";

    let emergencyScore = 0;

    /* =======================================================
       🚨 DIRECT EMERGENCY DETECTION
    ======================================================= */

    const hasDirectEmergency = s.some((i) =>
      DIRECT_EMERGENCY.includes(i)
    );

    if (hasDirectEmergency) {
      emergencyLevel = EMERGENCY.EMERGENCY;

      emergencyTitle = "Emergency Symptoms Detected";

      emergencyReason =
        "Certain symptoms may require immediate medical attention during pregnancy.";

      emergencyAction =
        "Please contact emergency services or visit a hospital immediately.";

      emergencyScore = 95;
    }

    /* =======================================================
       ⚠️ PRE-ECLAMPSIA PATTERN
    ======================================================= */

    if (
      hasAll(s, [
        "headache",
        "swelling",
        "blurred vision",
      ]) &&
      week >= 20
    ) {
      emergencyLevel = EMERGENCY.URGENT;

      emergencyTitle = "Possible Preeclampsia Pattern";

      emergencyReason =
        "Headache, swelling, and blurred vision during later pregnancy may indicate elevated blood pressure complications.";

      emergencyAction =
        "Contact your healthcare provider as soon as possible.";

      emergencyScore = 88;
    }

    /* =======================================================
       💧 DEHYDRATION PATTERN
    ======================================================= */

    if (
      hasAll(s, [
        "dizziness",
        "fatigue",
      ])
    ) {
      if (emergencyLevel !== EMERGENCY.EMERGENCY) {
        emergencyLevel = EMERGENCY.WATCH;

        emergencyTitle = "Possible Dehydration";

        emergencyReason =
          "Dizziness and fatigue together may indicate dehydration or exhaustion.";

        emergencyAction =
          "Increase fluids, rest, and monitor symptoms.";

        emergencyScore = 55;
      }
    }

    /* =======================================================
       🤒 INFECTION-LIKE PATTERN
    ======================================================= */

    if (
      hasAll(s, [
        "fever",
        "vomiting",
      ])
    ) {
      if (
        emergencyLevel !== EMERGENCY.EMERGENCY &&
        emergencyLevel !== EMERGENCY.URGENT
      ) {
        emergencyLevel = EMERGENCY.WATCH;

        emergencyTitle = "Possible Infection Risk";

        emergencyReason =
          "Fever and vomiting together may indicate infection or viral illness.";

        emergencyAction =
          "Monitor body temperature and consult a doctor if symptoms continue.";

        emergencyScore = 60;
      }
    }

    /* =======================================================
       🧠 LATE PREGNANCY RISK BOOST
    ======================================================= */

    if (
      week >= 32 &&
      emergencyLevel === EMERGENCY.WATCH
    ) {
      emergencyScore += 10;

      emergencyReason +=
        " Late-stage pregnancy increases monitoring importance.";
    }

    /* ---------------- FINAL SAFETY ---------------- */

    emergencyScore = Math.min(
      Math.max(emergencyScore, 5),
      99
    );

    return {
      emergencyLevel,
      emergencyTitle,
      emergencyReason,
      emergencyAction,
      emergencyScore,
    };

  } catch (err) {
    console.log("Emergency Engine Error:", err);

    return {
      emergencyLevel: EMERGENCY.SAFE,
      emergencyTitle: "System Fallback",
      emergencyReason:
        "Unable to fully analyze emergency conditions.",
      emergencyAction:
        "Please monitor symptoms carefully.",
      emergencyScore: 10,
    };
  }
};