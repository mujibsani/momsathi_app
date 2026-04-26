export const generateAlerts = (history) => {
  if (!history || history.length === 0) return [];

  const countMap = {};
  const today = new Date().toLocaleDateString();

  let todayDanger = 0;

  history.forEach((item) => {
    // count symptoms
    countMap[item.problem] = (countMap[item.problem] || 0) + 1;

    // today risk check
    if (item.date === today && item.urgency === "danger") {
      todayDanger++;
    }
  });

  const alerts = [];

  // 🔥 repeated symptom alert
  Object.keys(countMap).forEach((key) => {
    if (countMap[key] >= 3) {
      alerts.push(`⚠️ ${key} repeated ${countMap[key]} times`);
    }
  });

  // 🚨 danger alert
  if (todayDanger > 0) {
    alerts.push(`🚨 ${todayDanger} high-risk symptom(s) today`);
  }

  // 📊 general warning
  if (history.length > 7) {
    alerts.push(`📊 High symptom activity detected this week`);
  }

  return alerts;
};