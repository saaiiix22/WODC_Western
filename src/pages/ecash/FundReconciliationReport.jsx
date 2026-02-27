import React, { useState, useEffect } from "react";
import { FiFileText, FiAlertCircle } from "react-icons/fi";
import { ResetBackBtn, SearchBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import axios from "axios";
import {
  getFundReconciliationAccount,
  submitFundReconciliationReport,
} from "../../services/fundReconciliation";

const FundReconciliationReport = () => {
  const [formData, setFormData] = useState({
    bankConfigId: "",
    fromDate: "",
    toDate: "",
  });
  const { bankConfigId, fromDate, toDate } = formData;
  const [errors, setErrors] = useState({});
  const [reportData, setReportData] = useState(null);
  const [accountOptions, setAccountOptions] = useState([]);
  const [isFetchingAccounts, setIsFetchingAccounts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchAccountOptions = async () => {
      try {
        setIsFetchingAccounts(true);
        const response = await getFundReconciliationAccount();
       
        if (response?.data?.data) {
          setAccountOptions(
            response.data.data.map((account) => ({
              value: account.bankConfigId,
              label: account.displayName,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch account options:", error);
        setApiError("Failed to load bank accounts. Please refresh the page.");
      } finally {
        setIsFetchingAccounts(false);
      }
    };
    fetchAccountOptions();
  }, []);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
   
    if (apiError) setApiError(null);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!bankConfigId) newErrors.bankConfigId = "Bank account is required";
    if (!fromDate) newErrors.fromDate = "From Date is required";
    if (!toDate) newErrors.toDate = "To Date is required";
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      newErrors.toDate = "To Date must be after From Date";
    }
    return newErrors;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
   
    setIsSubmitting(true);
    setApiError(null);

    try {
      const payload = {
        bankConfigId: Number(bankConfigId),
        fromDate: fromDate,
        toDate: toDate,
      };

      console.log("Submitting payload:", payload);

      const response = await submitFundReconciliationReport(payload);

      if (!response.data.outcome) {
        throw new Error(response.data.message);
      }

      setReportData(response.data.data);
    } catch (error) {
      setApiError(error.message || "Failed to generate report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReportDataEmpty =
    !reportData?.totalBudgetDetails?.length &&
    !reportData?.totalExpenditureDetails?.length;

  const totalBudgetAmount = reportData?.totalBudgetDetails?.reduce(
    (sum, budget) => sum + budget.budgetAmount, 0
  ) || 0;

  const totalExpenditureAmount = reportData?.totalExpenditureDetails?.reduce(
    (sum, expenditure) => sum + expenditure.expenditureAmount, 0
  ) || 0;

  return (
    <form onSubmit={handleSearch}>
      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      
        <div className="p-0">
          <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md">
            <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
            Fund Reconciliation 
          </h3>
        </div>

        <div className="min-h-[120px] py-5 px-4 text-[#444]">
         
          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
              <FiAlertCircle />
              <span>{apiError}</span>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-2">
              <SelectField
                label={"Bank Account"}
                required={true}
                name="bankConfigId"
                value={bankConfigId}
                options={accountOptions}
                placeholder="Select"
                onChange={handleChangeInput}
                error={errors.bankConfigId}
                disabled={isFetchingAccounts}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label={"From Date"}
                required={true}
                name="fromDate"
                value={fromDate}
                type="date"
                placeholder="Select From Date"
                onChange={handleChangeInput}
                error={errors.fromDate}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label={"To Date"}
                required={true}
                name="toDate"
                value={toDate}
                type="date"
                placeholder="Select To Date"
                onChange={handleChangeInput}
                error={errors.toDate}
              />
            </div>
            <div className="col-span-3 flex gap-2">
              <ResetBackBtn />
              <SearchBtn
                type="submit"
                disabled={isSubmitting || isFetchingAccounts}
              />
            </div>
          </div>

          {reportData && (
            <div className="mt-6">
              {isReportDataEmpty ? (
                <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500">
                    No records found for the selected criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-6">
             
                  {reportData.totalBudgetDetails?.length > 0 && (
                    <div className="col-span-3">
                      <div className="relative border border-dashed border-blue-300 bg-[#f0f8ff] p-3 rounded-md">
                        <span className="absolute -top-3 left-4 bg-[#f0f8ff] px-3 text-sm font-semibold text-blue-600">
                          Budget Details
                        </span>
                        <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">
                              Date
                            </h4>
                            {reportData.totalBudgetDetails.map(
                              (budget, index) => (
                                <div
                                  key={index}
                                  className="text-slate-900 py-0.5"
                                >
                                  {budget.budgetDate}
                                </div>
                              ),
                            )}
                            <div className="font-bold text-blue-600 pt-2 mt-2 border-t border-blue-200">
                              Total
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">
                              Amount
                            </h4>
                            {reportData.totalBudgetDetails.map(
                              (budget, index) => (
                                <div
                                  key={index}
                                  className="text-slate-900 py-0.5"
                                >
                                  ₹{budget.budgetAmount.toLocaleString('en-IN')}
                                </div>
                              ),
                            )}
                            <div className="font-bold text-blue-600 pt-2 mt-2 border-t border-blue-200">
                              ₹{totalBudgetAmount.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

            
                  {reportData.totalExpenditureDetails?.length > 0 && (
                    <div className={`${reportData.totalBudgetDetails?.length > 0 ? "col-span-9" : "col-span-12"}`}>
                      <div className="relative border border-dashed border-green-300 bg-[#f0fff0] p-4 rounded-md">
                        <span className="absolute -top-3 left-4 bg-[#f0fff0] px-3 text-sm font-semibold text-green-600">
                          Expenditure Details
                        </span>
                        <div className="overflow-x-auto mt-2">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                              <tr>
                                <th scope="col" className="px-2 py-2 text-left text-[11px] font-bold text-gray-800 uppercase tracking-wider bg-gray-200">
                                  Project Name
                                </th>
                                <th scope="col" className="px-2 py-2 text-left text-[11px] font-bold text-gray-800 uppercase tracking-wider bg-gray-200">
                                  Milestone Name
                                </th>
                                <th scope="col" className="px-2 py-2 text-left text-[11px] font-bold text-gray-800 uppercase tracking-wider bg-gray-200">
                                  Agency Name
                                </th>
                                <th scope="col" className="px-2 py-2 text-left text-[11px] font-bold text-gray-800 uppercase tracking-wider bg-gray-200">
                                  Release Date
                                </th>
                                <th scope="col" className="px-2 py-2 text-left text-[11px] font-bold text-gray-800 uppercase tracking-wider bg-gray-200">
                                  UC Submission Date
                                </th>
                                <th scope="col" className="px-2 py-2 text-left text-[11px] font-bold text-gray-800 uppercase tracking-wider bg-gray-200">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {reportData.totalExpenditureDetails.map((expenditure, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition-colors duration-150">
                                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900" title={expenditure.projectName}>
                                    <div className="text-ellipsis overflow-hidden" style={{ maxWidth: '150px' }}>
                                      {expenditure.projectName}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900" title={expenditure.milestoneName}>
                                    <div className="text-ellipsis overflow-hidden" style={{ maxWidth: '150px' }}>
                                      {expenditure.milestoneName}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                                    {expenditure.agencyName}
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                                    {expenditure.releaseDate}
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                                    {expenditure.ucSubmissionDate}
                                  </td>
                                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                                    ₹{expenditure.expenditureAmount.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              ))}
                             
                              <tr className="bg-green-50 font-bold">
                                <td colSpan="5" className="px-2 py-2 text-right text-xs text-green-700">
                                  Total:
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap text-xs text-green-700">
                                  ₹{totalExpenditureAmount.toLocaleString('en-IN')}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

      
        <div className="bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
        </div>
      </div>
    </form>
  );
};

export default FundReconciliationReport;