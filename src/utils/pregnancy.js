export const calculateWeek = (startDate) => {
  if (!startDate) return null;

  const start = new Date(startDate);
  const now = new Date();

  const diff = now - start;
  const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));

  return Math.max(1, weeks);
};