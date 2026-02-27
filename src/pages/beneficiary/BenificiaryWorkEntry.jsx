import React, { useEffect, useState } from "react";
import SelectField from "../../components/common/SelectField";
import { encryptPayload } from "../../crypto.js/encryption";
import { getFinancialYearService } from "../../services/budgetService";
import { toast } from "react-toastify";
import ReusableDialog from "../../components/common/ReusableDialog";
import { useLocation } from "react-router-dom";
import {
  forwardListByMenuService,
  getWorkflowTabService,
} from "../../services/workflowService";
import { GrSave } from "react-icons/gr";

import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import PillTabs from "../../components/common/Styletab";

import {
  getProjectByFinYearService,
  getMilestoneService,
} from "../../services/projectService";
import { FiFileText } from "react-icons/fi";
import {
  empTypeService,
  listofBenificiaryByEmpType,
  getListBenTrackService,
  getListMoneyService,
  saveBeneficiaryTrackingSerice,
  getListBenTrackDraftService,
} from "../../services/beneficiaryService";
import {
  SubmitBtn,
  ResetBackBtn,
  SearchBtn,
  SaveAsDraftBtn,
} from "../../components/common/CommonButtons";

const ReusableBeneficiaryTable = ({
  data,
  loading,
  type,
  selectedRows,
  selectAll,
  rowInputs,
  paymentRate,
  onRowSelect,
  onSelectAll,
  onRowChange,
  onSubmit,
  workflowButtons,
  onDelete,
  butons,
}) => {
  if (loading) {
    return <p className="mt-4">Loading entries...</p>;
  }

  if (!data.length) {
    return (
      <p className="mt-4 text-gray-500">
        No {type} entries found. Please select filters above.
      </p>
    );
  }

  const getRowId = (item) => {
    if (type === "pending") return item.beneficiaryId;
    return item.benTrackId || item.trackingId;
  };

  const isEditable = type === "pending" || type === "draft";

  return (
    <div className="relative border border-dashed border-blue-300 bg-[#f0f8ff] p-4 rounded-md">
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm bg-white rounded-lg overflow-hidden shadow-sm border-collapse">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-16 border-r border-slate-200">
                Sl
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-r border-slate-200">
                Beneficiary Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-r border-slate-200">
                Aadhar
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-r border-slate-200">
                Mobile No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-r border-slate-200">
                Days Worked
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-r border-slate-200">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-r border-slate-200">
                Remarks
              </th>
              {type === "complete" && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-r border-slate-200">
                  Employee Type
                </th>
              )}
              {(type === "pending" || type === "draft") && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-2">
                    <span>Select</span>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={onSelectAll}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((item, index) => {
              const rowId = getRowId(item);
              const isSelected = selectedRows[rowId];
              const rowData = rowInputs[rowId] || {};

              return (
                <tr
                  key={rowId || index}
                  className={`hover:bg-slate-50 transition-colors duration-150 ${
                    type === "pending" && isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium text-center border-r border-slate-200">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 border-r border-slate-200">
                    {item.beneficiaryName}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-mono border-r border-slate-200">
                    {item.aadhaarNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 border-r border-slate-200">
                    {item.contactNo}
                  </td>

                  <td className="px-4 py-3 text-sm border-r border-slate-200">
                    {isEditable ? (
                      <input
                        type="number"
                        className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        disabled={type === "pending" && !isSelected}
                        value={
                          type === "draft"
                            ? rowData.daysWork ?? item.workDays ?? ""
                            : rowData.daysWork ?? ""
                        }
                        onChange={(e) =>
                          onRowChange(rowId, "daysWork", e.target.value)
                        }
                      />
                    ) : (
                      <span className="font-medium text-slate-900">
                        {item.workDays}
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 text-sm border-r border-slate-200">
                    {isEditable ? (
                      <input
                        type="number"
                        className="w-24 px-2 py-1 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed text-right font-medium"
                        disabled={type === "pending" && !isSelected}
                        value={
                          type === "draft"
                            ? rowData.amount ?? item.totalAmount ?? ""
                            : rowData.amount ?? ""
                        }
                        onChange={(e) =>
                          onRowChange(rowId, "amount", e.target.value)
                        }
                      />
                    ) : (
                      <span className="font-semibold text-slate-900">
                        ₹{item.totalAmount}
                      </span>
                    )}
                  </td>

                  {/* Remarks */}
                  <td className="px-4 py-3 text-sm border-r border-slate-200">
                    {isEditable ? (
                      <input
                        type="text"
                        className="w-full px-2 py-1 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        disabled={type === "pending" && !isSelected}
                        value={
                          type === "draft"
                            ? rowData.remarks ?? item.remarks ?? ""
                            : rowData.remarks ?? ""
                        }
                        onChange={(e) =>
                          onRowChange(rowId, "remarks", e.target.value)
                        }
                      />
                    ) : (
                      <span className="text-slate-600">
                        {item.remarks || "-"}
                      </span>
                    )}
                  </td>

                  {/* Employee Type column for complete tab */}
                  {type === "complete" && (
                    <td className="px-4 py-3 text-sm border-r border-slate-200">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {item.lookupValueEn}
                      </span>
                    </td>
                  )}

                  {/* Checkbox for pending/draft */}
                  {(type === "pending" || type === "draft") && (
                    <td className="px-4 py-3 text-sm text-center">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => onRowSelect(rowId)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {(type === "pending" || type === "draft") && (
          <div className="flex justify-end p-4 gap-2">
            {workflowButtons?.map((btn, index) => (
              <button
                key={index}
                onClick={() => onSubmit(btn)}
                className={btn?.actionType?.color}
              >
                <GrSave /> {btn?.actionType?.actionNameEn}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BenificiaryWorkEntry = () => {
  /* -------------------- FORM STATE -------------------- */
  const [formData, setFormData] = useState({
    finYear: "",
    projectId: "",
    milestoneId: "",
    employeeType: "",
  });
  const [button, setButtons] = useState([]);
  const [value, setValue] = useState("");
  const [tabCode, setTabCode] = useState("");
  const location = useLocation();

  const { finYear, projectId, milestoneId, employeeType } = formData;
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  /* -------------------- DROPDOWNS -------------------- */
  const [finOpts, setFinOpts] = useState([]);
  const [projectOpts, setProjectOpts] = useState([]);
  const [milestoneOpts, setMilestoneOpts] = useState([]);
  const [empTypeOpts, setEmpTypeOpts] = useState([]);

  const [pendingList, setPendingList] = useState([]);
  const [draftList, setDraftList] = useState([]);
  const [completedList, setCompletedList] = useState([]);

  const [loadingPending, setLoadingPending] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);

  const [rowInputs, setRowInputs] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const [paymentRate, setPaymentRate] = useState(0);
  const [submitType, setSubmitType] = useState("submit");
  const [butons, setButons] = useState([]);

  /* -------------------- HANDLERS -------------------- */
  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "finYear") {
        updated.projectId = "";
        updated.milestoneId = "";
        updated.employeeType = "";
      }
      if (name === "projectId") {
        updated.milestoneId = "";
        updated.employeeType = "";
      }
      if (name === "milestoneId") {
        updated.employeeType = "";
      }
      return updated;
    });

    // Reset table-related states
    resetTableStates();
  };

  const resetTableStates = () => {
    setRowInputs({});
    setSelectedRows({});
    setSelectAll(false);
  };

  const handleRowChange = (id, field, value) => {
    setRowInputs((prev) => {
      const existing = prev[id] || {};
      let updated = { ...existing, [field]: value };

      if (field === "daysWork") {
        const days = Number(value || 0);
        updated.amount = days * Number(paymentRate || 0);
      }
      return { ...prev, [id]: updated };
    });
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = () => {
    const newVal = !selectAll;
    setSelectAll(newVal);

    const updated = {};
    let list = [];

    if (value === "pending") list = pendingList;
    else if (value === "draft") list = draftList;

    list.forEach((item) => {
      const id = value === "pending" ? item.beneficiaryId : item.benTrackId;
      updated[id] = newVal;
    });

    setSelectedRows(updated);
  };

  /* -------------------- DATA LOADING -------------------- */
  useEffect(() => {
    getFinancialYearService(encryptPayload({ isActive: true })).then((res) => {
      if (res?.data?.outcome) setFinOpts(res.data.data);
    });

    empTypeService(encryptPayload(null)).then((res) =>
      setEmpTypeOpts(res?.data?.data || [])
    );
  }, []);

  useEffect(() => {
    if (!finYear) return;
    getProjectByFinYearService(
      encryptPayload({ finyearId: Number(finYear), isActive: true })
    ).then((res) => setProjectOpts(res?.data?.data || []));
  }, [finYear]);

  useEffect(() => {
    if (!projectId) return;
    getMilestoneService(
      encryptPayload({ projectId: Number(projectId), isActive: true })
    ).then((res) => setMilestoneOpts(res?.data?.data || []));
  }, [projectId]);

  useEffect(() => {
    if (!employeeType) {
      setPaymentRate(0);
      return;
    }
    getListMoneyService().then((res) => {
      const list = res?.data?.data || [];
      list.forEach((i) => {
        if (Number(i?.benType) === Number(employeeType)) {
          setPaymentRate(i?.amount);
        }
      });
    });
  }, [employeeType]);

  // Load pending list
  const loadPendingList = async () => {
    if (!projectId || !milestoneId || !employeeType) {
      setPendingList([]);
      return;
    }

    setLoadingPending(true);
    try {
      const payload = encryptPayload({
        projectId: Number(projectId),
        milestoneId: Number(milestoneId),
        employeeTypeLookUpId: Number(employeeType),
      });

      const res = await listofBenificiaryByEmpType(payload);
      if (res?.data?.outcome) {
        setPendingList(res?.data?.data || []);
      } else {
        setPendingList([]); // ← MUST clear old data
      }
    } catch (error) {
      toast.error("Failed to load pending entries");
    } finally {
      setLoadingPending(false);
    }
  };

  // Load draft list
  const loadDraftList = async () => {
    if (!projectId || !milestoneId || !employeeType) {
      setDraftList([]);
      return;
    }

    setLoadingDraft(true);
    try {
      const payload = encryptPayload({
        projectId: Number(projectId),
        milestoneId: Number(milestoneId),
        employeeTypeLookUpId: Number(employeeType),
        status: 2,
      });

      const res = await getListBenTrackDraftService(payload);
      if (res?.data?.outcome) {
        setDraftList(res?.data?.data || []);
      } else {
        setDraftList([]); // VERY IMPORTANT
      }
    } catch (error) {
      toast.error("Failed to load draft entries");
    } finally {
      setLoadingDraft(false);
    }
  };

  // Load completed list
  const loadCompletedList = async () => {
    if (!projectId || !milestoneId || !employeeType) {
      setCompletedList([]);
      return;
    }

    setLoadingCompleted(true);
    try {
      const payload = encryptPayload({
        projectId: Number(projectId),
        milestoneId: Number(milestoneId),
        employeeTypeLookUpId: Number(employeeType),
        status: 3,
      });

      const res = await getListBenTrackService(payload);
      if (res?.data?.outcome) {
        setCompletedList(res?.data?.data || []);
      } else {
        setCompletedList([]);
      }
    } catch (error) {
      toast.error("Failed to load completed list");
    } finally {
      setLoadingCompleted(false);
    }
  };

  // Load data based on active tab
  // useEffect(() => {
  //   if (!projectId || !milestoneId || !employeeType) return;

  //   resetTableStates();

  //   if (value === "pending") {
  //     loadPendingList();
  //   } else if (value === "draft") {
  //     loadDraftList();
  //   } else if (value === "final_submit") {
  //     loadCompletedList();
  //   }
  // }, [value, projectId, milestoneId, employeeType]);
  useEffect(() => {
    // If any required filter is missing → CLEAR LISTS
    if (!projectId || !milestoneId || !employeeType) {
      setPendingList([]);
      setDraftList([]);
      setCompletedList([]);
      resetTableStates();
      return;
    }
  
    resetTableStates();
  
    if (value === "pending") {
      loadPendingList();
    } else if (value === "draft") {
      loadDraftList();
    } else if (value === "final_submit") {
      loadCompletedList();
    }
  }, [value, projectId, milestoneId, employeeType]);
  /* -------------------- WORKFLOW TABS -------------------- */
  const getWorkFlow = async () => {
    try {
      const payload = encryptPayload({
        appModuleUrl: location.pathname,
      });

      const res = await getWorkflowTabService(payload);

      if (res?.status === 200 && res?.data?.outcome) {
        const tabOrder = ["PENDING", "DRAFT", "FINAL_SUBMIT"];
        const apiTabs = res?.data?.data || [];

        const orderedTabs = tabOrder
          .map((code) => apiTabs.find((tab) => tab.tabCode === code))
          .filter(Boolean)
          .map((tab) => ({
            label: tab.tabName,
            value: tab.tabCode.toLowerCase(),
            tabCode: tab.tabCode,
          }));

        setButtons(orderedTabs);
        if (orderedTabs.length > 0) {
          setValue(orderedTabs[0].value);
          setTabCode(orderedTabs[0].tabCode);
        }
      }

      const res1 = await forwardListByMenuService(payload);
      if (res1?.status === 200 && res1?.data?.outcome) {
        setButons(res1?.data?.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWorkFlow();
  }, []);

  const handleTabChange = (event, newValue) => {
    const selectedTab = button.find((tab) => tab.value === newValue);
    setValue(newValue);
    setTabCode(selectedTab?.tabCode);
    resetTableStates();
  };

  const handleSubmitConfirm = (btn) => {
    if (!finYear) return toast.error("Financial Year is required");
    if (!projectId) return toast.error("Project is required");
    if (!milestoneId) return toast.error("Milestone is required");
    if (!employeeType) return toast.error("Employee Type is required");

    let list = [];
    if (value === "pending") {
      list = pendingList.filter((b) => selectedRows[b.beneficiaryId]);
    } else if (value === "draft") {
      list = draftList.filter((b) => selectedRows[b.benTrackId]);
    }

    if (!list.length) {
      return toast.error("Please select at least one beneficiary");
    }

    for (let item of list) {
      const id = value === "pending" ? item.beneficiaryId : item.benTrackId;
      const row = rowInputs[id] || {};

      if (value === "pending" && (!row.daysWork || Number(row.daysWork) <= 0)) {
        return toast.error(
          `Days worked is required for ${item.beneficiaryName}`
        );
      }
    }

    setSubmitType(btn);
    setOpenSubmit(true);
  };

  const handleSubmit = async () => {
    const actionCode = submitType?.actionType?.actionCode;

    let statusValue = 2; // default draft

    if (actionCode === "SUBMIT") {
      statusValue = 1;
    } else if (actionCode === "SAVE_DRAFT") {
      statusValue = 2;
    }
    let list = [];

    if (value === "pending") {
      list = pendingList
        .filter((b) => selectedRows[b.beneficiaryId])
        .map((b) => ({
          beneficiaryId: b.beneficiaryId,
          workDays: Number(rowInputs[b.beneficiaryId]?.daysWork || 0),
          totalAmount: Number(rowInputs[b.beneficiaryId]?.amount || 0),
          remarks: rowInputs[b.beneficiaryId]?.remarks || "",
          isActive: true,
          status: statusValue,
        }));
    } else if (value === "draft") {
      list = draftList
        .filter((b) => selectedRows[b.benTrackId])
        .map((b) => ({
          benTrackId: b.benTrackId,
          beneficiaryId: b.beneficiaryId,
          workDays: Number(
            rowInputs[b.benTrackId]?.daysWork || b.workDays || 0
          ),
          totalAmount: Number(
            rowInputs[b.benTrackId]?.amount || b.totalAmount || 0
          ),
          remarks: rowInputs[b.benTrackId]?.remarks || b.remarks || "",
          isActive: true,
          status: statusValue,
        }));
    }

    if (!list.length) {
      toast.error("Please select at least one row to submit");
      setOpenSubmit(false);
      return;
    }

    const payload = {
      projectId: Number(projectId),
      milestoneId: Number(milestoneId),
      employeeTypeLookUpId: Number(employeeType),
      beneficiaryTrackingDTOs: list,
    };

    try {
      const res = await saveBeneficiaryTrackingSerice(encryptPayload(payload));

      if (res?.data?.outcome) {
        toast.success(res.data.message || "Saved successfully");
        setOpenSubmit(false);
        resetTableStates();

        // Reload current tab data
        if (value === "pending") loadPendingList();
        else if (value === "draft") loadDraftList();
      } else {
        toast.error(res?.data?.message || "Save failed");
        setOpenSubmit(false);
      }
    } catch (err) {
      toast.error("Something went wrong");
      setOpenSubmit(false);
    }
  };

  const handleDeleteClick = (entryId) => {
    setSelectedEntryId(entryId);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    console.log("Delete entry:", selectedEntryId);
    setOpenDelete(false);
    setSelectedEntryId(null);
    loadDraftList();
  };

  const resetForm = () => {
    setFormData({
      finYear: "",
      projectId: "",
      milestoneId: "",
      employeeType: "",
    });
    setProjectOpts([]);
    setMilestoneOpts([]);
    resetTableStates();
    setPaymentRate(0);
    setPendingList([]);
    setDraftList([]);
    setCompletedList([]);
  };

  const handleSearch = () => {
    if (!projectId || !milestoneId || !employeeType) {
      toast.error("Please select Project, Milestone, and Employee Type");
      return;
    }

    // Trigger data loading based on current tab
    if (value === "pending") {
      loadPendingList();
    } else if (value === "draft") {
      loadDraftList();
    } else if (value === "final_submit") {
      loadCompletedList();
    }
  };

  const getCurrentTableData = () => {
    switch (value) {
      case "pending":
        return {
          data: pendingList,
          loading: loadingPending,
          type: "pending",
        };
      case "draft":
        return {
          data: draftList,
          loading: loadingDraft,
          type: "draft",
        };
      case "final_submit":
        return {
          data: completedList,
          loading: loadingCompleted,
          type: "complete",
        };
      default:
        return { data: [], loading: false, type: "" };
    }
  };

  const { data, loading, type } = getCurrentTableData();

  /* -------------------- JSX -------------------- */
  return (
    <div className="mt-3 p-2 bg-white rounded shadow">
      {/* Updated heading design */}
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
          Beneficiary Work Entry
        </h3>
      </div>

      <Box sx={{ width: "100%", typography: "body1", mt: 2 }}>
        <TabContext value={value}>
          {/* Filter Section */}
          <div className="grid grid-cols-12 gap-6 mt-4">
            <div className="col-span-2">
              <SelectField
                label="Financial Year"
                required={true}
                name="finYear"
                value={finYear}
                options={finOpts.map((f) => ({
                  label: f.finYear,
                  value: f.finyearId,
                }))}
                onChange={handleChangeInput}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Project"
                name="projectId"
                value={projectId}
                required={true}
                options={projectOpts.map((p) => ({
                  label: p.projectName,
                  value: p.projectId,
                }))}
                onChange={handleChangeInput}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                required={true}
                label="Milestone"
                name="milestoneId"
                value={milestoneId}
                options={milestoneOpts.map((m) => ({
                  label: m.milestoneName,
                  value: m.milestoneId,
                }))}
                onChange={handleChangeInput}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Employee Type"
                required={true}
                name="employeeType"
                value={employeeType}
                options={empTypeOpts.map((e) => ({
                  label: e.lookupValueEn,
                  value: e.lookupValueId,
                }))}
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <br></br>
          <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
            <PillTabs
              value={value}
              onChange={handleTabChange}
              tabs={button}
              aria-label="beneficiary work tabs"
            />
          </Box>
          {/* Tab Panels with Reusable Table */}
          {button.map((tab) => (
            <TabPanel key={tab.value} value={tab.value}>
              <ReusableBeneficiaryTable
                data={data}
                loading={loading}
                type={type}
                selectedRows={selectedRows}
                selectAll={selectAll}
                rowInputs={rowInputs}
                paymentRate={paymentRate}
                onRowSelect={handleRowSelect}
                onSelectAll={handleSelectAll}
                onRowChange={handleRowChange}
                onSubmit={handleSubmitConfirm}
                onDelete={handleDeleteClick}
                workflowButtons={butons}
                butons={butons}
              />
            </TabPanel>
          ))}
        </TabContext>

        {/* Center the ResetBackBtn component */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <ResetBackBtn />
        </Box>
      </Box>

      {/* Dialogs */}
      <ReusableDialog
        open={openSubmit}
        description="Are you sure you want to submit beneficiary work details?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />

      <ReusableDialog
        open={openDelete}
        description="Are you sure you want to delete this entry?"
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default BenificiaryWorkEntry;
