import React, { useEffect, useState } from "react";
import { FiFileText, FiAlertCircle } from "react-icons/fi";
import { Button } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import SelectField from "../../components/common/SelectField";
import { ResetBackBtn } from "../../components/common/CommonButtons";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { getFinancialYearService } from "../../services/budgetService";
import {
  getInspectionDetailsService,
  getLookUpForInspectionService,
  saveInspectionByStatuservice,
} from "../../services/inspectionService";
import { toast } from "react-toastify";
import {
  getMilestoneByProjectIdService,
  getProjectByFinYearService,
} from "../../services/projectService";
import { encryptPayload } from "../../crypto.js/encryption";

const InspectionDetailsReport = () => {
  const [formData, setFormData] = useState({
    finYear: "",
    projectId: "",
    milestoneId: "",
    inspectionStatus: "",
  });
  const { finYear, projectId, milestoneId, inspectionStatus } = formData;
  const [statusList, setStatusList] = useState([]);

  const [finOpts, setFinOpts] = useState([]);
  const [projectOpts, setProjectOpts] = useState([]);
  const [milestoneOpts, setMilestoneOpts] = useState([]);
  const [inspectionList, setInspectionList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openRevertModal, setOpenRevertModal] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState(null);
  const [remarks, setRemarks] = useState("");

  const getAllFinOpts = async () => {
    const res = await getFinancialYearService(encryptPayload({ isActive: true }));
    if (res?.status === 200 && res?.data?.outcome) {
      setFinOpts(res.data.data || []);
    }
  };

  const getProjectOptsByFinYear = async () => {
    if (!finYear) return;

    const res = await getProjectByFinYearService(
      encryptPayload({ isActive: true, finyearId: parseInt(finYear) })
    );

    if (res?.status === 200 && res?.data?.outcome) {
      setProjectOpts(res.data.data || []);
    } else {
      setProjectOpts([]);
    }
  };

  const getAllMilestoneOpts = async (projectIdParam) => {
    if (!projectIdParam) return; 
    const res = await getMilestoneByProjectIdService(
      encryptPayload({ isActive: true, projectId: projectIdParam })
    );  
    if (res?.status === 200 && res?.data?.outcome) {
      setMilestoneOpts(res.data.data || []);
    } else {
      setMilestoneOpts([]);
    }
  };

  const getInspectionListByMilestone = async () => {
    if (!finYear) {
      toast.error("Please select Financial Year first");
      return;
    }
    if (!projectId) {
      toast.error("Please select Project first");
      return;
    }
    setLoading(true);
    try {
      const res = await getInspectionDetailsService(
        encryptPayload({
          isActive: true,
          projectId: projectId ? parseInt(projectId) : null,
          milestoneId: milestoneId ? parseInt(milestoneId) : null,
          status:
            inspectionStatus &&
            inspectionStatus !== "INS_SCHEDULED"
              ? inspectionStatus
              : null,
        })
      );
      if (res?.status === 200 && res?.data?.outcome) {
        let data = res.data.data || [];
      
        if (inspectionStatus === "INS_SCHEDULED") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
      
          data = data.filter((item) => {
            if (!item.startDate) return false;
      
            const [day, month, year] = item.startDate.split("/");
            const startDate = new Date(year, month - 1, day);
            startDate.setHours(0, 0, 0, 0);

            return item.isComplete === false && startDate >= today;
          });
        }
      
        setInspectionList(data);
      } else {
        setInspectionList([]);
      }
    } catch (err) {
      setInspectionList([]);
      toast.error("Failed to fetch inspection list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!finYear || !projectId) {
      setInspectionList([]);
      return;
    }
    getInspectionListByMilestone();
  }, [finYear, projectId, milestoneId, inspectionStatus]);
  
  const updateInspectionStatus = async (inspectionId, statusValue, remarksText = "") => {
    try {
      const payload = { inspectionId, status: statusValue, remarks: remarksText };
      const res = await saveInspectionByStatuservice(encryptPayload(payload));

      if (res?.status === 200 && res?.data?.outcome) {
        toast.success("Status Changed successfully...");
        setOpenRevertModal(false);
        getInspectionListByMilestone();
      } else {
        toast.error(res?.data?.message || "Failed to Change status");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const getInspectionStatus = async () => {
    try {
      const res = await getLookUpForInspectionService();
      setStatusList(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = (row) => {
    updateInspectionStatus(row.inspectionId, "INS_COMPLETE");
  };

  const handleRevert = (row) => {
    setSelectedInspectionId(row.inspectionId);
    setRemarks("");
    setOpenRevertModal(true);
  };

  const handleRevertSubmit = () => {
    if (!remarks.trim()) {
      toast.error("Remarks is required");
      return;
    }
    updateInspectionStatus(selectedInspectionId, "INS_REVERT", remarks);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "projectId") {
      setMilestoneOpts([]);
      setFormData(prev => ({ ...prev, milestoneId: "" }));
      setInspectionList([]);
      if (value) {
        getAllMilestoneOpts(parseInt(value)); 
      }
    }
  
    if (name === "milestoneId") {
      setInspectionList([]);
    }
  };
  
  useEffect(() => { getAllFinOpts(); }, []);
  useEffect(() => { if (finYear) getProjectOptsByFinYear(); else setProjectOpts([]); }, [finYear]);
  useEffect(() => { 
    if (projectId) getAllMilestoneOpts(parseInt(projectId)); 
    else setMilestoneOpts([]); 
  }, [projectId]);
  useEffect(() => { getInspectionStatus(); }, []);

  // Define columns for ReusableDataTable
  const columns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
      sortable: false,
    },
    {
      name: "Project Name",
      selector: (row) => row.projectName || "-",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Milestone",
      selector: (row) => row.milestoneName || "-",
      sortable: true,
      minWidth: "180px",
    },
    {
      name: "Agency",
      selector: (row) => row.agencyName || "-",
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Start Date",
      selector: (row) => row.startDate || "-",
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "End Date",
      selector: (row) => row.endDate || "-",
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Status",
      selector: (row) => {
        const isCompleted = row.status === "INS_COMPLETE";
        const statusColor = isCompleted
          ? "bg-green-100 text-green-800"
          : row.status === "INS_REVERT"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800";
          
        
        const statusText = row.status 
          ? row.status.replace("INS_", "").replace("_", " ") 
          : "SCHEDULED";
        
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
            {statusText}
          </span>
        );
      },
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Action",
      selector: (row) => {
        const isCompleted = row.status === "INS_COMPLETE";
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={isCompleted}
              onClick={() => handleApprove(row)}
              className="text-xs px-3 py-1"
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              disabled={isCompleted}
              onClick={() => handleRevert(row)}
              className="text-xs px-3 py-1"
            >
              Revert
            </Button>
          </div>
        );
      },
      sortable: false,
      width: "200px",
      center: true,
    },
  ];

  return (
    <>
      {/* FILTER CARD */}
      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="p-0">
          <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md">
            <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
            Inspection Details Report
          </h3>
        </div>
        
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-2">
              <SelectField
                label="Financial Year"
                name="finYear"
                required
                value={finYear}
                options={finOpts.map((i) => ({ value: i.finyearId, label: i.finYear }))}
                onChange={handleChangeInput}
              />
            </div>

            <div className="col-span-3">
              <SelectField
                label="Project Name"
                name="projectId"
                required
                value={projectId}
                disabled={!finYear}
                options={projectOpts.map((i) => ({ value: i.projectId, label: i.projectName }))}
                onChange={handleChangeInput}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Milestone Name"
                name="milestoneId"
                value={milestoneId}
                disabled={!projectId}
                options={milestoneOpts.map((i) => ({ value: i.milestoneId, label: i.milestoneName }))}
                onChange={handleChangeInput}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Inspection Status"
                name="inspectionStatus"
                value={inspectionStatus}
                onChange={handleChangeInput}
                options={statusList.map((d) => ({
                  value: d.lookupValueCode,
                  label: d.lookupValueEn,
                }))}
                placeholder="Select"
              />
            </div>
          </div>
        </div>
      </div>

      {/* REUSABLE DATA TABLE WITH LIGHT BLUE CONTAINER */}
      <div className="mt-5">
        {inspectionList.length > 0 || loading ? (
          <div className="relative border border-dashed border-blue-300 bg-[#f0f8ff] p-4 rounded-md">
            <span className="absolute -top-3 left-4 bg-[#f0f8ff] px-3 text-sm font-semibold text-blue-600">
              List Of Inspection
            </span>
            <div className="mt-4">
              <ReusableDataTable 
                data={inspectionList} 
                columns={columns} 
              />
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  Last Updated: {new Date().toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-600">
                  Total Inspections: {inspectionList.length}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500">Please select Financial Year and Project to view inspection details.</p>
          </div>
        )}
      </div>

      {/* REVERT DIALOG */}
      <Dialog
        open={openRevertModal}
        onClose={() => setOpenRevertModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Revert</DialogTitle>
        <DialogContent>
          <TextField
            label="Remarks..."
            fullWidth
            multiline
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRevertModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRevertSubmit} variant="contained" color="error">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* BACK BUTTON AT THE END */}
      <div className="flex justify-center mt-6">
        <ResetBackBtn />
      </div>
    </>
  );
};

export default InspectionDetailsReport;