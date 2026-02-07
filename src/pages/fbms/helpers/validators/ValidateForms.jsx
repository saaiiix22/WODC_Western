// Updated validateForm to support async rules
// Returns Promise for async support
import { Rules } from "./Rules"; 

export const validateForm = async (data, schema, context = {}) => {
  const errors = {};
  
  for (const field of Object.keys(schema)) {
    const value = data[field];
    const rules = schema[field];
    
    for (const rule of rules) {
      const { type, message, value: ruleValue } = rule;
      let isValid = true;

      // Special handling for fileRequired in edit mode
      if (type === "fileRequired") {
        // If we're in edit mode (has typeId) → file is optional
        if (context.isEditMode && !value) {
          isValid = true; // skip required check
        } else {
          isValid = Rules[type](value, ruleValue);
        }
      } else if (Rules[type]) {
        isValid = Rules[type](value, ruleValue);
        if (isValid instanceof Promise) {
          isValid = await isValid;
        }
      }

      if (!isValid) {
        errors[field] = message;
        break; // stop at first error
      }
    }
  }
  
  return errors;
};