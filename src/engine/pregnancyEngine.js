export const getPregnancyAdvice = (week) => {
  if (!week) week = 20;

  if (week < 12) {
    return "Early pregnancy care";
  }

  if (week < 28) {
    return "Mid pregnancy care";
  }

  return "Late pregnancy caution";
};