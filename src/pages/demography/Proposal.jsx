import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useEffect } from "react";
import { GoPencil } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import SelectField from "../../components/common/SelectField";
import { getAllDists } from "../../services/blockService";
import {
  editProposalListService,
  proposalListService,
  saveUpdateProposalService,
  toggleProposalStatusService,
} from "../../services/proposalService";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { avoidSpecialCharUtil } from "../../utils/validationUtils";
import { Tooltip } from "@mui/material";

const Proposal = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING

  const [formData, setFormData] = useState({
    proposalId: null,
    districtId: "",
    proposalName: "",
  });
  const { districtId, proposalId, proposalName } = formData;

  const [distOptions, setDistOptions] = useState([]);
  const getAllDistsOptions = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getAllDists(payload);
      // console.log(res);
      setDistOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!districtId) {
      newErrors.districtId = "District name is required";
      setErrors(newErrors);
      return;
    }

    if (!proposalName || !proposalName.trim()) {
      newErrors.proposalName = "Proposed By name is required";
      setErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
    }
    const sendData = {
      proposalId: proposalId,
      proposalName: proposalName,
      district: {
        districtId: districtId,
      },
    };
    try {
      setOpenSubmit(false);
      const payload = encryptPayload(sendData);
      console.log(payload, "proposal");
      const res = await saveUpdateProposalService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        getAllProposalTableData();
        setExpanded("panel2");
      }
    } catch (error) {
      throw error;
    }
  };
  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!districtId) {
      newErrors.districtId = "District name is required";
      setErrors(newErrors);
      return;
    }

    if (!proposalName || !proposalName.trim()) {
      newErrors.proposalName = "Proposed By name is required";
      setErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    } else {
      setOpenSubmit(false);
    }
  };

  const [tableData, setTableData] = useState([]);
  const getAllProposalTableData = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await proposalListService(payload);
      console.log(res?.data.data);
      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    }
  };

  const handleEditClick = async (id) => {
    try {
      const payload = encryptPayload({
        proposalId: id,
        isActive: true,
      });
      const res = await editProposalListService(payload);
      console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        const details = res?.data.data;
        setFormData({
          proposalId: details?.proposalId || null,
          proposalName: details?.proposalName,
          districtId: details?.district.districtId || "",
        });
        setExpanded("panel1");
      }
    } catch (error) {
      throw error;
    }
  };
  const [openModal, setOpenModal] = useState(false);
  const [proposedId, setProposedId] = useState(null);
  const toggleStatus = async (id) => {
    setOpenModal(false);
    try {
      const payload = encryptPayload({ proposalId: proposedId });
      const res = await toggleProposalStatusService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        getAllProposalTableData();
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllDistsOptions();
    getAllProposalTableData();
  }, []);

  const proposalColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },

    {
      name: "District Name",
      selector: (row) => row.district.districtName || "N/A",
      sortable: true,
    },

    {
      name: "Proposal Name",
      selector: (row) => row.proposalName || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.isActive ? "Active" : "Inactive"),
    },
    {
      name: "Action",

      width: "120px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* EDIT BUTTON */}
          <Tooltip title="Edit" arrow>
            <button
              type="button"
              className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
              // onClick={() => {console.log( row.districtId) }}
              onClick={() => {
                handleEditClick(row?.proposalId);
              }}
            >
              <GoPencil className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* ACTIVE / INACTIVE BUTTON */}
          <Tooltip title={row.isActive ? "Active" : "Inactive"} arrow>
            <button
              className={`flex items-center justify-center h-8 w-8 rounded-full 
            ${
              row.isActive
                ? "bg-green-600/25 hover:bg-green-700/25 text-green-600"
                : "bg-red-500/25 hover:bg-red-600/25 text-red-500 "
            }`}
              onClick={() => {
                setOpenModal(true);
                setProposedId(row?.proposalId);
              }}
            >
              {row.isActive ? (
                <MdLockOutline className="w-4 h-4" />
              ) : (
                <MdLockOpen className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="mt-3">
      {/* ---------- Accordion 1: Get District Form ---------- */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          arrowcolor="#fff"
          sx={{
            backgroundColor: "#f4f0f2",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "14px",
              color: "#3c001b",
            }}
          >
            Add Proposed By Details
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form
              className="grid grid-cols-12 gap-6"
              onSubmit={handleSubmitConfirmModal}
            >
              <div className="col-span-2">
                <SelectField
                  label="Select District"
                  required={true}
                  name="districtId"
                  value={districtId}
                  onChange={handleChangeInput}
                  options={distOptions?.map((d) => ({
                    value: d.districtId,
                    label: d.districtName,
                  }))}
                  error={errors.districtId}
                  placeholder="Select"
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="Proposed By Name"
                  name="proposalName"
                  required={true}
                  placeholder="Enter proposed by name"
                  value={avoidSpecialCharUtil(proposalName)}
                  onChange={handleChangeInput}
                  maxLength={30}
                  error={errors.proposalName}
                />
              </div>

              <div className="col-span-3">
                <div className="flex justify-start gap-2 mt-7">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={proposalId} />
                </div>
              </div>
            </form>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* ---------- Accordion 2: District List ---------- */}
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          sx={{
            backgroundColor: "#f4f0f2",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "14px",
              color: "#3c001b",
            }}
          >
            Proposed By List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={proposalColumn} />
        </AccordionDetails>
      </Accordion>
      <ReusableDialog
        open={openModal}
        // title="Change Status"
        description="Are you sure you want to change status?"
        onClose={() => setOpenModal(false)}
        onConfirm={toggleStatus}
      />
      <ReusableDialog
        open={openSubmit}
        // title="Submit"
        description="Are you sure you want to submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default Proposal;
