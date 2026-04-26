import * as Notifications from "expo-notifications";

/* ---------------- INSTANT NOTIFICATION ---------------- */
export const sendNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body
    },
    trigger: null // immediate
  });
};

/* ---------------- DAILY REMINDER ---------------- */
export const scheduleDailyReminder = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "💙 MomSathi Reminder",
      body: "How are you feeling today? Log your symptoms."
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true
    }
  });
};

/* ---------------- SMART ALERT ---------------- */
export const triggerSmartAlert = async (history) => {
  if (!history || history.length === 0) return;

  const last3 = history.slice(0, 3);

  const sameProblem =
    last3.length === 3 &&
    last3.every((x) => x.problem === last3[0].problem);

  if (sameProblem) {
    await sendNotification(
      "⚠️ Health Alert",
      `You reported ${last3[0].problem} multiple times. Please take care.`
    );
  }

  const highCount = history.filter(
    (x) => x.urgency === "high"
  ).length;

  if (highCount >= 2) {
    await sendNotification(
      "🚨 Urgent Attention",
      "Multiple high-risk symptoms detected. Consider consulting a doctor."
    );
  }
};