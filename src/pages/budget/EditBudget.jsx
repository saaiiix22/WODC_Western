import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import { MdOutlineAddCircle } from "react-icons/md";
import { FaMinusCircle } from "react-icons/fa";
import { encryptPayload } from "../../crypto.js/encryption";
import { getGIAtypeList } from "../../services/giaService";
import { toast } from "react-toastify";
import {
  getBankNamesService,
  getBudgetByFinancialYearService,
  getFinancialYearService,
  saveUpdateBudgetService,
} from "../../services/budgetService";

const EditBudget = () => {
  const [rows, setRows] = useState([
    {
      budgetId: null,
      budgetCreationDate: "",
      amount: "",
      branch: "",
      accNo: "",
      bankName: "",
      ifsc: "",
      giaTypeId: "",
    },
  ]);
  const [finyearId, setFinyearId] = useState("");
  const [finyearOption, setFinyearOptions] = useState([]);
  const getFinYear = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getFinancialYearService(payload);
      setFinyearOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };
  const getByFinYear = async () => {
    try {
      const finPayload = encryptPayload({
        isActive: true,
        finyearId: finyearId,
      });

      const financialRes = await getBudgetByFinancialYearService(finPayload);
      const actualData = financialRes?.data?.data || [];

      const mappedRows = actualData.map((item) => ({
        budgetId: item.budgetId,
        budgetCreationDate: item.budgetCreationDate
          ? item.budgetCreationDate.split("/").reverse().join("-")
          : "",
        amount: item.amount || "",
        branch: item.branch || "",
        accNo: item.accNo || "",
        bankName: item.bankName?.bankId || "",
        ifsc: item.ifsc || "",
        giaTypeId: item.giaType?.giaTypeId || "",
      }));
    //   console.log(mappedRows);
      
      setRows(
        mappedRows.length
          ? mappedRows
          : [
              {
                budgetId: null,
                budgetCreationDate: "",
                amount: "",
                branch: "",
                accNo: "",
                bankName: "",
                ifsc: "",
                giaTypeId: "",
              },
            ]
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [giaOpts, setGIAopts] = useState([]);
  const getGIAOptions = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getGIAtypeList(payload);

      const formatted = res?.data?.data?.map((item) => ({
        value: item.giaTypeId,
        label: item.giaTypeName,
      }));

      setGIAopts(formatted);
    } catch (error) {
      console.log(error);
    }
  };

  const [bankOptions, setBankOptions] = useState([]);
  const getAllBankOptions = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getBankNamesService(payload);
      // console.log(res);
      setBankOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  // Prevent duplicated GIA type across rows
  const usedGiaTypes = rows.map((r) => r.giaType);
  const filteredGiaOptions = (currentGia) =>
    giaOpts.filter(
      (opt) => opt.value === currentGia || !usedGiaTypes.includes(opt.value)
    );

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        giaTypeId: "",
        amount: "",
        budgetCreationDate: "",
        bankName: "",
        branch: "",
        accNo: "",
        ifsc: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleInput = (index, name, value) => {
    const updated = [...rows];
    updated[index][name] = value;
    setRows(updated);
  };

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = {
      finYear: {
        finyearId: finyearId,
      },
      budgetDetails: rows.map((item) => ({
        budgetId: item.budgetId ?? null,
        budgetCreationDate: formatDateToDDMMYYYY(item.budgetCreationDate),
        amount: Number(item.amount),
        branch: item.branch,
        accNo: item.accNo,
        ifsc: item.ifsc,
        giaType: {
          giaTypeId: Number(item.giaTypeId),
        },
        bankName: {
          bankId: Number(item.bankName),
        },
      })),
    };

    try {
      const payload = encryptPayload(sendData);
      const res = await saveUpdateBudgetService(payload);
      console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        toast.success(res?.data.message);
        setFinyearId("");
        setRows([
          {
            budgetId: null,
            budgetCreationDate: "",
            amount: "",
            branch: "",
            accNo: "",
            bankName: "",
            ifsc: "",
            giaTypeId: "",
          },
        ]);
      }
    } catch (error) {
      throw error;
    }

    console.log(sendData);
  };

  useEffect(() => {
    if (finyearId) {
      getByFinYear();
    }
  }, [finyearId]);

  useEffect(() => {
    getFinYear();
    getGIAOptions();
    getAllBankOptions();
  }, []);

  return (
    <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="p-0">
        <h3
          className="flex items-center gap-2 text-white font-normal text-[18px]
                border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-sm"
        >
          <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
          Edit Budget Details
        </h3>
      </div>

      {/* Financial Year */}
      <form onSubmit={handleSubmit}>
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <div className="grid grid-cols-12">
            <div className="col-span-2">
              <SelectField
                label="Select Financial Year"
                required={true}
                name="finyearId"
                placeholder="Choose Financial Year"
                value={finyearId}
                options={finyearOption?.map((d) => ({
                  value: d.finyearId,
                  label: d.finYear,
                }))}
                onChange={(e) => setFinyearId(Number(e.target.value))}
              />
            </div>
          </div>

          {/* TABLE START */}
          {finyearId && (
            <table className="table-fixed w-full border border-slate-300 mt-5">
              <thead className="bg-slate-100">
                <tr>
                  <td className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-slate-200">
                    SL No
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    GIA Type
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Amount
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Budget Creation Date
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Bank Name
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Branch
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Account Number
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    IFSC Code
                  </td>
                  <td className="w-[60px] text-center text-sm px-4 py-1 border-r border-slate-200">
                    <button type="button" onClick={handleAddRow}>
                      <MdOutlineAddCircle className="inline text-green-600 text-xl" />
                    </button>
                  </td>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-b border-slate-200">
                    <td className="border-r border-slate-200 text-center">
                      {index + 1}
                    </td>

                    {/* GIA TYPE SELECT */}
                    <td className="border-r border-slate-200 px-2 py-1">
                      <SelectField
                        name="giaTypeId"
                        value={row.giaTypeId}
                        onChange={(e) =>
                          handleInput(
                            index,
                            "giaTypeId",
                            Number(e.target.value)
                          )
                        }
                        options={filteredGiaOptions(row.giaTypeId)}
                        placeholder="Choose GIA Type"
                      />
                    </td>

                    {/* Amount */}
                    <td className="border-r border-slate-200 px-2 py-1">
                      <input
                        type="number"
                        value={row.amount}
                        onChange={(e) =>
                          handleInput(index, "amount", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                      />
                    </td>

                    {/* Budget Creation Date */}
                    <td className="border-r border-slate-200 px-2 py-1">
                      <input
                        type="date"
                        value={row.budgetCreationDate}
                        onChange={(e) =>
                          handleInput(
                            index,
                            "budgetCreationDate",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm text-gray-600"
                      />
                    </td>

                    {/* Bank Name */}
                    <td className="border-r border-slate-200 px-2 py-1">
                      <SelectField
                        name="bankName"
                        value={row.bankName}
                        onChange={(e) =>
                          handleInput(index, "bankName", e.target.value)
                        }
                        options={bankOptions?.map((d) => ({
                          value: d.bankId,
                          label: d.bankName,
                        }))}
                        placeholder="Select Bank"
                      />
                    </td>

                    {/* Branch */}
                    <td className="border-r border-slate-200 px-2 py-1">
                      <input
                        type="text"
                        value={row.branch}
                        onChange={(e) =>
                          handleInput(index, "branch", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                      />
                    </td>

                    {/* Account Number */}
                    <td className="border-r border-slate-200 px-2 py-1">
                      <input
                        type="text"
                        value={row.accNo}
                        onChange={(e) =>
                          handleInput(index, "accNo", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                      />
                    </td>

                    {/* IFSC */}
                    <td className="border-r border-slate-200 px-2 py-1">
                      <input
                        type="text"
                        value={row.ifsc}
                        onChange={(e) =>
                          handleInput(index, "ifsc", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                      />
                    </td>

                    {/* REMOVE ROW */}
                    <td className="border-r border-slate-200 text-center">
                      {rows.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => handleRemoveRow(index)}
                        >
                          <FaMinusCircle />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="col-span-12 flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          <SubmitBtn />
        </div>
      </form>
    </div>
  );
};

export default EditBudget;
