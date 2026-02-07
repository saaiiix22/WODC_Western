// Enhanced Form Components with Tailwind CSS
// Added: Accessibility (ARIA), focus/error states, responsive
// New: FormRadio, FormDate (using native date input)
// For File: Added preview, drag-drop support

// FormButton
const FormButton = ({
  label,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  loading = false, // New: Spinner for loading
}) => {
  const base = "px-6 py-2 text-white rounded text-sm font-medium transition duration-200";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    success: "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  };
  const disabledStyle = disabled || loading ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${disabledStyle}`}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {label}
        </span>
      ) : label}
    </button>
  );
};
export default FormButton;