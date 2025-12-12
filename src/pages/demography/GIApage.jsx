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
import {
  editGIAtypeService,
  getGIAtypeList,
  saveUpdateGIAtypeService,
  toggleGIAstatusService,
} from "../../services/giaService";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { avoidSpecialCharUtil } from "../../utils/validationUtils";

const GIApage = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING

  const [formData, setFormData] = useState({
    giaTypeId: null,
    giaTypeName: "",
    remark: "",
  });
  const { giaTypeId, giaTypeName, remark } = formData;
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

    if (!giaTypeName || !giaTypeName.trim()) {
      newErrors.giaTypeName = "GIA Type name is required";
      setErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const payload = encryptPayload(formData);
        const res = await saveUpdateGIAtypeService(payload);
        if (res?.status === 200 && res?.data.outcome) {
          setOpenSubmit(false);
          setExpanded("panel2");
          toast.success(res?.data.message);
          getAllGIATableData();
        } else {
          toast.error(res?.data.message);
          getAllGIATableData();
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!giaTypeName || !giaTypeName.trim()) {
      newErrors.giaTypeName = "GIA Type name is required";
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
  const getAllGIATableData = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await getGIAtypeList(payload);
      console.log(res?.data.data);
      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [giaStatusId, setGiaStatusId] = useState(null);

  const handleConfirmStatus = async () => {
    setOpenModal(false);
    try {
      const payload = encryptPayload({ giaTypeId: giaStatusId });
      const res = await toggleGIAstatusService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        console.log(res);
        toast.success(res?.data.message);
        getAllGIATableData();
      }
    } catch (error) {}
  };

  const handleEditClick = async (id) => {
    try {
      const payload = encryptPayload({ giaTypeId: id });
      const res = await editGIAtypeService(payload);
      console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        setFormData(res?.data.data);
        setExpanded("panel1");
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllGIATableData();
  }, []);

  const GiaColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "GIA Type Name",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p className="text-slate-800">{row.giaTypeName}</p> |{" "}
            <p>{row.giaTypeCode}</p>
          </div>
        ) || "N/A",
    },
    {
      name: "Status",
      selector: (row) => (row.isActive ? "Active" : "Inactive"),
    },
    {
      name: "Remarks",
      selector: (row) => row.remark || "No remarks",
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
            // onClick={() => {console.log( row.districtId) }}
            onClick={() => {
              handleEditClick(row?.giaTypeId);
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
            onClick={() => {
              setOpenModal(true);
              setGiaStatusId(row?.giaTypeId);
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
            Add GIA Type
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
                  label="GIA Type Name"
                  required={true}
                  name="giaTypeName"
                  placeholder="Enter Name"
                  value={giaTypeName}
                  onChange={handleChangeInput}
                  error={errors.giaTypeName}
                  maxLength={30}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="Remarks"
                  textarea={true}
                  name="remark"
                  placeholder="Write Remarks..."
                  value={remark}
                  onChange={handleChangeInput}
                  maxLength={255}
                  //   error={errors.remark}
                />
              </div>

              <div className="col-span-3">
                <div className="flex justify-start gap-2 mt-7">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={giaTypeId} />
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
            GIA Type List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={GiaColumn} />
        </AccordionDetails>
      </Accordion>
      <ReusableDialog
        open={openModal}
        // title="Change Status"
        description="Are you sure you want to change status?"
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmStatus}
      />

      <ReusableDialog
        open={openSubmit}
        // title="Submit"
        description="Are you sure you want submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default GIApage;
