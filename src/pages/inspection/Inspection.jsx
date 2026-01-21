import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import ReusableDialog from "../../components/common/ReusableDialog";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

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
} from "../../services/inspectionService";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useLocation } from "react-router-dom";

const Inspection = () => {

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [formData, setFormData] = useState({
    finYear: "",
    projectId: "",
    milestoneId: "",
    agencyId: "",
    startDate: "",
    endDate: "",
  });

  const { finYear, projectId, milestoneId, agencyId, startDate, endDate } =
    formData;

  const [finOpts, setFinOpts] = useState([]);
  const [projectOpts, setProjectOpts] = useState([]);
  const [milestoneOpts, setMilestoneOpts] = useState([]);
  const [agencyOpts, setAgencyOpts] = useState([]);

  const [inspectionList, setInspectionList] = useState([]);
  const [inspectionListComp, setInspectionListComp] = useState([]);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

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


  const location = useLocation();
  const { inspectionId, isViewMode } = location.state || {};
  // console.log(inspectionId);
  



  const [isEditMode, setIsEditMode] = useState(false);

  const getInspectionById = async () => {
    // debugger;
    try {
      const payload = encryptPayload({
        inspectionId,
        isViewMode,
      });

      const res = await getInspectionByIdService(payload);
      console.log(res);

      if (res?.status === 200 && res?.data?.outcome) {
        const d = res.data.data;

        setIsEditMode(true);

        setFormData({ ...d, finYear:d?.finyearId, startDate: d.startDate.split("/").reverse().join("-"), endDate: d.endDate.split("/").reverse().join("-") });

      }
    } catch (err) {
      // toast.error("Failed to load inspection details");
      console.log(err);
    }
  };

  console.log(formData);
  


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


  const getInspectionListComp = async () => {
    setLoading(true);
    try {
      const res = await getAllInspectionByCategoryService(
        encryptPayload({ isActive: true })
      );
      // console.log(res);

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

  useEffect(() => {
    getAllFinOpts();
    getAllAgencyList();
    getInspectionListSch();
    getInspectionListComp();

  }, []);

  useEffect(() => {
    if (inspectionId) {
      getInspectionById();
    }
  }, [inspectionId]);

  // useEffect(() => {
  //   setProjectOpts([]);
  //   setMilestoneOpts([]);
  //   setFormData((prev) => ({ ...prev, projectId: "", milestoneId: "" }));

  //   if (finYear) getProjectOptsByFinYear();
  // }, [finYear]);

  useEffect(() => {
    if (!isEditMode) {
      setProjectOpts([]);
      setMilestoneOpts([]);
      setFormData((prev) => ({
        ...prev,
        projectId: "",
        milestoneId: "",
      }));
    }

    if (finYear) getProjectOptsByFinYear();
  }, [finYear]);

  useEffect(() => {
    setMilestoneOpts([]);
    setFormData((prev) => ({ ...prev, milestoneId: "" }));

    if (projectId) getAllMilestoneOpts();
  }, [projectId]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

    setErrors(err);
    if (Object.keys(err).length === 0) setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        projectId,
        milestoneId,
        agencyId,
        startDate: toDDMMYYYY(startDate),
        endDate: toDDMMYYYY(endDate),
      };

      const res = await saveInspectionSerice(encryptPayload(payload));

      if (res?.status === 200) {
        toast.success(res?.data?.message || "Saved successfully");


        setFormData({
          finYear: "",
          projectId: "",
          milestoneId: "",
          agencyId: "",
          startDate: "",
          endDate: "",
        });
        setProjectOpts([]);
        setMilestoneOpts([]);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
    }
  };


  const columns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    // { name: "Financial Year", selector: (row) => row.finYear },
    { name: "Project Name", selector: (row) => row.projectName },
    { name: "Milestone", selector: (row) => row.milestoneName },
    { name: "Agency", selector: (row) => row.agencyName },
    { name: "Start Date", selector: (row) => row.startDate },
    { name: "End Date", selector: (row) => row.endDate },
  ];

  const columnsComp = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    { name: "Project Name", selector: (row) => row.projectName },
    { name: "Milestone", selector: (row) => row.milestoneName },
    { name: "Agency", selector: (row) => row.agencyName },
    { name: "Start Date", selector: (row) => row.startDate },
    { name: "End Date", selector: (row) => row.endDate },
  ];

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
                disabled={isViewMode}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Project Name"
                name="projectId"
                value={projectId}
                required
                disabled={isViewMode || !finYear}
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
                disabled={isViewMode || !projectId}
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
                disabled={isViewMode}
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
                disabled={isViewMode}

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
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            {!isViewMode && <SubmitBtn type="submit" />}
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
              <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: '0', margin: "0" }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example"
                  sx={{
                    display: "flex",
                    justifyContent: "end"
                  }}>
                  <Tab label="Scheduled" value="1" />
                  <Tab label="Completed" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ padding: '0', margin: "0", mt: '10px' }}>
                <ReusableDataTable
                  columns={columns}
                  data={inspectionList}
                  progressPending={loading}
                  pagination
                  highlightOnHover
                  striped
                />
              </TabPanel>
              <TabPanel value="2" sx={{ padding: '0', margin: "0", mt: '10px' }}>
                <ReusableDataTable
                  columns={columnsComp}
                  data={inspectionListComp}
                  progressPending={loading}
                  pagination
                  highlightOnHover
                  striped
                />
              </TabPanel>
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
