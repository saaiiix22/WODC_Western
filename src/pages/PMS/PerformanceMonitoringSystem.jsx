import React, { useEffect, useState } from "react";
import { FiFileText, FiAlertCircle } from "react-icons/fi";
import { getFinancialYearService } from "../../services/budgetService";
import SelectField from "../../components/common/SelectField";
import { encryptPayload } from "../../crypto.js/encryption";
import { getAllDists } from "../../services/blockService";
import { load } from "../../hooks/load";
import {
  getMonthList,
  getPeriodTypeList,
  getQuarterlyList,
  getProjectField,
  getPerformanceKPIList,
  pmsSaveAndUpdate,
} from "../../services/pmsService";
import { SearchBtn } from "../../components/common/CommonButtons";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PerformanceMonitoringSystem = () => {
  const [reportType, setReportType] = useState("");
  const [finOpts, setFinOpts] = useState([]);
  const [finYear, setFinYear] = useState("");
  const [projectOpts, setProjectOpts] = useState([]);
  const [distListOpts, setDistListOpts] = useState([]);
  const [periodTypeList, setPeriodTypeList] = useState([]);
  const [kpiOptions, setKpiOptions] = useState([]);
  const [kpiId, setKpiId] = useState("");
  const [errors, setErrors] = useState({});
  const [districtId, setDistrictId] = useState("");
  const [monthOpts, setMonthOpts] = useState([]);
  const [quarterOpts, setQuarterOption] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [projectId, setProjectId] = useState("");
  const [tableColumns, setTableColumns] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // --- Data Fetching Functions ---
  const getAllFinOpts = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getFinancialYearService(payload);
      if (res?.status === 200 && res?.data.outcome) {
        setFinOpts(res?.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
 
  const getAllQuaterlyList = async () => {
    try {
      const response = await getQuarterlyList({ isActive: true });
      if (response?.data) {
        const formattedOptions = response.data.map((item) => ({
          value: item.id,
          label: item.value,
        }));
        setQuarterOption(formattedOptions);
      }
    } catch (error) {
      console.error("Error fetching quarterly list:", error);
    }
  };

  const getAllMonthList = () =>
    load(getMonthList, { isActive: true }, setMonthOpts);

  const getAllPeriodTypeList = () =>
    load(getPeriodTypeList, { isActive: true }, setPeriodTypeList);

  const getAllKpiOptions = () =>
    load(getPerformanceKPIList, { isActive: true }, setKpiOptions);

  const getAllDistOpts = () =>
    load(getAllDists, { isActive: true }, setDistListOpts);

  const getProjectsByFilters = async () => {
    try {
      if (finYear && districtId && (selectedMonth || selectedQuarter)) {
        const rawPayload = {
          finyearId: parseInt(finYear),
          districtId: parseInt(districtId),
          monthId: reportType === "MONTHLY" ? parseInt(selectedMonth) : null,
          quarterId:
            reportType === "QUARTERLY" ? parseInt(selectedQuarter) : null,
        };
        const encryptedPayload = encryptPayload(rawPayload);
        const res = await getProjectField(encryptedPayload);

        if (res?.status === 200 && res?.data.outcome) {
          setProjectOpts(res?.data.data);
        } else {
          setProjectOpts([]);
        }
      } else {
        setProjectOpts([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectOpts([]);
    }
  };

  // --- Handlers ---
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "finYear") setFinYear(value);
    else if (name === "month") setSelectedMonth(value);
    else if (name === "quarter") setSelectedQuarter(value);
    else if (name === "kpiId") setKpiId(value);
    else if (name === "districtId") setDistrictId(value);
    else if (name === "projectId") setProjectId(value);
  };

  const handleReportTypeChange = (e) => {
    const { value } = e.target;
    setErrors((prev) => ({ ...prev, reportType: "" }));
    setReportType(value);
    setSelectedMonth("");
    setSelectedQuarter("");
  };

  // --- Effects ---
  useEffect(() => {
    getAllFinOpts();
    getAllDistOpts();
    getAllPeriodTypeList();
    getAllKpiOptions();
    getAllMonthList();
    getAllQuaterlyList();
  }, []);

  useEffect(() => {
    if (finYear && districtId && (selectedMonth || selectedQuarter)) {
      getProjectsByFilters();
    } else {
      setProjectOpts([]);
    }
  }, [finYear, districtId, selectedMonth, selectedQuarter, reportType]);

  // --- Submit Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Required Validations
    if (!finYear) newErrors.finYear = "Financial Year is required";
    if (!reportType) newErrors.reportType = "Report Type is required";
    if (!districtId) newErrors.districtId = "District is required";
    if (!projectId) newErrors.projectId = "Project is required";
    if (!kpiId) newErrors.kpiId = "KPI Selection is required";

    // Conditional Validation
    if (reportType?.toUpperCase() === "MONTHLY" && !selectedMonth) {
      newErrors.month = "Month is required";
    }

    if (reportType?.toUpperCase() === "QUARTERLY" && !selectedQuarter) {
      newErrors.quarter = "Quarter is required";
    }

    // If any error exists → stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setApiError(null);

      const rawPayload = {
        finYear: Number(finYear),
        projectName: Number(projectId),
        monthId:
          reportType?.toUpperCase() === "MONTHLY"
            ? Number(selectedMonth)
            : null,
        quaterId:
          reportType?.toUpperCase() === "QUARTERLY"
            ? Number(selectedQuarter)
            : null,
        kpiSelection: Number(kpiId),
        districtId: Number(districtId),
      };

      const response = await pmsSaveAndUpdate(rawPayload);

      if (response?.data?.outcome) {
        const apiData = response.data.data;
        setTableColumns(apiData.columns || []);
        setResultData(apiData.rows || []);
      } else {
        setApiError(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setApiError("Error while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const isProjectFieldEnabled =
    finYear && districtId && (selectedMonth || selectedQuarter);

  // --- Helper to get Label from Value ---
  const getLabel = (options, value, key = "label") => {
    const found = options?.find((opt) => String(opt.value) === String(value));
    return found ? found[key] : value || "-";
  };

  // --- Export Functions (UPDATED) ---
  const handleExportExcel = () => {
    if (!tableColumns.length || !resultData.length) return;

    // 1. Prepare Filter Data
    const filterData = [
      { Filter: "Financial Year", Value: getLabel(finOpts, finYear, "finYear") },
      { Filter: "Report Type", Value: getLabel(periodTypeList, reportType, "lookupValueEn") },
      { Filter: "District", Value: getLabel(distListOpts, districtId, "districtName") },
      { Filter: "Project", Value: getLabel(projectOpts, projectId, "projectName") },
      { Filter: "KPI", Value: getLabel(kpiOptions, kpiId, "lookupValueEn") },
      {
        Filter: "Period", Value: reportType === "MONTHLY"
          ? getLabel(monthOpts, selectedMonth, "monthNameEn")
          : getLabel(quarterOpts, selectedQuarter)
      },
      {}, // Empty Row spacer
      { "Generated On": new Date().toLocaleDateString() }
    ];

    // 2. Prepare Table Data
    const formattedData = resultData.map((row) => {
      const obj = {};
      tableColumns.forEach((col, index) => {
        let value = row[index];
        if (typeof value === "number" && value > 1000000000000) {
          value = new Date(value).toLocaleDateString();
        }
        obj[col] = value ?? "";
      });
      return obj;
    });
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_json(worksheet, filterData, { origin: "A1" });
    XLSX.utils.sheet_add_json(worksheet, formattedData, { origin: "A9" });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "PMS_Report.xlsx");
  };

  const handleExportPDF = () => {
    if (!tableColumns.length || !resultData.length) return;
    const doc = new jsPDF("landscape");
    const filters = [
      [`Financial Year: ${getLabel(finOpts, finYear, "finYear")}`, `Report Type: ${getLabel(periodTypeList, reportType, "lookupValueEn")}`],
      [`District: ${getLabel(distListOpts, districtId, "districtName")}`, `Project: ${getLabel(projectOpts, projectId, "projectName")}`],
      [`KPI: ${getLabel(kpiOptions, kpiId, "lookupValueEn")}`, `Period: ${reportType === "MONTHLY"
        ? getLabel(monthOpts, selectedMonth, "monthNameEn")
        : getLabel(quarterOpts, selectedQuarter)}`],
    ];
    doc.setFontSize(10);
    doc.setTextColor(100);
    let yPos = 15;
    filters.forEach(row => {
      doc.text(row[0], 14, yPos);
      doc.text(row[1], 120, yPos);
      yPos += 7;
    });
    const formattedRows = resultData.map((row) =>
      row.map((cell) =>
        typeof cell === "number" && cell > 1000000000000
          ? new Date(cell).toLocaleDateString()
          : cell ?? ""
      )
    );
    autoTable(doc, {
      startY: yPos + 5, // Start table after filters
      head: [tableColumns],
      body: formattedRows,
      styles: { fontSize: 8 },
      theme: 'grid',
    });
    doc.save("PMS_Report.pdf");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="p-0">
          <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md">
            <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
            Performance Monitoring System
          </h3>
        </div>

        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          {/* API Error Alert */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
              <FiAlertCircle />
              <span>{apiError}</span>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Financial Year */}
            <div className="col-span-2">
              <SelectField
                label={"Financial Year"}
                required={true}
                name="finYear"
                value={finYear}
                options={finOpts?.map((i) => ({
                  value: i.finyearId,
                  label: i.finYear,
                }))}
                placeholder="Select"
                onChange={handleChangeInput}
                error={errors.finYear}
              />
            </div>

            {/* Report Type */}
            <div className="col-span-2">
              <SelectField
                label={"Report Type"}
                name="reportType"
                value={reportType}
                placeholder="Select"
                required={true}
                options={periodTypeList.map((i) => ({
                  value: i.lookupValueCode,
                  label: i.lookupValueEn,
                }))}
                onChange={handleReportTypeChange}
                error={errors.reportType}
              />
            </div>

            {/* Conditional Month/Quarter */}
            {reportType?.toUpperCase() === "MONTHLY" && (
              <div className="col-span-2">
                <SelectField
                  label={"Select Month"}
                  name="month"
                  value={selectedMonth}
                  placeholder="Select Month"
                  required={true}
                  options={monthOpts.map((i) => ({
                    value: i.monthId,
                    label: i.monthNameEn,
                  }))}
                  onChange={handleChangeInput}
                  error={errors.month}
                />
              </div>
            )}
            {reportType?.toUpperCase() === "QUARTERLY" && (
              <div className="col-span-2">
                <SelectField
                  label={"Select Quarter"}
                  name="quarter"
                  value={selectedQuarter}
                  placeholder="Select Quarter"
                  required={true}
                  options={quarterOpts}
                  onChange={handleChangeInput}
                  error={errors.quarter}
                />
              </div>
            )}

            {/* District */}
            <div className="col-span-2">
              <SelectField
                label={"District"}
                name="districtId"
                required={true}
                value={districtId}
                placeholder="Select"
                options={distListOpts.map((i) => ({
                  value: i.districtId,
                  label: i.districtName,
                }))}
                onChange={handleChangeInput}
                error={errors.districtId}
              />
            </div>

            {/* Project Name */}
            <div className="col-span-2">
              <SelectField
                label={"Project Name"}
                required={true}
                name="projectId"
                value={projectId}
                placeholder="Select"
                disabled={!isProjectFieldEnabled}
                onChange={handleChangeInput}
                options={projectOpts.map((i) => ({
                  value: i.projectId,
                  label: i.projectName,
                }))}
                error={errors.projectId}
              />
            </div>

            {/* KPI Selection */}
            <div className="col-span-2">
              <SelectField
                label={"KPI Selection"}
                name="kpiId"
                value={kpiId}
                placeholder="Select"
                options={kpiOptions.map((i) => ({
                  value: i.lookupValueId,
                  label: i.lookupValueEn,
                }))}
                onChange={handleChangeInput}
                error={errors.kpiId}
              />
            </div>

            {/* Submit Button - Aligned with inputs using items-end */}
            <div className="col-span-12 flex justify-center mt-2 pb-2">
              <SearchBtn type="submit" disabled={loading} />
            </div>
          </div>

          {/* --- TABLE SECTION START --- */}
          <div className="mt-6">
            {resultData.length > 0 ? (
              <div className="relative border border-dashed border-blue-300 bg-[#f0f8ff] p-4 rounded-md">
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                  >
                    Export as Excel
                  </button>
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                  >
                    Export as PDF
                  </button>
                </div>

                <span className="absolute -top-3 left-4 bg-[#f0f8ff] px-3 text-sm font-semibold text-blue-600">
                  Monitoring Results
                </span>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                      <tr>
                        {tableColumns.map((col, index) => (
                          <th key={index} className="px-4 py-3 font-bold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {resultData.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="border-b border-gray-100 hover:bg-gray-50 last:border-0 transition-colors"
                        >
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-3">
                              {typeof cell === "number" && cell > 1000000000000
                                ? new Date(cell).toLocaleDateString()
                                : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-between items-center text-xs text-gray-500 border-t border-blue-200 pt-2">
                  <span>Total Records: {resultData.length}</span>
                  <span>Generated on: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              !loading && (
                <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500">
                    Select filters and click Submit to view monitoring details.
                  </p>
                </div>
              )
            )}

            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff7900]"></div>
              </div>
            )}
          </div>
          {/* --- TABLE SECTION END --- */}
        </div>
      </div>
    </form>
  );
};

export default PerformanceMonitoringSystem;