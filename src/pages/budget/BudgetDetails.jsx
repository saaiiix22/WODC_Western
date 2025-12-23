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
  getBankConfigByBankIdService,
  getBankNamesService,
  getBudgetByFinancialYearService,
  getFinancialYearService,
  getUpdatedBankListService,
  saveUpdateBudgetService,
} from "../../services/budgetService";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import {
  alphaNumericUtil,
  convertIntoINRutil,
  IFSCutil,
  prevDateUtil,
} from "../../utils/validationUtils";
import InputField from "../../components/common/InputField";

const BudgetDetails = () => {
  const [rows, setRows] = useState([
    {
      budgetId: null,
      budgetCreationDate: "",
      amount: "",
      bankName: "",
      bankAccConfigId: "",
      giaTypeId: "",
    },
  ]);
  const [finyearId, setFinyearId] = useState("");

  const [finyearOption, setFinyearOptions] = useState([]);
  const getFinYear = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getFinancialYearService(payload);
      // console.log(res);
      setFinyearOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  const [tableData, setTableData] = useState([]);
  const getTableDataByYear = async () => {
    try {
      const payload = encryptPayload({
        finyearId: finyearId,
        isActive: true,
      });
      const res = await getBudgetByFinancialYearService(payload);
      // console.log(res?.data.data);
      if (res?.status === 200 && res?.data.outcome) {
        setTableData(res?.data.data);
      }
    } catch (error) {
      throw error;
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
      const res = await getUpdatedBankListService();
      // console.log(res);
      setBankOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  const [configOpts, setConfigOpts] = useState({});
  const getAllConfigOpts = async (rowIndex, id) => {
    try {
      const payload = encryptPayload({ bankId: Number(id) });
      const res = await getBankConfigByBankIdService(payload);
      console.log(res);

      if (res?.status === 200 && res?.data?.outcome) {
        const data = res.data.data;

        const options = Array.isArray(data)
          ? data.map(formatConfigOption)
          : [formatConfigOption(data)];

        setConfigOpts((prev) => ({
          ...prev,
          [rowIndex]: options,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatConfigOption = (item) => ({
    value: item.bankAccConfigId,
    label: `${item.branch} | ${item.accNo} | ${item.ifsc}`,
  });

  // Prevent duplicated GIA type across rows
  const usedGiaTypes = rows.map((r) => r.giaTypeId);
  const filteredGiaOptions = (currentGia) =>
    giaOpts.filter(
      (opt) => opt.value === currentGia || !usedGiaTypes.includes(opt.value)
    );

  const isRowValid = (row) => {
    return (
      row.giaTypeId &&
      row.amount &&
      row.budgetCreationDate &&
      row.bankName &&
      row.bankAccConfigId
    );
  };

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];

    if (!isRowValid(lastRow)) {
      toast.error(
        "Please fill all fields in the current row before adding a new one."
      );
      return;
    }
    setRows([
      ...rows,
      {
        giaTypeId: "",
        amount: "",
        budgetCreationDate: "",
        bankName: "",
        bankAccConfigId: "",
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

    if (name === "bankName") {
      getAllConfigOpts(index, value);
    }
   
  };
  

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!finyearId) {
      toast.error("Financial Year is required")
      newErrors.finyearId = "Financial Year is required";
      setErrors(newErrors);
      return;
    }
    const incompleteRow = rows.find((row) => !isRowValid(row));

    if (incompleteRow) {
      toast.error(
        "Please fill all fields in the budget table before submitting."
      );
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      const sendData = {
        finYear: {
          finyearId: finyearId,
        },
        budgetDetails: rows.map((item) => ({
          budgetId: item.budgetId ?? null,
          budgetCreationDate: formatDateToDDMMYYYY(item.budgetCreationDate),
          amount: Number(item.amount),
          bankConfig: {
            bankAccConfigId: item.bankAccConfigId,
          },
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
          getTableDataByYear();
          setRows([
            {
              budgetId: null,
              budgetCreationDate: "",
              amount: "",
              bankName: "",
              bankAccConfigId: "",
              giaTypeId: "",
            },
          ]);
        }
      } catch (error) {
        throw error;
      }
    }
  };

  useEffect(() => {
    getFinYear();
    getGIAOptions();
    getAllBankOptions();
  }, []);

  useEffect(() => {
    if (finyearId) {
      getTableDataByYear();
    }
  }, [finyearId]);

  return (
    <>
      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="p-0">
          <h3
            className="flex items-center gap-2 text-white font-normal text-[18px]
                border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-sm"
          >
            <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
            Add Budget
          </h3>
        </div>

        {/* Financial Year */}
        <form onSubmit={handleSubmit}>
          <div className="min-h-[120px] py-5 px-4 text-[#444]">
            <div className="grid grid-cols-12">
              <div className="col-span-2">
                <SelectField
                  label="Financial Year"
                  required={true}
                  name="finyearId"
                  placeholder="Select"
                  value={finyearId}
                  options={finyearOption?.map((d) => ({
                    value: d.finyearId,
                    label: d.finYear,
                  }))}
                  onChange={(e) => setFinyearId(Number(e.target.value))}
                  // error={errors.finyearId}
                />
              </div>
            </div>

            {/* TABLE START */}
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
                    Bank Name
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Account Information
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Amount
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Budget Date
                  </td>
                  {/* <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Branch
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    Account Number
                  </td>
                  <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                    IFSC Code
                  </td> */}
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
                        placeholder="Select"
                      />
                    </td>

                    {/* Amount */}
                    

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
                        placeholder="Select"
                      />
                    </td>
                    <td className="border-r border-slate-200 px-2 py-1">
                      <SelectField
                        name="bankAccConfigId"
                        value={row.bankAccConfigId}
                        onChange={(e) =>
                          handleInput(index, "bankAccConfigId", e.target.value)
                        }
                        options={configOpts[index] || []}
                        placeholder="Select"
                      />
                    </td>

                    {/* <td className="border-r border-slate-200 px-2 py-1">
                      <input
                        type="number"
                        maxLength={17}
                        value={row.branch}
                        onChange={(e) =>
                          handleInput(index, "branch", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                      />
                    </td>

                    <td className="border-r border-slate-200 px-2 py-1">
                      <input
                        type="text"
                        value={row.accNo}
                        minLength={9}
                        maxLength={18}
                        onChange={(e) =>
                          handleInput(index, "accNo", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                      />
                    </td>

                    <td className="border-r border-slate-200 px-2 py-1">
                      <input
                        type="text"
                        value={IFSCutil(row.ifsc)}
                        maxLength={11}
                        onChange={(e) => {
                          const cleaned = alphaNumericUtil(
                            e.target.value.toUpperCase()
                          );
                          handleInput(index, "ifsc", cleaned);
                        }}
                        className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                      />
                    </td> */}
                    <td className="border-r border-slate-200 px-2 py-1">
                      <InputField
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
                        min={prevDateUtil()}
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
          </div>

          <div className="col-span-12 flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            <SubmitBtn />
          </div>
        </form>
      </div>
      <div
        className="
        mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1]
        shadow-[0_4px_12px_rgba(0,0,0,0.08)]
      "
      >
        {/* Header */}
        <div className="p-0">
          <h3
            className="
            flex items-center gap-2 text-white font-normal text-[18px]
            border-b-2 border-[#ff9800] px-3 py-2
            bg-light-dark rounded-t-md
          "
          >
            <FiFileText
              className="
              text-[#fff2e7] text-[24px] p-1
              bg-[#ff7900] rounded
            "
            />
            Budget List
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          {/* <ReusableDataTable data={tableData} columns={budgetColumn} /> */}
          <table
            className="table-fixed w-full  mt-5"
            style={{ border: "1px solid #ebbea6" }}
          >
            <thead className="bg-[#f4f0f2]">
              <tr>
                <th className="w-[60px] text-[14px] py-3 px-2 text-center border border-[#ebbea6] p-2">
                  SL No
                </th>
                <th className="w-[250px] border text-[14px] py-3 px-2 text-start border-[#ebbea6] p-2">
                  GIA Type Name
                </th>
                <th className="border text-[14px] py-3 px-2 text-start border-[#ebbea6] p-2">
                  Amount (₹)
                </th>
                <th className="border text-[14px] py-3 px-2 text-start border-[#ebbea6] p-2">
                  Date of Creation
                </th>
                <th className="w-[380px] border text-[14px] py-3 px-2 text-start border-[#ebbea6]">
      Account Information
    </th>
              </tr>
            </thead>

            <tbody>
              {Object.values(
                tableData.reduce((acc, row) => {
                  const key = row.giaType.giaTypeId;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(row);
                  return acc;
                }, {})
              ).map((group, idx) => {
                const rowSpan = group.length;
                const first = group[0];

                return group.map((row, i) => (
                  <tr key={row.budgetId} className="border-b">
                    {/* SL NO (only for first row of group) */}
                    {i === 0 && (
                      <td
                        rowSpan={rowSpan}
                        className="border border-[#ebbea6] text-center align-top px-2 py-1 text-sm "
                      >
                        {idx + 1}
                      </td>
                    )}

                    {/* GIA TYPE (only first row of group) */}
                    {i === 0 && (
                      <td
                        rowSpan={rowSpan}
                        className="border border-[#ebbea6] text-left px-2 py-1 text-sm "
                      >
                        <div className="flex gap-1">
                          <span>{first.giaType.giaTypeName}</span> |{" "}
                          <span>{first.giaType.giaTypeCode}</span>
                        </div>
                      </td>
                    )}

                    {/* AMOUNT */}
                    <td className="border border-[#ebbea6] px-2 py-1 text-sm text-end">
                      {" "}
                      {convertIntoINRutil(row.amount)}
                    </td>

                    {/* DATE */}
                    <td className="border border-[#ebbea6] px-2 py-1 text-sm">
                      {row.budgetCreationDate}
                    </td>

                    {/* IFSC */}
                    <td className="border border-[#ebbea6] px-2 py-1 text-sm">
                      {row.bankName?.bankName} | {row.bankConfig?.accNo} | {row.bankConfig?.ifsc} 
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BudgetDetails;
