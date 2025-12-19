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
      {label && (
        <label className="text-[13px] font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* TEXTAREA */}
      {textarea && type !== "file" && (
        <textarea
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder ?? ""}
          {...(minLength !== undefined && { minLength })}
          {...(maxLength !== undefined && { maxLength })}
          {...(min !== undefined && { min })}
          {...(max !== undefined && { max })}
          className={`
            w-full rounded-md border border-gray-300 
            px-2.5 py-1.5 text-sm resize-none
            outline-none transition-all duration-200
            placeholder:text-gray-400
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }
          `}
          rows={1}
        />
      )}

      {/* FILE INPUT (UNCONTROLLED) */}
      {type === "file" && (
        <input
          type="file"
          name={name}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full rounded-md border border-gray-300 
            px-0.5 py-0.5 text-sm
            outline-none transition-all duration-200
            file:mr-2 file:py-1 file:px-3
            file:rounded-md file:border-0
            file:bg-orange-200 file:text-orange-700
            hover:file:bg-orange-100
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "focus:border-blue-200 focus:ring-2 focus:ring-blue-200"
            }
          `} 
        />
      )}

      {/* NORMAL INPUT */}
      {!textarea && type !== "file" && (
        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder ?? ""}
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

      {/* Error */}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default InputField;
