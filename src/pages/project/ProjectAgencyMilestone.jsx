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
import { forwardListByMenuService } from "../../services/workflowService";
import { useLocation } from "react-router-dom";
import Magnifier from "../../components/common/Magnifier";

const ProjectAgencyMilestone = () => {
  const userSelection = useSelector((state) => state?.menu.userDetails);
  // console.log(userSelection);

  const [formData, setFormData] = useState({
    projectId: "",
    finYear: "",
  });

  const [button, setButtons] = useState([])


  const location = useLocation()
  // console.log(location.pathname);

  const getWorkFlow = async () => {
    try {
      const payload = encryptPayload({ appModuleUrl: location.pathname })
      const res = await forwardListByMenuService(payload)
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setButtons(res?.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  const [projectStartDate, setProjectStartDate] = useState("");



  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "projectId") {
      try {
        const selectedProject = projectOpts.find(
          (p) => String(p.projectId) === String(value)
        );

        if (selectedProject?.startDate) {
          const formattedDate = formatToYYYYMMDD(selectedProject.startDate);
          setProjectStartDate(formattedDate);
        }
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
        // console.log(res3);
        setMilestoneOpts(res?.data.data);
        setBudgetAmount(res2?.data.data);

        if (res3?.status === 200 && res3?.data?.outcome) {
          setFlag(true);
        } else {
          setFlag(false);
        }
        const mappedRows = Array.isArray(res3?.data?.data)
          ? res3.data.data.map((row) => ({
            ...row,
            startDate: formatToYYYYMMDD(row.startDate),
            endDate: formatToYYYYMMDD(row.endDate),
            actualStartDate: formatToYYYYMMDD(row.actualStartDate),
            actualEndDate: formatToYYYYMMDD(row.actualEndDate),
            allGeoTagDocument: row?.allGeoTagDocument || []
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
              allGeoTagDocument: []
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
      allGeoTagDocument: []
    },
  ]);

  const getNextOrder = () => {
    if (!rows.length) return 1;

    const maxOrder = Math.max(
      ...rows.map((row) => Number(row.order) || 0)
    );

    return maxOrder + 1;
  };


  const handleInput = (index, name, value) => {
    const updated = [...rows];
    const currentRow = updated[index];

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
    if (name === "startDate") {
      if (projectStartDate && value < projectStartDate) {
        toast.error("Start Date must be equal to or after Project Start Date");
        return;
      }
    }

    if (name === "endDate") {
      if (currentRow.startDate && value < currentRow.startDate) {
        toast.error("End Date must be equal to or after Start Date");
        return;
      }
    }

    if (name === "actualStartDate") {
      if (currentRow.startDate && value < currentRow.startDate) {
        toast.error("Actual Start Date must be equal to or after Start Date");
        return;
      }
    }

    if (name === "actualEndDate") {
      if (currentRow.actualStartDate && value < currentRow.actualStartDate) {
        toast.error("Actual End Date must be equal to or after Actual Start Date");
        return;
      }
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
        order: getNextOrder(),
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

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const isCompletelyEmpty =
        !row.agencyId &&
        !row.milestoneId &&
        !row.order &&
        !row.budgetPercentage &&
        !row.amount;

      if (isCompletelyEmpty) {
        toast.error(`Row ${i + 1} is empty. Please fill or remove it.`);
        return;
      }

      if (!row.agencyId) {
        toast.error(`Please select Agency in row ${i + 1}`);
        return;
      }

      if (!row.milestoneId) {
        toast.error(`Please select Milestone in row ${i + 1}`);
        return;
      }

      if (!row.order) {
        toast.error(`Order is required in row ${i + 1}`);
        return;
      }

      if (!row.budgetPercentage || !row.amount) {
        toast.error(`Budget % and Amount are required in row ${i + 1}`);
        return;
      }

      if (!row.startDate || !row.endDate) {
        toast.error(`Start Date and End Date are required in row ${i + 1}`);
        return;
      }
    }

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
      setStatusOpts(res?.data.data.milestioneStatusList);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    getWorkFlow();
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
            {formData.projectId && flag && (
              <>
                <div className="col-span-12 mt-6">
                  <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 bg-[#fffcfc]  border-b border-[#ebbea6] ">
                      <h3 className="text-md font-semibold text-slate-700 tracking-wide">
                        Budget Overview
                      </h3>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">

                      {/* Max Budget */}
                      <div className="flex items-center gap-4 px-6 py-6">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                          ₹
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                            Max Budget
                          </p>
                          <p className="text-2xl font-bold text-slate-800">
                            ₹{budgetAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Allocated */}
                      <div className="flex items-center gap-4 px-6 py-6">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
                          ₹
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                            Allocated
                          </p>
                          <p className="text-2xl font-bold text-slate-800">
                            ₹{totalActualAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Remaining */}
                      <div className="flex items-center gap-4 px-6 py-6">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-700">
                          ₹
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                            Remaining
                          </p>
                          <p className="text-2xl font-bold text-slate-800">
                            ₹{Number(remainingBudget).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

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
                            // disabled={
                            //   userSelection.roleCode === "ROLE_AGENCY" || i.milestoneStatus === "CMPL"
                            //     ? true
                            //     : false
                            // }
                            disabled={true}
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
                            min={i.actualStartDate && projectStartDate}
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
                            options={statusOpts
                              ?.filter((status) => {
                                if (
                                  (!i.allGeoTagDocument || i.allGeoTagDocument.length === 0) &&
                                  status.lookupValueCode === "CMPL"
                                ) {
                                  return false;
                                }
                                return true;
                              })
                              .map((d) => ({
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
                        <div className="col-span-12">
                          <div className="grid grid-cols-12 gap-6">
                            {
                              i.allGeoTagDocument.map((image, imgIdx) => {
                                return (
                                  <div className="col-span-2 max-h-40" key={imgIdx + 1}>
                                    <Magnifier src={`data:image/${image.documentName};base64,${image.documentBase64}`} />
                                  </div>
                                )
                              })
                            }
                          </div>
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


              </>
            )}
          </div>
        </div>

        {/* Footer (Optional) */}
        <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          <SubmitBtn />
          {/* {
            button?.map((i, index) => {
              return (
                <button
                  type={'submit'}
                  key={index}
                  className={i?.actionType.color}
                >
                  <GrSave /> {i?.actionType.actionNameEn}
                </button>
              )
            })
          } */}
        </div>
      </div>
    </form>
  );
};

export default ProjectAgencyMilestone;
