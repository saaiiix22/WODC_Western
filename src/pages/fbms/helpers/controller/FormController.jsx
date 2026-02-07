// Upgraded useFormController with industry standards
// Added: touched state for showing errors only after blur
// Debounced validation for performance on change
// Async validation support
// useEffect for dependencies
// Added setFieldValue for programmatic updates
// NEW FIX: Added clearErrors function to manually clear errors + touched
// Trigger immediate validation after file change to fix persistent red border
// Clear touched/errors when field becomes valid (enhanced useEffect)
import { useState, useEffect, useCallback } from "react";
import { validateForm } from "../../../fbms/helpers/validators/ValidateForms";
import debounce from "lodash/debounce"; // Add lodash or implement debounce

export const FormController = ({
  initialValues = {},
  validationSchema,
  onSubmit,
  editModeKey,
  dependencies = {}, // { parentField: ["child1", "child2"] }
  validateOnChange = true,
  validateOnBlur = true,
  debounceTime = 300,
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [fileKey, setFileKey] = useState(0);

  const isEditMode = !!values[editModeKey];

  // Debounced validation with cleanup (industry standard)
  const debouncedValidate = useCallback(
    debounce(async () => {

      const validationErrors = await validateForm(
        values, 
        validationSchema, 
        { isEditMode }
      );

      setErrors(validationErrors);

      // Clear touched for now-valid fields
      setTouched((prevTouched) => {
        const newTouched = { ...prevTouched };
        Object.keys(newTouched).forEach((field) => {
          if (!validationErrors[field]) {
            delete newTouched[field];
          }
        });
        return newTouched;
      });
    }, debounceTime),
    [values, validationSchema, isEditMode]
  );

  // Initial validation on mount
  useEffect(() => {
    if (validationSchema) debouncedValidate();
    return () => debouncedValidate.cancel(); // Cleanup
  }, [debouncedValidate, validationSchema]);

  // Auto-clear touched + errors when fields become valid
  // This fixes stuck red border after remove → re-add file
  useEffect(() => {
    Object.entries(errors).forEach(([field, errorMsg]) => {
      if (!errorMsg && touched[field]) {
        setTouched((prev) => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      }
    });
  }, [errors, touched]);  // Depend on both for reactivity

  const handleChange = (name, value) => {
    setValues((prev) => {
      let updated = { ...prev, [name]: value };

      // Reset dependents synchronously (safe — no loop)
      if (dependencies[name]) {
        dependencies[name].forEach((depField) => {
          updated[depField] = initialValues[depField] ?? "";
        });
      }
      return updated;
    });

    setTouched((prev) => ({ ...prev, [name]: true }));

    if (validateOnChange) {
      debouncedValidate();
      // For files: Flush debounce to immediate validate + clear stuck errors
      if (name.includes("File") || name.includes("Document")) {
        debouncedValidate.flush();
      }
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validateOnBlur) debouncedValidate.flush(); // Immediate on blur
  };

  const handleFileChange = (name, files, multiple = false) => {
    const value = multiple ? Array.from(files) : files[0] || null;
    handleChange(name, value);

    // NEW: When removing file, increment fileKey to force input remount + clear browser cache
    if (!value) {
      setFileKey((prev) => prev + 1);
    }

    // Immediate validation after file change to fix persistence
    debouncedValidate.flush();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Touch all fields on submit
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true,
    }), {});
    setTouched(allTouched);

    const validationErrors = await validateForm(
      values, 
      validationSchema, 
      { isEditMode }
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    await onSubmit(values, resetForm);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setFileKey((k) => k + 1);
  };

  // NEW: Manual clearErrors (inspired by React Hook Form)
  const clearErrors = (fields) => {
    setErrors((prev) => {
      const updated = { ...prev };
      if (Array.isArray(fields)) {
        fields.forEach((field) => delete updated[field]);
      } else if (fields) {
        delete updated[fields];
      } else {
        return {}; // Clear all
      }
      return updated;
    });

    setTouched((prev) => {
      const updated = { ...prev };
      if (Array.isArray(fields)) {
        fields.forEach((field) => delete updated[field]);
      } else if (fields) {
        delete updated[fields];
      } else {
        return {}; // Clear all
      }
      return updated;
    });

    debouncedValidate.flush(); // Re-validate immediately
  };

  const setFieldValue = (name, value) => handleChange(name, value);

  const isValid = Object.keys(errors).length === 0 && Object.keys(touched).length > 0;

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleFileChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
    setErrors,
    isValid,
    fileKey,
    clearErrors,
  };
};