import React, { useEffect, useState } from "react";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { FiFileText } from "react-icons/fi";
import SelectField from "../../components/common/SelectField";
import { encryptPayload } from "../../crypto.js/encryption";
import {
  getBudgetByProjectService,
  getMilestoneService,
  getProjectByFinYearService,
  getProjectListService,
  getProjectMapByProjectIdService,
  projectAlllookUpValueService,
  saveProjectAgencyMilestoneService,
} from "../../services/projectService";
import { MdOutlineAddCircle } from "react-icons/md";
import { getAgencyDetailsService } from "../../services/agencyService";
import { FaMinusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getVendorDataService } from "../../services/vendorService";
import InputField from "../../components/common/InputField";
import { IoMdAddCircle } from "react-icons/io";
import { getFinancialYearService } from "../../services/budgetService";
import { formatWithCommas, removeCommas } from "../../utils/validationUtils";

const ProjectAgencyMilestone = () => {
  const userSelection = useSelector((state) => state?.menu.userDetails);
  // console.log(userSelection);

  const [formData, setFormData] = useState({
    projectId: "",
    finYear: "",
  });

  const formatToYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    getFinancialYearService;
    return `${year}-${month}-${day}`;
  };

  const [getFinancialYearOpts, setFinancialYearOpts] = useState([]);

  const getAllFinYearOpts = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getFinancialYearService(payload);
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setFinancialYearOpts(res?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const [milestoneOpts, setMilestoneOpts] = useState([]);
  const [budgetAmount, setBudgetAmount] = useState("");

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "projectId") {
      try {
        const payload = encryptPayload({
          projectId: value,
          isActive: true,
        });
        const payload2 = encryptPayload({
          projectId: value,
          isActive: true,
        });
        const payload3 = encryptPayload({
          projectId: value,
          isActive: true,
        });
        const res = await getMilestoneService(payload);
        const res2 = await getBudgetByProjectService(payload2);
        const res3 = await getProjectMapByProjectIdService(payload3);
        console.log(res3);
        setMilestoneOpts(res?.data.data);
        setBudgetAmount(res2?.data.data);
        // const mappedRows = res3?.data?.data?.map((row) => ({
        //   ...row,
        //   startDate: formatToYYYYMMDD(row.startDate),
        //   endDate: formatToYYYYMMDD(row.endDate),
        //   actualStartDate: formatToYYYYMMDD(row.actualStartDate),
        //   actualEndDate: formatToYYYYMMDD(row.actualEndDate),
        // }));
        if (res3?.data.outcome || res3?.status === 200) {
          setFlag(res?.data.outcome)
        }
        const mappedRows = Array.isArray(res3?.data?.data)
          ? res3.data.data.map((row) => ({
            ...row,
            startDate: formatToYYYYMMDD(row.startDate),
            endDate: formatToYYYYMMDD(row.endDate),
            actualStartDate: formatToYYYYMMDD(row.actualStartDate),
            actualEndDate: formatToYYYYMMDD(row.actualEndDate),
          }))
          : [
            {
              projectAgencyMilestoneMapId: null,
              agencyId: "",
              milestoneId: "",
              vendorId: "",
              order: "",
              budgetPercentage: "",
              amount: "",
              milestoneStatus: "",
              startDate: "",
              endDate: "",
              actualStartDate: "",
              actualEndDate: "",
            },
          ];

        setRows(mappedRows);
      } catch (error) {
        throw error;
      }
    }
  };
  const formatToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const [rows, setRows] = useState([
    {
      projectAgencyMilestoneMapId: null,
      agencyId: "",
      milestoneId: "",
      vendorId: "",
      order: "",
      budgetPercentage: "",
      amount: "",
      milestoneStatus: "",
      startDate: "",
      endDate: "",
      actualStartDate: "",
      actualEndDate: "",
    },
  ]);
  const handleInput = (index, name, value) => {
    const updated = [...rows];

    if (name === "order") {

      if (value === "") {
        updated[index].order = "";
        setRows(updated);
        return;
      }

      if (!/^\d+$/.test(value)) {
        return;
      }

      const newOrder = Number(value);

      if (newOrder < 0) return;

      const isOrderDuplicate = rows.some(
        (row, idx) => idx !== index && Number(row.order) === newOrder
      );

      if (isOrderDuplicate) {
        toast.error(
          "This order number is already used. Please enter a unique number."
        );
        return;
      }

      updated[index].order = newOrder;
      setRows(updated);
      return;
    }

    const newAgencyId = Number(
      name === "agencyId" ? value : updated[index].agencyId
    );
    const newMilestoneId = Number(
      name === "milestoneId" ? value : updated[index].milestoneId
    );

    if (newAgencyId && newMilestoneId) {
      const isDuplicateCombo = rows.some(
        (row, idx) =>
          idx !== index &&
          // Number(row.agencyId) === newAgencyId &&
          Number(row.milestoneId) === newMilestoneId
      );

      if (isDuplicateCombo) {
        toast.error("Milestone alread exists!");
        return;
      }
    }

    if (name === "budgetPercentage") {
      if (value === "") {
        updated[index].budgetPercentage = "";
        updated[index].amount = "";
        setRows(updated);
        return;
      }

      if (!/^\d+(\.\d+)?$/.test(value)) {
        return;
      }

      const percent = parseFloat(value);

      if (percent < 0) return;

      if (percent > 100) {
        toast.error("Percentage cannot exceed 100%");
        return;
      }

      // const totalPercentExceptCurrent = rows.reduce((sum, row, idx) => {
      //   if (idx === index) return sum;
      //   return sum + (parseFloat(row.budgetPercentage) || 0);
      // }, 0);

      // if (totalPercentExceptCurrent + percent > 100) {
      //   toast.error("Total budget percentage cannot exceed 100%");
      //   return;
      // }

      const usedAmountExceptCurrent = rows.reduce((sum, row, idx) => {
        if (idx === index) return sum;
        return sum + (parseFloat(row.amount) || 0);
      }, 0);

      const remainingBeforeCurrent = budgetAmount - usedAmountExceptCurrent;

      const calculatedAmount = (
        (remainingBeforeCurrent * percent) /
        100
      ).toFixed(2);

      updated[index].budgetPercentage = percent;
      updated[index].amount = calculatedAmount;

      setRows(updated);
      return;
    }
    if (name === "amount") {
      if (value === "") {
        updated[index].amount = "";
        updated[index].budgetPercentage = "";
        setRows(updated);
        return;
      }

      if (!/^\d+(\.\d+)?$/.test(value)) return;

      const enteredAmount = parseFloat(value);
      if (enteredAmount < 0) return;

      const usedAmountExceptCurrent = rows.reduce((sum, row, idx) => {
        if (idx === index) return sum;
        return sum + (parseFloat(row.amount) || '');
      }, 0);

      const remainingBeforeCurrent = budgetAmount - usedAmountExceptCurrent;

      if (enteredAmount > remainingBeforeCurrent) {
        toast.error("Amount exceeds remaining budget");
        return;
      }

      const calculatedPercent = (
        (enteredAmount / remainingBeforeCurrent) *
        100
      ).toFixed(2);

      if (calculatedPercent > 100) {
        toast.error("Percentage cannot exceed 100%");
        return;
      }

      updated[index].amount = enteredAmount;
      updated[index].budgetPercentage = calculatedPercent;

      setRows(updated);
      return;
    }


    updated[index][name] = value;
    setRows(updated);
  };

  const totalActualAmount = rows.reduce(
    (sum, row) => sum + (parseFloat(row.amount) || ''),
    0
  );

  const remainingBudget = (budgetAmount - totalActualAmount).toFixed(2);

  const handleAddRow = () => {
    const totalPercent = rows.reduce(
      (sum, row) => sum + (parseFloat(row.budgetPercentage) || ''),
      0
    );

    if (totalPercent >= 100) {
      toast.error(
        "You cannot add more rows because 100% budget is already allocated."
      );
      return;
    }

    const hasEmptyCombo = rows.some((row) => !row.agencyId || !row.milestoneId);
    if (hasEmptyCombo) {
      toast.error("Please fill the existing row before adding a new one.");
      return;
    }

    setRows([
      ...rows,
      {
        projectAgencyMilestoneMapId: null,
        agencyId: "",
        milestoneId: "",
        vendorId: "",
        order: "",
        budgetPercentage: "",
        amount: "",
        milestoneStatus: "",
        startDate: "",
        endDate: "",
        actualStartDate: "",
        actualEndDate: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };
  const [flag, setFlag] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAdmin = userSelection.roleCode === "ROLE_WODC_ADMIN";

    const transformedRows = rows.map((row) => ({
      ...row,
      startDate: formatToDDMMYYYY(row.startDate),
      endDate: formatToDDMMYYYY(row.endDate),

      actualStartDate: isAdmin ? null : formatToDDMMYYYY(row.actualStartDate),
      actualEndDate: isAdmin ? null : formatToDDMMYYYY(row.actualEndDate),
      vendorId: isAdmin ? null : row.vendorId,
      milestoneStatus: isAdmin ? row.milestoneStatus : row.milestoneStatus,
    }));

    const sendData = {
      projectId: formData.projectId,
      items: transformedRows,
    };

    try {
      const payload = encryptPayload(sendData);
      const res = await saveProjectAgencyMilestoneService(payload);
      console.log(res);

      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
      } else {
        toast.error(res?.data.message);
      }

      setFormData({ projectId: "" });
      setRows([
        {
          projectAgencyMilestoneMapId: null,
          agencyId: "",
          milestoneId: "",
          vendorId: "",
          order: "",
          budgetPercentage: "",
          amount: "",
          startDate: "",
          endDate: "",
          actualStartDate: "",
          actualEndDate: "",
        },
      ]);
    } catch (error) {
      throw error;
    }
  };

  const [projectOpts, setProjectOpts] = useState([]);
  const [agencyopts, setAgencyOpts] = useState([]);
  const [vendorOpts, setVendorOpts] = useState([]);
  const [statusOpts, setStatusOpts] = useState([]);

  const getAllProjectOpts = async () => {
    try {
      const payload = encryptPayload({
        isActive: true,
        finyearId: parseInt(formData.finYear),
      });
      if (formData.finYear) {
        const res = await getProjectByFinYearService(payload);
        // console.log(res);
        if (res?.status === 200 && res?.data.outcome) {
          setProjectOpts(res?.data.data);
        }
      }
    } catch (error) {
      throw error;
    }
  };
  const getAllAgencyList = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getAgencyDetailsService(payload);
      // console.log(res);
      setAgencyOpts(res?.data.data);
    } catch (error) {
      throw error;
    }
  };
  const getAllVendorList = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getVendorDataService(payload);
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setVendorOpts(res?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };
  const getAllStatusOptions = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await projectAlllookUpValueService(payload);
      // console.log(res?.data.data.milestioneStatusList);
      setStatusOpts(res?.data.data.milestioneStatusList);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    getAllFinYearOpts();
    getAllAgencyList();
    getAllVendorList();
    getAllStatusOptions();
  }, []);
  useEffect(() => {
    if (formData.finYear) {
      setProjectOpts([]);
      setFormData((prev) => ({
        ...prev,
        projectId: "",
      }));

      getAllProjectOpts();
    } else {
      // finYear cleared
      setProjectOpts([]);
      setFormData((prev) => ({
        ...prev,
        projectId: "",
      }));
    }
  }, [formData.finYear]);
  useEffect(() => {
    if (!budgetAmount) return;

    setRows((prev) =>
      prev.map((row) => {
        const percent = parseFloat(row.budgetPercentage) || 0;
        return {
          ...row,
          amount: ((budgetAmount * percent) / 100).toFixed(2),
        };
      })
    );
  }, [budgetAmount]);
  return (
    <form onSubmit={handleSubmit}>
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
            Project Agency Milestone
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <SelectField
                label="Financial Year"
                required={true}
                name="finYear"
                value={formData.finYear}
                onChange={handleInputChange}
                placeholder="Select"
                options={getFinancialYearOpts?.map((i) => ({
                  value: i.finyearId,
                  label: i.finYear,
                }))}
              />
            </div>
            <div className="col-span-2">
              <SelectField
                label="Project"
                required={true}
                disabled={formData.finYear ? false : true}
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                placeholder="Select"
                options={projectOpts?.map((i) => ({
                  label: i.projectName,
                  value: i.projectId,
                }))}
              />
            </div>
            {formData.projectId && flag &&(
              <>
                <div className="col-span-12">
                  {rows.map((i, index) => {
                    return (
                      <div
                        className="grid grid-cols-12 gap-6 p-3 rounded-sm mt-10 border border-orange-200 bg-[#fffcfc] relative"
                        key={index}
                      >
                        {(rows.length > 1 ||
                          userSelection.roleCode === "ROLE_WODC_ADMIN") && (
                            <span
                              className="absolute text-xl  p-2 text-red-500 flex justify-center items-center rounded-full"
                              style={{ top: "-17px", right: "-14px" }}
                              onClick={() => handleRemoveRow(index)}
                            >
                              <FaMinusCircle />
                            </span>
                          )}
                        <div className="col-span-2">
                          <SelectField
                            label={"Agency Name"}
                            required={
                              userSelection.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL"
                                ? false
                                : true
                            }
                            name="agencyId"
                            value={i.agencyId}
                            onChange={(e) =>
                              handleInput(index, "agencyId", e.target.value)
                            }
                            options={agencyopts?.map((d) => ({
                              value: d.agencyId,
                              label: d.agencyName,
                            }))}
                            placeholder="Select"
                            disabled={
                              userSelection.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL"
                                ? true
                                : false
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <SelectField
                            label={"Milestone"}
                            name="milestoneId"
                            value={i.milestoneId}
                            required={
                              userSelection.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL"
                                ? false
                                : true
                            }
                            onChange={(e) =>
                              handleInput(index, "milestoneId", e.target.value)
                            }
                            options={milestoneOpts?.map((d) => ({
                              value: d.milestoneId,
                              label: d.milestoneName,
                            }))}
                            placeholder="Select"
                            disabled={
                              userSelection.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL"
                                ? true
                                : false
                            }
                          />
                        </div>

                        <div className="col-span-2">
                          <InputField
                            label={"Order"}
                            name="order"
                            required={
                              userSelection.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL"
                                ? false
                                : true
                            }
                            value={i.order}
                            onChange={(e) =>
                              handleInput(index, "order", e.target.value)
                            }
                            disabled={
                              userSelection.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL"
                                ? true
                                : false
                            }
                          // type="number"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[13px] font-medium text-gray-700">
                            Start Date {userSelection?.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL" ? '' : <span className="text-red-500">*</span>}
                          </label>
                          <input
                            name="startDate"
                            value={i.startDate}
                            onChange={(e) =>
                              handleInput(index, "startDate", e.target.value)
                            }

                            disabled={userSelection?.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL" ? true : false}
                            type="date"
                            className={`
                                  w-full rounded-md border border-gray-300 
                                  px-2.5 py-1.5 text-sm
                                  outline-none transition-all duration-200
                                  placeholder:text-gray-400
                                  ${userSelection.roleCode === "ROLE_AGENCY"
                                ? "bg-gray-100 cursor-not-allowed"
                                : "focus:border-blue-200 focus:ring-2 focus:ring-blue-200"
                              }
                                `}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[13px] font-medium text-gray-700">
                            End Date {userSelection?.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL" ? '' : <span className="text-red-500">*</span>}
                          </label>
                          <input
                            name="endDate"
                            value={i.endDate}
                            min={i.startDate}
                            disabled={userSelection?.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL" ? true : false}
                            onChange={(e) =>
                              handleInput(index, "endDate", e.target.value)
                            }
                            type="date"
                            className={`
                                  w-full rounded-md border border-gray-300 
                                  px-2.5 py-1.5 text-sm
                                  outline-none transition-all duration-200
                                  placeholder:text-gray-400
                                  ${userSelection.roleCode === "ROLE_AGENCY"
                                ? "bg-gray-100 cursor-not-allowed"
                                : "focus:border-blue-200 focus:ring-2 focus:ring-blue-200"
                              }
                                `}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[13px] font-medium text-gray-700">
                            Actual Start Date {userSelection?.roleCode === "ROLE_WODC_ADMIN" || i.milestoneStatus === "CMPL" ? '' : <span className="text-red-500">*</span>}
                          </label>
                          <input
                            name="actualStartDate"
                            value={i.actualStartDate}
                            onChange={(e) =>
                              handleInput(
                                index,
                                "actualStartDate",
                                e.target.value
                              )
                            }
                            min={i.startDate}
                            disabled={userSelection.roleCode === "ROLE_WODC_ADMIN" || i.milestoneStatus === "CMPL" ? true : false}
                            type="date"
                            className={`
                                  w-full rounded-md border border-gray-300 
                                  px-2.5 py-1.5 text-sm
                                  outline-none transition-all duration-200
                                  placeholder:text-gray-400
                                  ${userSelection.roleCode === "ROLE_WODC_ADMIN"
                                ? "bg-gray-100 cursor-not-allowed"
                                : "focus:border-blue-200 focus:ring-2 focus:ring-blue-200"
                              }
                                `}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[13px] font-medium text-gray-700">
                            Actual End Date {userSelection?.roleCode === "ROLE_WODC_ADMIN" || i.milestoneStatus === "CMPL" ? '' : <span className="text-red-500">*</span>}
                          </label>
                          <input
                            name="actualEndDate"
                            value={i.actualEndDate}
                            min={i.actualStartDate}
                            disabled={userSelection.roleCode === "ROLE_WODC_ADMIN" || i.milestoneStatus === "CMPL" ? true : false}

                            onChange={(e) =>
                              handleInput(
                                index,
                                "actualEndDate",
                                e.target.value
                              )
                            }
                            type="date"
                            className={`
                                  w-full rounded-md border border-gray-300 
                                  px-2.5 py-1.5 text-sm
                                  outline-none transition-all duration-200
                                  placeholder:text-gray-400
                                  ${userSelection.roleCode === "ROLE_WODC_ADMIN"
                                ? "bg-gray-100 cursor-not-allowed"
                                : "focus:border-blue-200 focus:ring-2 focus:ring-blue-200"
                              }
                                `}
                          />
                        </div>
                        <div className="col-span-2">
                          <InputField
                            label={"Budget (%)"}
                            required={true}
                            // type="number"
                            name="budgetPercentage"
                            value={i.budgetPercentage}
                            onChange={(e) =>
                              handleInput(
                                index,
                                "budgetPercentage",
                                e.target.value
                              )
                            }
                            disabled={
                              userSelection.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL"
                                ? true
                                : false
                            }
                            max={100}
                          />
                        </div>
                        <div className="col-span-2">
                          <InputField
                            label={"Amount"}
                            type="text"
                            name="amount"
                            amount={true}
                            value={formatWithCommas(i.amount)}
                            max={budgetAmount}
                            // onChange={(e) =>
                            //   handleInput(index, "amount", e.target.value)
                            // }
                            onChange={(e) => {
                              const rawValue = removeCommas(e.target.value);
                              if (/^\d*$/.test(rawValue)) {
                                handleInput(index, "amount", rawValue);
                              }
                            }}
                            required={
                              userSelection.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL"
                                ? false
                                : true
                            }
                            disabled={
                              userSelection.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL"
                                ? true
                                : false
                            }
                          // disabled={true}
                          />
                        </div>
                        <div className="col-span-2">
                          <SelectField
                            name="vendorId"
                            label={"Vendor Name"}
                            value={i.vendorId}
                            onChange={(e) =>
                              handleInput(index, "vendorId", e.target.value)
                            }
                            required={
                              userSelection.roleCode === "ROLE_WODC_ADMIN" || i.milestoneStatus === "CMPL"
                                ? false
                                : true
                            }
                            disabled={
                              userSelection.roleCode === "ROLE_WODC_ADMIN" || i.milestoneStatus === "CMPL"
                                ? true
                                : false
                            }
                            options={vendorOpts?.map((d) => ({
                              value: d.vendorId,
                              label: d.vendorName,
                            }))}
                            placeholder="Select"
                            disb
                          />
                        </div>
                        <div className="col-span-2">
                          <SelectField
                            label={"Status"}
                            name="milestoneStatus"
                            value={i.milestoneStatus}
                            onChange={(e) =>
                              handleInput(
                                index,
                                "milestoneStatus",
                                e.target.value
                              )
                            }
                            options={statusOpts?.map((d) => ({
                              value: d.lookupValueCode,
                              label: d.lookupValueEn,
                            }))}
                            required={
                              // userSelection.roleCode === "ROLE_WODC_ADMIN" || i.milestoneStatus === "CMPL"
                              userSelection.roleCode === "ROLE_WODC_ADMIN"

                                ? false
                                : true
                            }
                            disabled={
                              // userSelection.roleCode === "ROLE_WODC_ADMIN" || i.milestoneStatus === "CMPL"
                              userSelection.roleCode === "ROLE_WODC_ADMIN"

                                ? true
                                : false
                            }
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    );
                  })}
                  {userSelection.roleCode === "ROLE_WODC_ADMIN" && (
                    <div className="flex justify-end mt-3">
                      <button
                        className="p-1 rounded-sm text-white bg-green-600 text-md"
                        type="button"
                        onClick={handleAddRow}
                        title="Add Fund Release Informations"
                      >
                        <IoMdAddCircle />
                      </button>
                    </div>
                  )}
                </div>

                <div className="col-span-12 bg-white border border-slate-200 rounded-xl p-6 mt-6 shadow-sm">
                  <div className="grid grid-cols-12 divide-x divide-slate-200">
                    {/* Max Budget */}
                    <div className="col-span-4 flex flex-col items-center px-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Max Budget
                      </p>
                      <p className="text-2xl font-bold text-red-600 mt-1">
                        ₹{budgetAmount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Allocated */}
                    <div className="col-span-4 flex flex-col items-center px-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Allocated
                      </p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">
                        ₹{totalActualAmount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Remaining */}
                    <div className="col-span-4 flex flex-col items-center px-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Remaining
                      </p>
                      <p className="text-2xl font-bold text-green-700 mt-1">
                        ₹{Number(remainingBudget).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer (Optional) */}
        <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          <SubmitBtn />
        </div>
      </div>
    </form>
  );
};

export default ProjectAgencyMilestone;
