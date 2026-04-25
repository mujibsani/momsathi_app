import { getUrgency } from "./urgencyEngine";
import { getPregnancyAdvice } from "./pregnancyEngine";

export const analyzeSymptom = (apiData, week) => {
  if (!apiData) return null;

  const urgency = getUrgency(apiData);

  const pregnancyAdvice = getPregnancyAdvice(week);

  return {
    ...apiData,
    urgency,
    pregnancyAdvice
  };
};