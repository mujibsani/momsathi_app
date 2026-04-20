export const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case "danger":
      return "#E53935"; // red
    case "warning":
      return "#FB8C00"; // orange
    default:
      return "#43A047"; // green
  }
};