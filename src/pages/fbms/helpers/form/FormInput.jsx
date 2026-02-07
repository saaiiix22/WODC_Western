// Usage for previews in parent:
// const [previews, setPreviews] = useState([]);
// handleFileChange = (name, files) => {
//   const urls = Array.from(files).map(file => URL.createObjectURL(file));
//   setPreviews(urls);
//   // Clean up: useEffect return () => urls.forEach(URL.revokeObjectURL);
// }

// FormInput
const FormInput = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur, // Added for touch
  required = false,
  disabled = false,
  error,
}) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
    )}
    <input
      id={id || name}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md text-sm shadow-sm
        ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}
        ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
        transition duration-150 ease-in-out`}
      aria-invalid={!!error}
      aria-describedby={`${name}-error`}
    />
    {error && <p id={`${name}-error`} className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
export default FormInput;