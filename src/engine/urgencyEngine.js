export const getUrgency = (data) => {
  const text = (data.problem + " " + data.warning).toLowerCase();

  if (
    text.includes("bleeding") ||
    text.includes("severe") ||
    text.includes("faint")
  ) {
    return "danger";
  }

  if (
    text.includes("pain") ||
    text.includes("dizziness")
  ) {
    return "warning";
  }

  return "normal";
};