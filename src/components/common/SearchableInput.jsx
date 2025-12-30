import React, { useState, useRef, useEffect } from "react";

const SearchableInput = ({
  label,
  required,
  name,
  value,
  onChange,
  onSelect,
  options = [],
  placeholder = "Select...",
  error,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange({
      target: {
        name,
        value: option.value,
      },
    });

    if (onSelect) {
      onSelect(option);
    }

    setSearch(option.label);
    setOpen(false);
  };


  useEffect(() => {
    const selected = options.find((o) => o.value === value);
    if (selected) setSearch(selected.label);
  }, [value, options]);

  return (
    <div className="flex flex-col gap-1 w-full relative" ref={wrapperRef}>
      {/* Label */}
      {label && (
        <label className="text-[13px] font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        type="text"
        value={search}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => !disabled && setOpen(true)}
        onChange={(e) => {
          const typedValue = e.target.value;

          setSearch(typedValue);
          setOpen(true);

          onChange({
            target: {
              name,
              value: typedValue,
            },
          });
        }}
        className={`
          w-full rounded-md border border-gray-300
          px-2.5 py-1.5 text-sm
          outline-none transition-all duration-200
          placeholder:text-gray-400
          ${disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          }
        `}
      />

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute top-full z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-auto">
          {filteredOptions.length ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50"
              >
                {opt.label}
              </div>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-gray-400">No results found</p>
          )}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default SearchableInput;
