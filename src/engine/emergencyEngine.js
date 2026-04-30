export const detectEmergency = (history = [], week = 20) => {
  const result = {
    isEmergency: false,
    level: "none", // none | warning | critical
    message: ""
  };

  if (!history || history.length === 0) return result;

  const recent = history.slice(0, 5);

  const hasHeadache = recent.some(i =>
    i.problem?.toLowerCase().includes("headache")
  );

  const hasSwelling = recent.some(i =>
    i.problem?.toLowerCase().includes("swelling")
  );

  const highCount = recent.filter(i => i.urgency === "high").length;

  /* ---------------- CRITICAL CASE ---------------- */
  if (hasHeadache && hasSwelling && week >= 20) {
    result.isEmergency = true;
    result.level = "critical";
    result.message =
      "Possible preeclampsia risk detected. Seek medical attention immediately.";
    return result;
  }

  /* ---------------- HIGH FREQUENCY ---------------- */
  if (highCount >= 3) {
    result.isEmergency = true;
    result.level = "warning";
    result.message =
      "Multiple high-risk symptoms detected. Monitor closely or consult a doctor.";
    return result;
  }

  /* ---------------- SAFE ---------------- */
  return result;
};