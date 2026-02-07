export const sanitizeInputUtil = (value) => {
  if (typeof value !== "string") return value;

  return value
    .replace(/</g, "")
    .replace(/>/g, "")
    .replace(/"/g, "")
    .replace(/'/g, "")
    .replace(/\//g, "");
};
