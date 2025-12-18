import React from "react";

const InputField = ({
  label,
  required,
  type = "text",
  name,
  value,
  onChange,
  error,
  textarea = false,
  placeholder,
  min,
  max,
  minLength,
  maxLength,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      <label className="text-[13px] font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input / Textarea */}
      {textarea ? (
        <textarea
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          // placeholder={placeholder}
          placeholder={""}
          {...(minLength !== undefined && { minLength })}
          {...(maxLength !== undefined && { maxLength })}
          {...(min !== undefined && { min })}
          {...(max !== undefined && { max })}
          className={`
            w-full rounded-md border border-gray-300 
            px-2.5 py-1.5 text-sm
            outline-none transition-all duration-200
            placeholder:text-gray-400
            resize-none
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }
          `}
          rows={1}
        ></textarea>
      ) : (
        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          // placeholder={placeholder}
          placeholder={""}
          {...(minLength !== undefined && { minLength })}
          {...(maxLength !== undefined && { maxLength })}
          className={`
            w-full rounded-md border border-gray-300 
            px-2.5 py-1.5 text-sm
            outline-none transition-all duration-200
            placeholder:text-gray-400
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "focus:border-blue-200 focus:ring-2 focus:ring-blue-200"
            }
          `}
        />
      )}

      {/* Error message */}
      {error && <p className="text-red-500 text-xs">{error} *</p>}
    </div>
  );
};

export default InputField;
