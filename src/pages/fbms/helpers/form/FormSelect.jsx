// FormSelect
const FormSelect = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  options = [],
  required = false,
  disabled = false,
  error,
}) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md text-sm shadow-sm
        ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}
        ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
        transition duration-150 ease-in-out`}
      aria-invalid={!!error}
      aria-describedby={`${name}-error`}
    >
      <option value="">-- Select --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p id={`${name}-error`} className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
export default FormSelect;