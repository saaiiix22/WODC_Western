import React, { useState } from "react";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import DownloadModal from "./DownloadModal";

const ImportExportAsset = () => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [downloadModal, setDownloadModal] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleValidate = () => {
    // API call for pre-validation
    setSummary({
      total: 20,
      valid: 16,
      invalid: 4,
    });

    setErrors([
      { row: 3, column: "Asset Name", message: "Required field missing" },
      { row: 7, column: "Asset Cost", message: "Invalid number" },
    ]);
  };

  const handleImport = () => {
    console.log("Final import confirmed");
  };

  return (
    <div className="mt-3 bg-white rounded-md border border-[#f1f1f1] shadow-md">
      {/* Header */}
      <h3 className="text-white text-[18px] px-4 py-2 bg-light-dark border-b-2 border-[#ff9800] rounded-t-md">
        Bulk Asset Upload
      </h3>

      {/* Body */}
      <div className="py-6 px-5 text-[#444]">
        {/* Download Template */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setDownloadModal(true)}
            className="px-4 py-2 bg-[#ff9800] text-white rounded text-sm"
          >
            Download Excel Template
          </button>
          {downloadModal && (
            <DownloadModal onClose={() => setDownloadModal(false)} />
          )}
        </div>

        {/* Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Upload Excel File
          </label>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="block"
          />
        </div>

        {/* Validate */}
        <button
          type="button"
          onClick={handleValidate}
          disabled={!file}
          className="px-4 py-2 bg-[#4caf50] text-white rounded text-sm"
        >
          Validate File
        </button>

        {/* Summary */}
        {summary && (
          <div className="mt-6 p-4 border rounded bg-[#f9f9f9]">
            <p>
              Total Records: <b>{summary.total}</b>
            </p>
            <p className="text-green-600">Valid: {summary.valid}</p>
            <p className="text-red-600">Invalid: {summary.invalid}</p>
          </div>
        )}

        {/* Error Table */}
        {errors.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Validation Errors</h4>
            <table className="w-full border text-sm">
              <thead className="bg-[#f5f5f5]">
                <tr>
                  <th className="border px-2 py-1">Row</th>
                  <th className="border px-2 py-1">Column</th>
                  <th className="border px-2 py-1">Error</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((err, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{err.row}</td>
                    <td className="border px-2 py-1">{err.column}</td>
                    <td className="border px-2 py-1 text-red-600">
                      {err.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-center gap-3 bg-[#42001d0f] border-t px-4 py-3 rounded-b-md">
        <ResetBackBtn />
        <SubmitBtn
          onClick={handleImport}
          disabled={!summary || errors.length > 0}
        >
          Confirm Import
        </SubmitBtn>
      </div>
    </div>
  );
};

export default ImportExportAsset;
