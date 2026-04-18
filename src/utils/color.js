export const getUrgencyColor = (urgency) => {
  if (urgency === "danger") return "#FF4D4F";   // red
  if (urgency === "warning") return "#FAAD14";  // yellow
  return "#52C41A"; // green
};