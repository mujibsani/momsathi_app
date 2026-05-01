export const analyzeAdvanced = (history = [], week = 20) => {
  const safe = Array.isArray(history) ? history : [];

  const result = {
    riskScore: 0,
    riskLevel: "low",
    trend: "stable",
    prediction: "stable",
    confidence: 0,
    explanation: "",
    forecast: [],
    breakdown: {
      symptoms: 0,
      trend: 0,
      frequency: 0,
      baseline: 0
    },
    messages: [],
    patterns: []
  };

  if (safe.length === 0) {
    result.explanation = "No symptom data available yet.";
    return result;
  }

  /* ---------------- BASELINE ---------------- */
  const avgSeverity =
    safe.reduce((sum, i) => {
      const u = (i.urgency || "").toLowerCase();
      return sum + (u === "high" ? 3 : u === "medium" ? 2 : 1);
    }, 0) / safe.length;

  const baseline =
    avgSeverity <= 1.5
      ? "low-symptom-user"
      : avgSeverity <= 2.2
      ? "normal"
      : "sensitive-user";

  /* ---------------- SCORE ---------------- */
  let score = 0;

  safe.forEach((item) => {
    const u = (item.urgency || "").toLowerCase();

    let base = u === "high" ? 30 : u === "medium" ? 15 : 5;

    if (baseline === "sensitive-user") base *= 1.3;
    if (baseline === "low-symptom-user") base *= 0.9;

    score += base;
  });

  result.breakdown.symptoms = Math.round(score);

  /* ---------------- FREQUENCY ---------------- */
  const freqScore = safe.length >= 10 ? 20 : safe.length >= 5 ? 10 : 0;
  score += freqScore;
  result.breakdown.frequency = freqScore;

  /* ---------------- WEEK FACTOR ---------------- */
  const weekScore = week >= 28 ? 10 : 0;
  score += weekScore;
  result.breakdown.baseline = weekScore;

  /* ---------------- TREND ---------------- */
  const sorted = [...safe].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const half = Math.floor(sorted.length / 2);

  const first = sorted.slice(0, half);
  const second = sorted.slice(half);

  const avg = (arr) =>
    arr.reduce((s, i) => {
      const u = (i.urgency || "").toLowerCase();
      return s + (u === "high" ? 3 : u === "medium" ? 2 : 1);
    }, 0) / (arr.length || 1);

  const trendDiff = avg(second) - avg(first);

  if (trendDiff > 0.3) {
    result.trend = "worsening";
    result.breakdown.trend = 15;
    score += 15;
  } else if (trendDiff < -0.3) {
    result.trend = "improving";
    result.breakdown.trend = -10;
    score -= 10;
  }

  /* ---------------- PATTERNS ---------------- */
  const hasHeadache = safe.some(i =>
    i.problem?.toLowerCase().includes("headache")
  );

  const hasSwelling = safe.some(i =>
    i.problem?.toLowerCase().includes("swelling")
  );

  if (hasHeadache && hasSwelling) {
    score += 25;
    result.patterns.push("Headache + swelling pattern detected");
  }

  /* ---------------- FINAL SCORE ---------------- */
  result.riskScore = Math.min(Math.max(Math.round(score), 0), 100);

  /* ---------------- LEVEL ---------------- */
  if (result.riskScore >= 70) result.riskLevel = "high";
  else if (result.riskScore >= 40) result.riskLevel = "medium";
  else result.riskLevel = "low";

  /* ---------------- CONFIDENCE ---------------- */
  result.confidence = Math.min(
    95,
    Math.max(50, 60 + safe.length * 3)
  );

  /* ---------------- EXPLANATION (NEW) ---------------- */
  result.explanation = `
Risk is based on:
- ${safe.length} recorded symptoms
- ${baseline.replace("-", " ")} baseline behavior
- ${result.trend} trend pattern
- urgency distribution and frequency
  `.trim();

  /* ---------------- FORECAST (NEW) ---------------- */
  if (result.trend === "worsening") {
    result.forecast = [
      "Next 1–2 days: monitor closely",
      "Next 3–5 days: risk may increase",
      "Advice: rest and track symptoms daily"
    ];
    result.prediction = "Risk likely increasing soon";
  } else if (result.trend === "improving") {
    result.forecast = [
      "Next 1–2 days: stable",
      "Next 3–5 days: improvement expected"
    ];
    result.prediction = "Condition improving";
  } else {
    result.forecast = [
      "Next 1–3 days: stable condition expected"
    ];
    result.prediction = "Stable pattern"
  }

  return result;
};