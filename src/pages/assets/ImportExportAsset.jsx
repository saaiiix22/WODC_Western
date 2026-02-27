import React, { useRef, useState } from "react";
import { ResetBackBtn } from "../../components/common/CommonButtons";
import { downloadAssetService, uploadAssetExcelService } from "../../services/assetsService";
import { GrSave } from "react-icons/gr";
import { toast } from "react-toastify";
import { FiUploadCloud, FiFile, FiX, FiDownload } from "react-icons/fi";

const ImportExportAsset = () => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".xlsx")) {
      toast.error("Only .xlsx files are allowed");
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setSummary(null);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setErrors([]);
    setSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await downloadAssetService();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Assets_Template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Template download failed");
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await uploadAssetExcelService(formData);

      if (response.data?.total !== undefined) {
        setSummary(response.data);
        setErrors(response.data.errors || []);
      } else {
        toast.success(response.data || "Import successful");
      }

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      toast.error(error.response?.data || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 bg-white rounded-xl shadow-md border overflow-hidden">

      {/* ── Header ── */}
      <div className="flex justify-between items-center px-6 py-3 bg-light-dark text-white rounded-t-xl border-b-2 border-[#ff9800]">
        <h3 className="text-lg font-semibold">Bulk Asset Import</h3>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#ff9800] text-white rounded text-sm hover:bg-[#e68900] transition-all active:scale-95"
        >
          <FiDownload className="text-sm" />
          Download Template
        </button>
      </div>

      {/* ── Body ── */}
      <div className="p-6 space-y-5">

        {/* Upload Zone */}
        <div
          onClick={() => !file && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl transition-colors select-none
            ${file
              ? "border-green-400 bg-green-50 cursor-default"
              : "border-gray-300 bg-gray-50 hover:border-[#ff9800] hover:bg-orange-50 cursor-pointer"
            }`}
        >
          {/* hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            /* ── File selected state ── */
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <FiFile className="text-green-600 text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-green-700 text-sm truncate">{file.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB &nbsp;·&nbsp; Ready to import
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                title="Remove file"
                className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center transition-colors"
              >
                <FiX className="text-base" />
              </button>
            </div>
          ) : (
            /* ── Empty / click-to-upload state ── */
            <div className="flex flex-col items-center gap-2 py-10 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                <FiUploadCloud className="text-3xl text-gray-400" />
              </div>
              <p className="font-medium text-gray-600 text-sm">
                Click to browse &amp; select your Excel file
              </p>
              <p className="text-xs text-gray-400">
                Supported format: <span className="font-semibold text-gray-500">.xlsx</span>
              </p>
            </div>
          )}
        </div>

        {/* ── Import Summary ── */}
        {summary && (
          <div className="border border-blue-200 rounded-xl bg-blue-50 p-4">
            <p className="font-semibold text-blue-700 mb-3 text-sm uppercase tracking-wide">
              Import Summary
            </p>
            <div className="flex gap-3">
              <div className="flex-1 bg-white rounded-lg border px-4 py-3 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Total</p>
                <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
              </div>
              <div className="flex-1 bg-white rounded-lg border border-green-200 px-4 py-3 text-center">
                <p className="text-xs text-green-500 uppercase tracking-wide mb-0.5">Success</p>
                <p className="text-2xl font-bold text-green-600">{summary.success}</p>
              </div>
              <div className="flex-1 bg-white rounded-lg border border-red-200 px-4 py-3 text-center">
                <p className="text-xs text-red-400 uppercase tracking-wide mb-0.5">Failed</p>
                <p className="text-2xl font-bold text-red-500">{summary.failed}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Validation Errors ── */}
        {errors.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-red-600 text-sm flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                {errors.length}
              </span>
              Validation Errors
            </h4>

            <div className="max-h-60 overflow-auto border rounded-lg">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="border px-3 py-2 text-left w-12 text-gray-600">#</th>
                    <th className="border px-3 py-2 text-left text-gray-600">Error Message</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.map((err, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-red-50"}
                    >
                      <td className="border px-3 py-2 text-gray-400">{index + 1}</td>
                      <td className="border px-3 py-2 text-red-600">{err}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
        <ResetBackBtn />

        <button
          type="button"
          onClick={handleImport}
          disabled={!file || loading}
          className="bg-[#bbef7f] text-[green] text-[13px] px-3 py-1 rounded-sm border border-[green] transition-all active:scale-95 uppercase flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GrSave />
          {loading ? "Importing..." : "Confirm Import"}
        </button>
      </div>
    </div>
  );
};

export default ImportExportAsset;