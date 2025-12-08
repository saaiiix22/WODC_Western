import React, { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({
  label,
  required,
  name,
  value = [],
  onChange,
  options = [],
  error,
  placeholder = "Select options",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle select/unselect
  const handleSelect = (optionValue) => {
    let updated;
    if (value.includes(optionValue)) {
      updated = value.filter((v) => v !== optionValue);
    } else {
      updated = [...value, optionValue];
    }

    onChange({
      target: {
        name,
        value: updated,
      },
    });
  };

  // Display selected text
  const getSelectedText = () => {
    if (value.length === 0) return placeholder;
    return options
      .filter((opt) => value.includes(opt.value))
      .map((opt) => opt.label)
      .join(", ");
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      <label className="text-[13px] font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Dropdown Box */}
      <div
        ref={dropdownRef}
        className={`relative w-full`}
      >
        <div
          onClick={() => !disabled && setOpen(!open)}
          className={`
            w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm cursor-pointer
            ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"}
            ${open ? "border-blue-500" : ""}
          `}
        >
          <span className={value.length === 0 ? "text-gray-400" : ""}>
            {getSelectedText()}
          </span>
        </div>

        {/* Dropdown */}
        {open && (
          <div
            className="
              absolute mt-1 w-full bg-white shadow-md rounded-md 
              border border-gray-200 max-h-52 overflow-y-auto z-50 animate-fadeIn
            "
          >
            {options.length === 0 ? (
              <p className="p-2 text-gray-500 text-sm">No options available</p>
            ) : (
              options.map((opt, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(opt.value)}
                    onChange={() => handleSelect(opt.value)}
                  />
                  {opt.label}
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default MultiSelectDropdown;
