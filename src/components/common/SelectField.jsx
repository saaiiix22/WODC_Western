import React from "react";

const SelectField = ({
  label,
  required,
  name,
  value,
  onChange,
  options = [],
  error,
  disabled = false,
  placeholder = "Select an option",
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      <label className="text-[13px] font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Select */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full rounded-md border border-gray-300 
          px-2.5 py-1.5 text-sm
          outline-none transition-all duration-200 cursor-pointer
          placeholder:text-gray-400
          ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"}
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
        `}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Error */}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default SelectField;
