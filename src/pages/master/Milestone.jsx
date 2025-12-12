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
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import {
  editMilestoneService,
  getMilesStoneListService,
  saveMilesStoneService,
  toggleMilestoneStatusService,
} from "../../services/milesStoneService";

const Milestone = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING

  const [formData, setFormData] = useState({
    milestoneId: null,
    remark: "",
    milestoneName: "",
  });
  const { milestoneId, remark, milestoneName } = formData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    // CLEAR ERROR WHEN USER TYPES
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData({ ...formData, [name]: value });
  };
  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);

  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!milestoneName || !milestoneName.trim()) {
      newErrors.milestoneName = "Milestone name is required";
      setErrors(newErrors);
      return;
    }
    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = {
      milestoneId: milestoneId,
      remark: remark,
      milestoneName: milestoneName,
    };
    try {
      setOpenSubmit(false);
      setExpanded("panel2");
      const payload = encryptPayload(sendData);
      const res = await saveMilesStoneService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        setFormData({
          milestoneId: null,
          remark: "",
          milestoneName: "",
        });
        setExpanded("panel2");
        getMilesStoneTable();
      } else {
        toast.error(res?.data.message);
        setFormData({
          milestoneId: null,
          remark: "",
          milestoneName: "",
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const [tableData, setTableData] = useState([]);
  const getMilesStoneTable = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await getMilesStoneListService(payload);
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setTableData(res?.data.data || []);
      } else {
        toast.error(res?.data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getMilesStoneTable();
  }, []);

  const [openModal, setOpenModal] = useState(false);

  const editMilestone = async (id) => {
    try {
      const payload = encryptPayload({ milestoneId: id, isActive: false });
      const res = await editMilestoneService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setFormData(res?.data.data);
        setExpanded("panel1");
      }
    } catch (error) {
      throw error;
    }
  };

  const [openMilestoneId, setMilestoneId] = useState("");

  const toggleStatus = async () => {
    try {
      const payload = encryptPayload({ milestoneId: openMilestoneId });
      const res = await toggleMilestoneStatusService(payload);
      //   console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setOpenModal(false);
        toast.success(res?.data.data);
        getMilesStoneTable();
      }
    } catch (error) {
      throw error;
    }
  };

  const milestoneColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Milestone Name",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p className="text-slate-800">{row.milestoneName}</p> |{" "}
            <p>{row.milestoneCode}</p>
          </div>
        ) || "N/A",
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => (row.isActive ? "Active" : "Inactive"),
    },
    {
      name: "Remarks",
      selector: (row) => row.remark || "N/A",
      sortable: true,
    },
    {
      name: "Action",

      width: "120px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* EDIT BUTTON */}
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
            onClick={() => {
              editMilestone(row?.milestoneId);
            }}
          >
            <GoPencil className="w-4 h-4" />
          </button>

          {/* ACTIVE / INACTIVE BUTTON */}
          <button
            className={`flex items-center justify-center h-8 w-8 rounded-full 
            ${
              row.isActive
                ? "bg-green-600/25 hover:bg-green-700/25 text-green-600"
                : "bg-red-500/25 hover:bg-red-600/25 text-red-500 "
            }`}
            // onClick={() => toggleStatus(row?.blockId)}
            onClick={() => {
              setMilestoneId(row?.milestoneId);
              setOpenModal(true);
            }}
          >
            {row.isActive ? (
              <MdLockOutline className="w-4 h-4" />
            ) : (
              <MdLockOpen className="w-4 h-4" />
            )}
          </button>
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
              color: "#2c0014",
            }}
          >
            Add Milestone
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form
              className="grid grid-cols-12 gap-6"
              onSubmit={handleSubmitConfirmModal}
            >
              <div className="col-span-2">
                <InputField
                  label="Milestone Name"
                  required={true}
                  maxLength={100}
                  name="milestoneName"
                  placeholder="Enter milestone name"
                  value={milestoneName}
                  onChange={handleChangeInput}
                  error={errors.milestoneName}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="Description"
                  required={true}
                  textarea={true}
                  name="remark"
                  maxLength={255}
                  placeholder="Write Remarks..."
                  value={remark}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-3">
                <div className="flex justify-start gap-2 mt-7 ">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={milestoneId} />
                  {/* <button
                    type="submit"
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-all active:scale-95"
                  >
                    Submit
                  </button>

                  <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all active:scale-95">
                    Back
                  </button> */}
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
              color: "#2c0014",
            }}
          >
            Milestone List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={milestoneColumn} />
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
        description="Are you sure you want submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default Milestone;
