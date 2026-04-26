export const generatePredictions = (history) => {
  if (!history || history.length === 0) return [];

  const predictions = [];

  /* ---------------- COUNT PROBLEMS ---------------- */
  const problemMap = {};
  let highCount = 0;

  history.forEach((item) => {
    if (!item?.problem) return;

    problemMap[item.problem] =
      (problemMap[item.problem] || 0) + 1;

    if (item.urgency === "high") highCount++;
  });

  /* ---------------- MOST FREQUENT ---------------- */
  const mostFrequent = Object.keys(problemMap).reduce(
    (a, b) =>
      problemMap[a] > problemMap[b] ? a : b,
    null
  );

  if (problemMap[mostFrequent] >= 3) {
    predictions.push(
      `You frequently report "${mostFrequent}". Monitor closely.`
    );
  }

  /* ---------------- HIGH URGENCY RISK ---------------- */
  if (highCount >= 2) {
    predictions.push(
      "Multiple high urgency symptoms detected. Consider consulting a doctor."
    );
  }

  /* ---------------- RECENT TREND ---------------- */
  const last3 = history.slice(0, 3);

  const repeatedRecent = last3.every(
    (x) => x.problem === last3[0]?.problem
  );

  if (repeatedRecent && last3.length === 3) {
    predictions.push(
      `Recent repeated symptom "${last3[0].problem}" detected. Possible ongoing issue.`
    );
  }

  /* ---------------- DEFAULT SAFE ---------------- */
  if (predictions.length === 0) {
    predictions.push("No major risk detected. Keep monitoring.");
  }

  return predictions;
};