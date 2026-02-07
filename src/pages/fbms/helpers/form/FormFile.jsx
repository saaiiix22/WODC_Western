// FormFile with preview
// Use state for previews in parent or here if single-use
const FormFile = ({
  name,
  label,
  value,
  existingFileName = "",
  onChange,
  required = false,
  error,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = false,
  previews = [],
}) => {

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div 
        className={`rounded-md mt-1 flex items-center gap-3 ${
          error ? "border-red-500" : "border-gray-300"
        } hover:border-blue-500 transition`}
      >
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={onChange}
          multiple={multiple}
          className="hidden"  // hide default input
        />

        {/* Styled button like your example */}
        <button
          type="button"
          onClick={() => document.querySelector(`input[name="${name}"]`)?.click()}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border-2 border-dashed
            ${error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {value ? value.name : (existingFileName ? "Replace file" : "Upload file")}
          </span>
        </button>

        {/* Remove button if new file selected */}
        {value && (
          <button
            type="button"
            onClick={() => {onChange({ target: { name, files: [], value: "" }})}}
            className="p-2 text-red-600 hover:text-red-800"
          >
            ×
          </button>
        )}
      </div>

      {/* Show existing file name when editing */}
      {existingFileName && !value && (
        <div className="mb-2 text-sm text-gray-600">
          Current file: 
          <span className="font-medium text-blue-600 ml-1">
            {existingFileName}
          </span>
        </div>
      )}

      {previews.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {previews.map((preview, idx) => (
            <img
              key={idx}
              src={preview}
              alt="preview"
              className="h-20 w-20 object-cover rounded border shadow-sm"
            />
          ))}
        </div>
      )}

      {error && (
        <p id={`${name}-error`} className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormFile;