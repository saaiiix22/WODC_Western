// src/helpers/controller/FormSubmit.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import { encryptPayload } from '../../../../crypto.js/encryption';

export const useFormSubmit = ({
  apiFn,                    // function that does the actual POST (e.g. Api.post)
  onSuccess,
  onError,
  redirect,
  fileFields = {},          // { fieldName: "single" | "multiple" }
  encryptKey = "cipherText", // name of the encrypted field in payload / FormData
  sendAsParam = false,      // (default false)
} = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async ({ values, validate, resetForm }) => {
    // Validate if validation function provided
    if (validate && !(await validate())) {
      return;
    }

    setLoading(true);
    setError(null);

    const hasFiles = Object.keys(fileFields).length > 0;
    
    // Separate non-file fields for encryption
    const payload = {};
    Object.keys(values).forEach((key) => {
      if (!fileFields[key]) {
        payload[key] = values[key];
      }
    });

    // Encrypt the payload
    const encrypted = encryptPayload(JSON.stringify(payload));

    let requestBody;
    let config = {};

    if (hasFiles) {
      // WITH FILES - multipart/form-data
      const formData = new FormData();
      formData.append(encryptKey, encrypted);

      // Append files
      Object.entries(fileFields).forEach(([field, type]) => {
        const value = values[field];
        if (!value) return;

        if (type === "single" && value instanceof File) {
          formData.append(field, value);
        } else if (type === "multiple" && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) formData.append(field, file);
          });
        }
      });

      requestBody = formData;
      // FormData automatically sets content-type with boundary
    } else {
      // WITHOUT FILES
      if (sendAsParam) {
        // Send encrypted string as parameter
        requestBody = null;
        config.params = { [encryptKey]: encrypted };
      } else {
        // Send as JSON body
        requestBody = { [encryptKey]: encrypted };
        config.headers = { "Content-Type": "application/json" };
      }
    }

    try {
      let res;
      
      if (sendAsParam && !hasFiles) {
        // For @RequestParam APIs (no files)
        res = await apiFn(encrypted, config);
      } else {
        // For @RequestBody or FormData APIs
        res = await apiFn(requestBody, config);
      }

      if (res?.data?.outcome) {
        toast.success(res?.data?.message || "Saved successfully");
        resetForm?.();
        onSuccess?.(res);
        redirect?.();
      } else {
        const errMsg = res?.data?.message || "Operation failed";
        toast.error(errMsg);
        setError(errMsg);
        onError?.(res);
      }
    } catch (err) {
      console.error("Submit error:", err);

      let errMsg = "Something went wrong";

      if (err.response) {
        // Server responded with error status
        errMsg = err.response.data?.message || err.response.statusText || errMsg;
      } else if (err.request) {
        // Request made but no response
        errMsg = "No response from server";
      } else {
        // Error setting up request
        errMsg = err.message;
      }

      toast.error(errMsg);
      setError(errMsg);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};

// Usage Examples:
// 
// 1. For @RequestParam API (no files):
// const { submit, loading: submitLoading } = useFormSubmit({
//   apiFn: saveFeedbackQuestionsService,
//   redirect: () => navigate('/success'),
//   sendAsParam: true,
// });
// 
// 2. For @RequestBody API with files:
// const { submit, loading: submitLoading } = useFormSubmit({
//   apiFn: saveFeedbackTypeService,
//   fileFields: {
//     typeDocumentPath: "single",
//   },
//   redirect: () => navigate('/feedback-types'),
//   sendAsParam: false,
// });
// 
// 3. For @RequestBody API without files:
// const { submit, loading: submitLoading } = useFormSubmit({
//   apiFn: saveDataService,
//   onSuccess: (res) => console.log('Success:', res.data),
//   onError: (err) => console.error('Error:', err),
// });