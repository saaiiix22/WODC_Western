// helpers/form/FormCheckbox.jsx
// (or wherever you keep your form components)

const FormCheckbox = ({
  name,
  label,
  checked,
  onChange,
  onBlur,
  value,           // optional: if using as controlled with value instead of checked
  disabled = false,
  required = false,
  error,
  className = "",  // optional extra classes
  containerClassName = "", // for wrapping div
}) => {
  // Normalize checked value (works with both checked & value props)
  const isChecked = checked !== undefined ? checked : !!value;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      <div className="flex items-start gap-2">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`
            h-4 w-4 rounded border-gray-300 
            text-blue-600 focus:ring-blue-500 
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            ${error ? 'border-red-500' : 'border-gray-300'}
            transition duration-150 ease-in-out
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />

        {label && (
          <label
            htmlFor={name}
            className={`
              text-sm font-medium 
              ${disabled ? 'text-gray-400' : 'text-gray-700'}
              ${required ? 'after:content-["*"] after:ml-1 after:text-red-500' : ''}
            `}
          >
            {label}
          </label>
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormCheckbox;

// // FormCheckbox
// const FormCheckbox = ({
//   name,
//   label,
//   checked,
//   onChange,
//   disabled = false,
//   error,
// }) => (
//   <div className="flex items-center gap-2 mb-4">
//     <input
//       type="checkbox"
//       name={name}
//       checked={checked}
//       onChange={onChange}
//       disabled={disabled}
//       className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${error ? 'border-red-500' : ''}`}
//       aria-invalid={!!error}
//       aria-describedby={`${name}-error`}
//     />
//     <label className="text-sm text-gray-700">{label}</label>
//     {error && <p id={`${name}-error`} className="text-xs text-red-500 mt-1">{error}</p>}
//   </div>
// );
// export default FormCheckbox;
