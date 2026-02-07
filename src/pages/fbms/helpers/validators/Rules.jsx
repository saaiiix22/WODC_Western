// Improved validators with more industry-standard rules
// Added: password strength, URL, number range, async email check example
// Support for async validation (return Promise)
// Enhanced file validators with previews (though previews handled in components)

// src/utils/validators/rules.js  (or wherever you store it)
// No breaking changes — just improvements

export const Rules = {
  required: (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  },

  email: (value) =>
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),

  // Indian mobile (10 digits starting 6-9) — keep as-is or make configurable
  mobile: (value) =>
    typeof value === "string" && /^[6-9]\d{9}$/.test(value.trim()),

  alphaSpace: (value) =>
    typeof value === "string" && /^[A-Za-z\s]+$/.test(value.trim()),

  minLength: (value, limit) =>
    typeof value === "string" && value.length >= limit,

  maxLength: (value, limit) =>
    typeof value === "string" && value.length <= limit,

  // Improved URL: more permissive (supports IDN-ish, no mandatory protocol)
  url: (value) =>
    typeof value === "string" &&
    /^(?:(?:https?:\/\/)?(?:[\w-]+\.)+[\w]{2,})(?:\/[^\s]*)?$/.test(value.trim()),

  // Numeric range (better type handling)
  numberRange: (value, { min, max }) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  },

  // Enhanced password (common 2025 standard: 8-128 chars, broader specials)
  passwordStrength: (value) => {
    if (typeof value !== "string") return false;
    const trimmed = value.trim();
    // At least 8 chars, 1 upper, 1 lower, 1 digit, 1 special
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,128}$/.test(trimmed);
  },

  // Async example (good as-is, but add real fetch if needed)
  asyncEmailUnique: async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate
    return value !== "taken@example.com"; // Replace with API
  },

  // ===== File Validators (very good — minor type safety) =====
  fileRequired: (value) => {
    if (!value) return false;
    if (Array.isArray(value)) return value.length > 0;
    return value instanceof File || value instanceof Blob; // Support Blob too
  },

  fileType: (value, allowedTypes = []) => {
    if (!value || !allowedTypes.length) return true;
    const files = Array.isArray(value) ? value : [value];
    return files.every((file) => file instanceof File && allowedTypes.includes(file.type));
  },

  fileSize: (value, maxSizeMB) => {
    if (!value || !maxSizeMB) return true;
    const maxBytes = maxSizeMB * 1024 * 1024;
    const files = Array.isArray(value) ? value : [value];
    return files.every((file) => file instanceof File && file.size <= maxBytes);
  },

  fileCount: (value, maxFiles) => {
    if (!Array.isArray(value)) return true;
    return value.length <= maxFiles;
  },

  fileExtension: (value, allowedExtensions = []) => {
    if (!value || !allowedExtensions.length) return true;
    const files = Array.isArray(value) ? value : [value];
    return files.every((file) => {
      if (!(file instanceof File)) return false;
      const ext = file.name.split(".").pop()?.toLowerCase();
      return ext && allowedExtensions.includes(ext);
    });
  },

  // ===== NEW: Common Additions (optional but useful) =====
  integer: (value) => Number.isInteger(Number(value)),
  positiveNumber: (value) => Number(value) > 0,
  // Example for confirm password (use in schema with ruleValue = otherFieldName)
  sameAs: (value, otherFieldValue) => value === otherFieldValue,
};