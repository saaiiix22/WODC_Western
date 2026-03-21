import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import ReusableDialog from "../../components/common/ReusableDialog";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { getFinancialYearService } from "../../services/budgetService";
import {
  getMilestoneByProjectIdService,
  getProjectByFinYearService,
} from "../../services/projectService";
import { getAgencyDetailsService } from "../../services/agencyService";
import {
  saveInspectionSerice,
  getInspectionDetailsService,
  getAllInspectionByCategoryService,
  getInspectionByIdService,
  getLookUpForInspectionPhaseService,
  getInspectionPhaseByProjectAndMilestoneService,
  inspectionTabService,
} from "../../services/inspectionService";
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { useLocation, useNavigate } from "react-router-dom";
import PillTabs from "../../components/common/Styletab";
import { forwardListByMenuService, getWorkflowTabService } from "../../services/workflowService";
import { GrSave } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { addAllowedPath } from "../../redux/slices/menuSlice";

const Inspection = () => {
  const [value, setValue] = useState('');


  const [formData, setFormData] = useState({
    finYear: "",
    projectId: "",
    milestoneId: "",
    agencyId: "",
    startDate: "",
    endDate: "",
    phaseCode: "",
  });

  const { finYear, projectId, milestoneId, agencyId, startDate, endDate, phaseCode } = formData;

  const [finOpts, setFinOpts] = useState([]);
  const [projectOpts, setProjectOpts] = useState([]);
  const [milestoneOpts, setMilestoneOpts] = useState([]);
  const [agencyOpts, setAgencyOpts] = useState([]);

  const [inspectionList, setInspectionList] = useState([]);
  const [inspectionListComp, setInspectionListComp] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [inspectionPhaseOpts, setInspectionPhaseOpts] = useState([]);
  const [button, setButtons] = useState([]);
  const [forwardedId, setForwardedId] = useState(null);
  const [phaseLoading, setPhaseLoading] = useState(false);
  const [isViewModeFromPhase, setIsViewModeFromPhase] = useState(false);

  // const getWorkFlow = async () => {
  //   try {
  //     const payload = encryptPayload({
  //       appModuleUrl: location.pathname,
  //       forwardedId: forwardedId ? Number(forwardedId) : null
  //     });
  //     const res = await forwardListByMenuService(payload);
  //     if (res?.status === 200 && res?.data.outcome) {
  //       setButtons(res?.data.data);
  //     } else {
  //       setButtons([]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setButtons([]);
  //   }
  // };

  // useEffect(() => {
  //   getWorkFlow();
  // }, [forwardedId]);

  const toDDMMYYYY = (dateStr = "") => {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const getAllFinOpts = async () => {
    const res = await getFinancialYearService(
      encryptPayload({ isActive: true })
    );
    if (res?.status === 200 && res?.data?.outcome) {
      setFinOpts(res.data.data || []);
    }
  };

  const getAllAgencyList = async () => {
    const res = await getAgencyDetailsService(
      encryptPayload({ isActive: true })
    );
    if (res?.status === 200) {
      setAgencyOpts(res?.data?.data || []);
    }
  };

  const getProjectOptsByFinYear = async () => {
    if (!finYear) return;

    const res = await getProjectByFinYearService(
      encryptPayload({
        isActive: true,
        finyearId: parseInt(finYear),
      })
    );

    if (res?.status === 200 && res?.data?.outcome) {
      setProjectOpts(res.data.data || []);
    } else {
      setProjectOpts([]);
    }
  };

  const getInspectionPhaseList = async () => {
    try {
      const res = await getLookUpForInspectionPhaseService();
      if (res?.status === 200 && res?.data?.outcome) {
        setInspectionPhaseOpts(res.data.data || []);
      }
    } catch (err) {
      console.log("Failed to load inspection phases", err);
      toast.error("Failed to load inspection phases");
    }
  };
  const [tabs, setTabs] = useState([])
  const getTabs = async () => {
    try {
      const payload = encryptPayload({
        appModuleUrl: location.pathname,
      });

      const res = await getWorkflowTabService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        const tabData = res?.data.data || [];

        setTabs(tabData);
        if (tabData.length > 0) {
          setValue(tabData[0].tabId.toString());
          setTabCode(tabData[0].tabCode);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const location = useLocation();
  const { inspectionId, isViewMode: isViewModeFromState } = location.state || {};

  const [isEditMode, setIsEditMode] = useState(false);

  const getInspectionById = async () => {
    try {
      const payload = encryptPayload({
        inspectionId,
        isViewMode: isViewModeFromState,
      });

      const res = await getInspectionByIdService(payload);
      console.log(res);

      if (res?.status === 200 && res?.data?.outcome) {
        const d = res.data.data;

        setIsEditMode(true);

        setFormData({
          ...d,
          milestoneId: d.milestoneId,
          finYear: d?.finyearId,
          startDate: d.startDate?.split("/").reverse().join("-") || "",
          endDate: d.endDate?.split("/").reverse().join("-") || "",
          phaseCode: d.phaseCode || "",
          agencyId: d.agencyId || ""
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getInspectionPhaseInfo = async () => {
    if (!projectId || !milestoneId || isViewModeFromState) return;

    setPhaseLoading(true);
    try {
      const res = await getInspectionPhaseByProjectAndMilestoneService(
        encryptPayload({
          projectId: projectId,
          milestoneId: milestoneId,
        })
      );

      if (res?.status === 200 && res?.data?.outcome) {
        const data = res?.data?.data;

        // Update form data with phase info
        setFormData(prev => ({
          ...prev,
          phaseCode: data.phaseCode || prev.phaseCode,
          agencyId: data.agencyId || prev.agencyId,
          startDate: data.startDate ? data.startDate.split("/").reverse().join("-") : prev.startDate,
          endDate: data.endDate ? data.endDate.split("/").reverse().join("-") : prev.endDate,
        }));

        // Set view mode based on phase info
        setIsViewModeFromPhase(data.isViewMode || false);

        console.log("Stage ", res?.data?.data?.stageForwardedRuleDtos);

        if (res?.data?.data?.stageForwardedRuleDtos == null) {
          setButtons([]);
        } else {
          setButtons(res?.data?.data?.stageForwardedRuleDtos);
        }
      }


    } catch (err) {
      console.log("Failed to load inspection phase info", err);
    } finally {
      setPhaseLoading(false);
    }
  };

  const getAllMilestoneOpts = async () => {
    if (!projectId) return;

    const res = await getMilestoneByProjectIdService(
      encryptPayload({
        isActive: true,
        projectId: projectId,
      })
    );

    if (res?.status === 200 && res?.data?.outcome) {
      setMilestoneOpts(res.data.data || []);
    } else {
      setMilestoneOpts([]);
    }
  };

  const getInspectionListSch = async () => {
    setLoading(true);
    try {
      const res = await getAllInspectionByCategoryService(
        encryptPayload({ isActive: false })
      );
      if (res?.status === 200 && res?.data?.outcome) {
        setInspectionList(res.data.data || []);
      } else {
        setInspectionList([]);
      }
    } catch (err) {
      toast.error("Failed to load inspection list");
    } finally {
      setLoading(false);
    }
  };
  const [tabCode, setTabCode] = useState("");
  const getInspectionListComp = async () => {
    setLoading(true);
    try {
      const res = await getAllInspectionByCategoryService(
        encryptPayload({ isActive: true })
      );

      if (res?.status === 200 && res?.data?.outcome) {
        setInspectionListComp(res.data.data || []);
      } else {
        setInspectionListComp([]);
      }
    } catch (err) {
      toast.error("Failed to load inspection list");
    } finally {
      setLoading(false);
    }
  };
  const [tableData, setTableData] = useState([])
  const getTableData = async () => {
    try {
      const payload = encryptPayload({ TABCODE: tabCode });
      const res = await inspectionTabService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        setTableData(res?.data.data || []);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllFinOpts();
    getAllAgencyList();
    getInspectionListSch();
    getInspectionListComp();
    getInspectionPhaseList();
    getTabs();
  }, []);

  useEffect(() => {
    getTableData()
  }, [tabCode])

  useEffect(() => {
    if (inspectionId) {
      getInspectionById();
    }
  }, [inspectionId]);

  useEffect(() => {
    if (!isEditMode) {
      setProjectOpts([]);
      setMilestoneOpts([]);
      setFormData((prev) => ({
        ...prev,
        projectId: "",
        milestoneId: "",
        phaseCode: "",
        agencyId: "",
        startDate: "",
        endDate: "",
      }));
    }

    if (finYear) getProjectOptsByFinYear();
  }, [finYear]);

  useEffect(() => {
    if (!projectId) return;

    if (!isEditMode) {
      setMilestoneOpts([]);
      setFormData(prev => ({
        ...prev,
        milestoneId: "",
        phaseCode: "",
        agencyId: "",
        startDate: "",
        endDate: "",
      }));
    }

    getAllMilestoneOpts();
  }, [projectId, isEditMode]);

  useEffect(() => {
    if (projectId && milestoneId && !isViewModeFromState && !inspectionId) {
      getInspectionPhaseInfo();
    }
  }, [projectId, milestoneId]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    if (name === "phaseCode") return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "projectId") {
      setFormData(prev => ({
        ...prev,
        milestoneId: "",
        phaseCode: "",
        agencyId: "",
        startDate: "",
        endDate: "",
      }));
    }

    if (name === "milestoneId") {
      setFormData(prev => ({
        ...prev,
        phaseCode: "",
        agencyId: "",
        startDate: "",
        endDate: "",
      }));
    }
  };

  const handleChangeTabs = (event, newValue) => {
    const selectedTab = inspectionTabs?.find(
      (tab) => tab.value === newValue
    );
    setValue(newValue);
    setTabCode(selectedTab?.tabCode);
  };

  const confirmSubmit = (e) => {
    e.preventDefault();

    let err = {};
    if (!finYear) err.finYear = "Required";
    if (!projectId) err.projectId = "Required";
    if (!milestoneId) err.milestoneId = "Required";
    if (!agencyId) err.agencyId = "Required";
    if (!startDate) err.startDate = "Required";
    if (!endDate) err.endDate = "Required";
    if (!phaseCode) err.phaseCode = "Required";

    setErrors(err);
    if (Object.keys(err).length === 0) setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        inspectionId,
        projectId,
        milestoneId,
        agencyId,
        phaseCode,
        startDate: toDDMMYYYY(startDate),
        endDate: toDDMMYYYY(endDate),
        forwardedId,
      };

      const res = await saveInspectionSerice(encryptPayload(payload));

      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data?.message || "Saved successfully");

        setFormData({
          finYear: "",
          projectId: "",
          milestoneId: "",
          agencyId: "",
          startDate: "",
          endDate: "",
          phaseCode: "",
        });
        getTableData()
        setProjectOpts([]);
        setMilestoneOpts([]);
        getInspectionListSch();
        getInspectionListComp();
      }
      else{
        toast.error(res?.data.message)
        getTableData()
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
    }
  };

  const navigate = useNavigate()
  const isViewMode = isViewModeFromState || isViewModeFromPhase;
  const dispatch = useDispatch()
  const columns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    { name: "Project Name", selector: (row) => row.projectName },
    { name: "Milestone", selector: (row) => row.milestoneName },
    { name: "Agency", selector: (row) => row.agencyName },
    { name: "Phase", selector: (row) => row.phaseCode || 'N/A' },
    { name: "Start Date", selector: (row) => row.startDate },
    { name: "End Date", selector: (row) => row.endDate },
    {
      name: "Action", selector: (row) => <button
        className="flex items-center justify-center w-7 h-7 border border-amber-200 rounded-md bg-amber-50 text-[#78350f] hover:bg-amber-100 transition-colors duration-200"
        onClick={() => {
          navigate("/inspectionList", { state: row })
          dispatch(addAllowedPath("/inspectionList"))
        }}
      ><FaEye size={16} /></button>
    },
  ];



  const inspectionTabs = tabs?.sort().map((i) => {
    return {
      label: i.tabName,
      value: i.tabId.toString(),
      tabCode: i.tabCode
    };
  });

  return (
    <>
      <form onSubmit={confirmSubmit}>
        <div className="mt-3 p-2 bg-white shadow rounded">
          <h3
            className="
              flex items-center gap-2 text-white font-normal text-[16px]
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
            {isViewMode ? "View Inspection" : inspectionId ? "Edit Inspection" : "Add Inspection"}
          </h3>

          <div className="grid grid-cols-12 gap-6 p-4">
            <div className="col-span-2">
              <SelectField
                label="Financial Year"
                name="finYear"
                value={finYear}
                required
                options={finOpts.map((i) => ({
                  value: i.finyearId,
                  label: i.finYear,
                }))}
                placeholder="Select"
                onChange={handleChangeInput}
                error={errors.finYear}
                disabled={isViewMode && isViewModeFromState} // Only disable in pure view mode, not in edit mode
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Project Name"
                name="projectId"
                value={projectId}
                required
                disabled={isViewMode && isViewModeFromState || !finYear}
                options={projectOpts.map((i) => ({
                  value: i.projectId,
                  label: i.projectName,
                }))}
                placeholder="Select"
                onChange={handleChangeInput}
                error={errors.projectId}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Milestone Name"
                name="milestoneId"
                value={milestoneId}
                required
                disabled={isViewMode && isViewModeFromState || !projectId}
                options={milestoneOpts.map((i) => ({
                  value: i.milestoneId,
                  label: i.milestoneName,
                }))}
                placeholder="Select"
                onChange={handleChangeInput}
                error={errors.milestoneId}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Agency Name"
                name="agencyId"
                value={agencyId}
                options={agencyOpts.map((i) => ({
                  value: i.agencyId,
                  label: i.agencyName,
                }))}
                placeholder="Select"
                onChange={handleChangeInput}
                disabled={isViewMode || phaseLoading}
                error={errors.agencyId}
              />
            </div>

            <div className="col-span-2">
              <InputField
                label="Start Date"
                required
                type="date"
                name="startDate"
                value={startDate}
                onChange={handleChangeInput}
                error={errors.startDate}
                disabled={isViewMode || phaseLoading}
              />
            </div>

            <div className="col-span-2">
              <InputField
                label="End Date"
                required
                type="date"
                name="endDate"
                value={endDate}
                min={startDate || ""}
                onChange={handleChangeInput}
                error={errors.endDate}
                disabled={isViewMode || phaseLoading}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Inspection Phase"
                name="phaseCode"
                value={phaseCode}
                required
                options={inspectionPhaseOpts.map((i) => ({
                  value: i.lookupValueCode,
                  label: i.lookupValueEn,
                }))}
                placeholder={phaseLoading ? "Loading..." : "Auto-selected"}
                onChange={handleChangeInput}
                error={errors.phaseCode}
                disabled={true}
              />
            </div>
          </div>

          <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            {button?.map((i, index) => {
              return (
                <button
                  type="submit"
                  key={index}
                  className={i?.actionType.color}
                  // disabled={Object.keys(errors).length > 0 || phaseLoading}
                  onClick={(e) => {
                    if (
                      i?.actionType.actionCode === "REVERTED" ||
                      i?.actionType.actionCode === "REJECTED" ||
                      i?.actionType.actionCode === "APPROVED"
                    ) {
                      setPendingAction(i);
                      setRejectionModal(true);
                      e.preventDefault();
                    } else {
                      setForwardedId(i.forwardedId);
                    }
                  }}
                >
                  <GrSave /> {i?.actionType.actionNameEn}
                </button>
              )
            })}
          </div>
        </div>
      </form>

      <div className="mt-5 p-2 bg-white shadow rounded">
        <h3
          className="
            flex items-center gap-2 text-white font-normal text-[16px]
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
          Inspection List
        </h3>
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <Box sx={{ width: '100%', typography: 'body1', padding: '0', margin: "0" }}>
            <TabContext value={value}>
              <PillTabs
                value={value}
                onChange={handleChangeTabs}
                tabs={inspectionTabs}
              />

              {inspectionTabs?.map((tab) => (
                <TabPanel key={tab.value} value={tab.value} sx={{ p: 0, mt: 1 }}>
                  <ReusableDataTable
                    columns={columns}
                    data={tableData}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    striped
                  />
                </TabPanel>
              ))}
            </TabContext>
          </Box>
        </div>
      </div>

      <ReusableDialog
        open={open}
        description="Are you sure you want to submit?"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
      />
    </>
  );
};

export default Inspection;