// FormTextarea
const FormTextarea = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  rows = 4,
  error,
}) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
    )}
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 border rounded-md text-sm shadow-sm
        ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}
        transition duration-150 ease-in-out`}
      aria-invalid={!!error}
      aria-describedby={`${name}-error`}
    />
    {error && <p id={`${name}-error`} className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
export default FormTextarea;