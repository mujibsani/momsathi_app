import { DAILY_WEEK_DATA } from "../data/weeklyData";

/**
 * Stable hash for daily variation
 */
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 10000;
  }
  return hash;
};

/**
 * Get mood for the day (adds emotional variation)
 */
const getMood = (seed) => {
  const moods = ["calm", "happy", "motivated", "sensitive", "energetic"];
  return moods[seed % moods.length];
};

/**
 * Generate daily variation safely
 */
const getDailyVariation = (week, dateKey) => {
  const seed = hashString(`${week}-${dateKey}`);

  const mood = getMood(seed);

  const extraTips = {
    calm: ["Take deep breaths today.", "Slow down and rest more."],
    happy: ["Enjoy this positive phase.", "Smile often — it helps baby too."],
    motivated: ["Great day to stay active.", "Light walking is helpful."],
    sensitive: ["You may feel emotional today — it’s normal."],
    energetic: ["Use your energy for light tasks."]
  };

  return {
    mood,
    extraTip: extraTips[mood][seed % 2]
  };
};

/**
 * MAIN FUNCTION
 */
export const getDailyUpdateV2 = (week, user = null) => {
  const todayKey = new Date().toDateString();

  const base = DAILY_WEEK_DATA[week] || DAILY_WEEK_DATA[1];

  const variation = getDailyVariation(week, todayKey);

  return {
    week,
    baby: base.baby,
    body: base.body,

    tips: base.tips,

    // NEW LAYER
    mood: variation.mood,
    extraTip: variation.extraTip,

    // UX helpers
    title: `Week ${week} Pregnancy Update`,
    subtitle: `Your baby is growing beautifully`
  };
};