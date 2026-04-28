import * as Notifications from "expo-notifications";

/* ---------------- SAFE CHECK ---------------- */
const isReady = true; // placeholder for future expansion

/* ---------------- INSTANT ---------------- */
export const sendNotification = async (title, body) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  } catch (e) {
    console.log("Instant notification error:", e);
  }
};

/* ---------------- DAILY (FIXED) ---------------- */
export const scheduleDailyReminder = async () => {
  try {
    if (!isReady) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💙 MomSathi Reminder",
        body: "Check your symptoms today",
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

  } catch (e) {
    console.log("Daily reminder error:", e);
  }
};

/* ---------------- SMART ALERT (SAFE) ---------------- */
export const triggerSmartAlert = async (history) => {
  try {
    if (!history?.length) return;

    const last3 = history.slice(0, 3);

    const highCount = last3.filter(
      (x) => x.urgency === "high"
    ).length;

    if (highCount >= 2) {
      await sendNotification(
        "🚨 Health Alert",
        "Multiple high-risk symptoms detected."
      );
      return;
    }

    const last = history[0];

    if (last?.urgency === "high") {
      await sendNotification(
        "⚠️ Warning",
        "High-risk symptom recorded."
      );
    }

  } catch (e) {
    console.log("Smart alert error:", e);
  }
};