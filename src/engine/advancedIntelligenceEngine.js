export const analyzeAdvanced = (history = [], week = 20) => {
  const safe = Array.isArray(history) ? history : [];

  const result = {
    riskScore: 0,
    riskLevel: "low",
    patterns: [],
    messages: []
  };

  if (safe.length === 0) return result;

  let score = 0;

  /* ---------------- TIME WEIGHT (recent = more important) ---------------- */
  const now = Date.now();

  safe.forEach((item) => {
    const urgency = (item.urgency || "").toLowerCase();

    let base = 0;

    if (urgency === "high") base = 30;
    else if (urgency === "medium") base = 15;
    else base = 5;

    // date weighting (newer symptoms matter more)
    let timeFactor = 1;

    if (item.date) {
      const d = new Date(item.date).getTime();
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);

      if (diffDays <= 1) timeFactor = 1.5;
      else if (diffDays <= 3) timeFactor = 1.2;
      else if (diffDays <= 7) timeFactor = 1;
      else timeFactor = 0.7;
    }

    score += base * timeFactor;
  });

  /* ---------------- WEEK FACTOR ---------------- */
  if (week >= 28) score += 10;

  /* ---------------- SYMPTOM COMBINATION ---------------- */
  const hasHeadache = safe.some(i =>
    i.problem?.toLowerCase().includes("headache")
  );

  const hasSwelling = safe.some(i =>
    i.problem?.toLowerCase().includes("swelling")
  );

  const hasBackPain = safe.some(i =>
    i.problem?.toLowerCase().includes("back")
  );

  if (hasHeadache && hasSwelling) {
    score += 25;
    result.patterns.push("Headache + swelling detected");

    result.messages.push(
      "Headache with swelling may indicate pressure changes. Monitor carefully."
    );
  }

  if (hasBackPain && hasSwelling) {
    score += 15;
    result.patterns.push("Back pain + swelling detected");
  }

  /* ---------------- FREQUENCY ---------------- */
  if (safe.length >= 5) {
    score += 10;
    result.messages.push("Frequent symptom reporting detected.");
  }

  if (safe.length >= 10) {
    score += 10;
    result.messages.push("High symptom activity over time.");
  }

  /* ---------------- FINAL SCORE LIMIT ---------------- */
  result.riskScore = Math.min(Math.round(score), 100);

  /* ---------------- RISK LEVEL ---------------- */
  if (result.riskScore >= 70) result.riskLevel = "high";
  else if (result.riskScore >= 40) result.riskLevel = "medium";
  else result.riskLevel = "low";

  /* ---------------- DEFAULT MESSAGES ---------------- */
  if (result.messages.length === 0) {
    if (result.riskLevel === "low") {
      result.messages.push("Your condition looks stable.");
    } else if (result.riskLevel === "medium") {
      result.messages.push("Some symptoms need attention.");
    } else {
      result.messages.push("High-risk pattern detected. Consider consultation.");
    }
  }

  return result;
};