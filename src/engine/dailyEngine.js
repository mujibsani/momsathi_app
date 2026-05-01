/* ---------------- 40 WEEK DATASET ---------------- */

const WEEK_DATA = {
  1: {
    baby: "Fertilization begins. Your baby is a tiny cluster of cells.",
    body: "Hormones start changing silently.",
    tips: ["Start taking folic acid", "Avoid alcohol", "Get proper rest"]
  },
  2: {
    baby: "The fertilized egg travels to the uterus.",
    body: "Ovulation and early hormonal shifts occur.",
    tips: ["Track your cycle", "Eat balanced food", "Stay hydrated"]
  },
  3: {
    baby: "Implantation happens. Pregnancy officially begins.",
    body: "You may feel light spotting.",
    tips: ["Avoid stress", "Eat iron-rich foods", "Sleep well"]
  },
  4: {
    baby: "Your baby is the size of a poppy seed.",
    body: "Missed period may occur.",
    tips: ["Take pregnancy test", "Start prenatal vitamins", "Reduce caffeine"]
  },

  5: {
    baby: "Heart starts forming.",
    body: "Morning sickness may begin.",
    tips: ["Eat small meals", "Stay hydrated", "Avoid strong smells"]
  },
  6: {
    baby: "Heartbeat can be detected.",
    body: "Fatigue increases.",
    tips: ["Rest more", "Light walking", "Eat protein"]
  },
  7: {
    baby: "Brain and face structures develop.",
    body: "Nausea continues.",
    tips: ["Ginger tea", "Avoid oily food", "Stay calm"]
  },
  8: {
    baby: "Limbs start forming.",
    body: "Breast tenderness increases.",
    tips: ["Wear comfortable bra", "Stay hydrated", "Eat calcium-rich food"]
  },

  9: {
    baby: "Baby is now called a fetus.",
    body: "Mood swings may occur.",
    tips: ["Relaxation exercises", "Avoid stress", "Talk to loved ones"]
  },
  10: {
    baby: "Vital organs are forming.",
    body: "Energy may slightly improve.",
    tips: ["Balanced diet", "Light exercise", "Stay hydrated"]
  },
  11: {
    baby: "Baby starts moving (not felt yet).",
    body: "Less nausea for some women.",
    tips: ["Eat fruits", "Stay active", "Get sunlight"]
  },
  12: {
    baby: "End of 1st trimester.",
    body: "Miscarriage risk decreases.",
    tips: ["Routine checkup", "Healthy diet", "Light exercise"]
  },

  /* ---------------- 2ND TRIMESTER ---------------- */

  13: {
    baby: "Baby begins growing rapidly.",
    body: "Energy returns.",
    tips: ["Start walking routine", "Eat protein", "Hydrate"]
  },
  14: {
    baby: "Facial expressions develop.",
    body: "Glowing skin may appear.",
    tips: ["Skin care", "Stay hydrated", "Eat vitamins"]
  },
  15: {
    baby: "Baby can sense light.",
    body: "Appetite increases.",
    tips: ["Healthy snacks", "Avoid junk food", "Stay active"]
  },
  16: {
    baby: "Baby can hear sounds.",
    body: "You may feel movement soon.",
    tips: ["Talk to baby", "Stay calm", "Eat iron"]
  },
  17: {
    baby: "Fat begins forming.",
    body: "Back pain may start.",
    tips: ["Posture care", "Light stretching", "Use pillow support"]
  },
  18: {
    baby: "You may feel baby kicks.",
    body: "Movement becomes noticeable.",
    tips: ["Track movements", "Stay relaxed", "Hydrate"]
  },
  19: {
    baby: "Skin develops protective coating.",
    body: "Stretch marks may appear.",
    tips: ["Use moisturizer", "Stay hydrated", "Eat healthy fats"]
  },
  20: {
    baby: "Halfway there 🎉",
    body: "Clear baby movements.",
    tips: ["Ultrasound check", "Balanced diet", "Stay active"]
  },
  21: {
    baby: "Baby swallows fluid.",
    body: "More energy.",
    tips: ["Eat fiber", "Avoid constipation", "Hydrate"]
  },
  22: {
    baby: "Senses develop more.",
    body: "Swelling may begin.",
    tips: ["Elevate legs", "Reduce salt", "Drink water"]
  },
  23: {
    baby: "Lungs developing.",
    body: "Back pain continues.",
    tips: ["Stretching", "Comfortable shoes", "Rest"]
  },
  24: {
    baby: "Baby responds to sound.",
    body: "Sleep discomfort starts.",
    tips: ["Side sleeping", "Use pillows", "Relaxation"]
  },
  25: {
    baby: "Brain grows rapidly.",
    body: "Breathing changes slightly.",
    tips: ["Deep breathing", "Stay calm", "Eat iron"]
  },
  26: {
    baby: "Eyes begin opening.",
    body: "Leg cramps may occur.",
    tips: ["Stretch legs", "Magnesium foods", "Hydrate"]
  },
  27: {
    baby: "End of 2nd trimester.",
    body: "Weight gain increases.",
    tips: ["Balanced meals", "Light exercise", "Checkup"]
  },

  /* ---------------- 3RD TRIMESTER ---------------- */

  28: {
    baby: "Baby can blink eyes.",
    body: "Fatigue returns.",
    tips: ["Rest more", "Short walks", "Healthy meals"]
  },
  29: {
    baby: "Muscles strengthen.",
    body: "Shortness of breath.",
    tips: ["Slow movements", "Rest", "Stay hydrated"]
  },
  30: {
    baby: "Baby gains weight fast.",
    body: "Back pain increases.",
    tips: ["Posture care", "Stretching", "Massage"]
  },
  31: {
    baby: "Brain connections improve.",
    body: "Frequent urination.",
    tips: ["Stay hydrated", "Pelvic exercises", "Rest"]
  },
  32: {
    baby: "Bones fully formed.",
    body: "Sleep difficulty.",
    tips: ["Side sleep", "Relaxation", "Warm bath"]
  },
  33: {
    baby: "Immune system develops.",
    body: "Swelling increases.",
    tips: ["Elevate legs", "Reduce salt", "Rest"]
  },
  34: {
    baby: "Lungs nearly ready.",
    body: "Braxton Hicks contractions.",
    tips: ["Stay calm", "Hydrate", "Monitor contractions"]
  },
  35: {
    baby: "Baby moves to head-down position.",
    body: "Pelvic pressure.",
    tips: ["Rest", "Light stretching", "Doctor visit"]
  },
  36: {
    baby: "Almost full term.",
    body: "Labor signs may start.",
    tips: ["Prepare hospital bag", "Stay calm", "Monitor symptoms"]
  },
  37: {
    baby: "Full term begins.",
    body: "Body prepares for labor.",
    tips: ["Stay relaxed", "Breathing practice", "Checkups"]
  },
  38: {
    baby: "Baby ready anytime.",
    body: "Cervix softens.",
    tips: ["Rest", "Stay ready", "Stay hydrated"]
  },
  39: {
    baby: "Final growth stage.",
    body: "Labor can start anytime.",
    tips: ["Stay calm", "Prepare mentally", "Monitor contractions"]
  },
  40: {
    baby: "Due week 🎉",
    body: "Labor expected.",
    tips: ["Stay relaxed", "Follow doctor advice", "Be ready"]
  }
};

export const getDailyUpdate = (week) => {
  const data = WEEK_DATA[week] || WEEK_DATA[40];

  return {
    baby: data.baby,
    body: data.body,
    tips: data.tips
  };
};