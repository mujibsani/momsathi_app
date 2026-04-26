export const analyzeHistory = (history) => {
  if (!history || history.length === 0) return null;

  const countMap = {};
  const urgencyMap = {
    danger: 0,
    warning: 0,
    normal: 0
  };

  history.forEach((item) => {
    // count symptoms
    countMap[item.problem] = (countMap[item.problem] || 0) + 1;

    // count urgency
    if (item.urgency) {
      urgencyMap[item.urgency]++;
    }
  });

  // find most repeated symptom
  let topSymptom = null;
  let max = 0;

  Object.keys(countMap).forEach((key) => {
    if (countMap[key] > max) {
      max = countMap[key];
      topSymptom = key;
    }
  });

  return {
    total: history.length,
    mostCommon: topSymptom,
    count: max,
    urgency: urgencyMap
  };
};
export const generateInsights = (data) => {
  if (!data) return [];

  const insights = [];

  if (data.count >= 3) {
    insights.push(
      `⚠️ ${data.mostCommon} repeated ${data.count} times`
    );
  }

  if (data.urgency.danger > 0) {
    insights.push(
      `🚨 ${data.urgency.danger} high-risk symptom detected`
    );
  }

  if (data.urgency.warning > 2) {
    insights.push(
      `⚠️ Multiple warning-level symptoms observed`
    );
  }

  if (data.total >= 5) {
    insights.push(
      `📊 You have logged ${data.total} symptoms`
    );
  }

  return insights;
};