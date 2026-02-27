import React, { useState, useEffect } from "react";
import { FiFileText, FiAlertCircle } from "react-icons/fi";
import { ResetBackBtn, SearchBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { encryptPayload } from "../../crypto.js/encryption";
import { getFinancialYearService } from "../../services/budgetService";
import { DistrictPerformanceRankingsSave } from "../../services/pmsService";

const DistrictPerformanceRankings = () => {
  const [formData, setFormData] = useState({
    financialYear: "",
  });
  const { financialYear, sector } = formData;
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [finOpts, setFinOpts] = useState([]);

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

  useEffect(() => {
    getAllFinOpts();
  }, []);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError(null);
    if (name === "financialYear" && !value) {
      setTableData([]);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!financialYear) newErrors.financialYear = "Financial Year is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setLoading(true);
      setApiError(null);

      const response = await DistrictPerformanceRankingsSave(
        Number(financialYear)
      );

      if (response?.data?.outcome) {
        setTableData(response.data.data);
      } else {
        setApiError(response?.data?.message);
        setTableData([]);
      }
    } catch (error) {
      console.error(error);
      setApiError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Rank",
      width: "80px",
      center: true,
      cell: (row, index) => index + 1, 
    },
    { name: "District", selector: (row) => row.districtName, sortable: true, minWidth: "150px" },
    { name: "Physical Progress %", selector: (row) => `${row.physicalProgress}`, sortable: true, center: true },
    { name: "Financial Progress %", selector: (row) => `${row.financialProgress}`, sortable: true, center: true },
    {
      name: "Delay Days", selector: (row) => row.delayDays, sortable: true, center: true,
      cell: (row) => <span className={`px-2 py-1 rounded text-xs font-semibold ${row.delayDays === 0 ? "bg-green-100 text-green-800" : row.delayDays <= 5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{row.delayDays} days</span>,
    },
    { name: "Score", selector: (row) => row.score, sortable: true, center: true, cell: (row) => <span className="font-bold">{row.score}</span> },
    {
      name: "Category", selector: (row) => row.category, sortable: true, center: true,
      cell: (row) => {
        const categoryColors = { Excellent: "bg-purple-100 text-purple-800", "Very Good": "bg-blue-100 text-blue-800", Good: "bg-green-100 text-green-800", Average: "bg-yellow-100 text-yellow-800", "Below Average": "bg-orange-100 text-orange-800", Poor: "bg-red-100 text-red-800" };
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[row.category] || "bg-gray-100 text-gray-800"}`}>{row.category}</span>;
      },
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="p-0">
          <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md">
            <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
            District Performance Rankings
          </h3>
        </div>
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          {apiError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2"><FiAlertCircle /><span>{apiError}</span></div>}
          <div className="grid grid-cols-12 gap-6 items-start">

            {/* Select Field */}
            <div className="col-span-3 flex flex-col">
              <SelectField
                label={"Financial Year"}
                required={true}
                name="financialYear"
                value={financialYear}
                options={finOpts?.map((i) => ({
                  value: i.finyearId,
                  label: i.finYear,
                }))}
                placeholder="Select"
                onChange={handleChangeInput}
                error={errors.financialYear}
              />
            </div>
 
            {/* Buttons */}
            <div className="col-span-6 flex items-center gap-2 pt-[26px]">
              <ResetBackBtn />
              <SearchBtn type="submit" disabled={loading} />
            </div>

          </div>
          <div className="mt-6">
            {financialYear && tableData.length > 0 ? (
              <div className="relative border border-dashed border-blue-300 bg-[#f0f8ff] p-4 rounded-md">
                <span className="absolute -top-3 left-4 bg-[#f0f8ff] px-3 text-sm font-semibold text-blue-600">Performance Rankings</span>
                <div className="mt-4">
                  <ReusableDataTable data={tableData} columns={columns} noHover={true} />
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500">Please select Financial Year to view rankings.</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Last Updated: {new Date().toLocaleDateString()}</span>
            <span className="text-xs text-gray-600">Total Districts: {tableData.length}</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DistrictPerformanceRankings;