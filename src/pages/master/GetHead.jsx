import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import { Tooltip } from "@mui/material";
import {
  getAllHeadListService,
  saveUpdateHeadService,
  editHeadDataService,
  toggleHeadStatusService,
} from "../../services/headService";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { GoPencil } from "react-icons/go";
import { MdLockOutline, MdLockOpen } from "react-icons/md";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import {
  ResetBackBtn,
  SubmitBtn,
} from "../../components/common/CommonButtons";
import {
  avoidSpecialCharUtil,
  cleanStringUtil,
} from "../../utils/validationUtils";
import { useTranslation } from "react-i18next";
import { sanitizeInputUtil } from "../../utils/sanitizeInputUtil";

const GetHead = () => {
  const [expanded, setExpanded] = useState("panel2");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("getHead");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING
  const [formData, setFormData] = useState({
    headId: null,
    headName: "",
    description: "",
    isActive: true
  });

  const { headId, headName, description } = formData;
  const [errors, setErrors] = useState({});

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "headName") {
      updatedValue = avoidSpecialCharUtil(value);
    }

    setFormData({ ...formData, [name]: sanitizeInputUtil(updatedValue) });
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const [openSubmit, setOpenSubmit] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.headName.trim()) {
      newErrors.headName = "Head name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = encryptPayload({
        headId: headId,
        headName: headName,
        description: description,
      });

      const res = await saveUpdateHeadService(payload);

      if (res?.data.outcome && res.status === 200) {
        setOpenSubmit(false);
        toast.success(res?.data.message);
        setExpanded("panel2");
        getHeadList();
        setFormData({
          headId: null,
          headName: "",
          description: "",
        });
      } else {
        setOpenSubmit(false);
        toast.error(res?.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.headName.trim()) {
      newErrors.headName = "Head name is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    }
  };

  const [tableData, setTableData] = useState([]);

  const getHeadList = async () => {
    try {
      setLoading(true);
      const payload = encryptPayload({ isActive: false });
      const res = await getAllHeadListService(payload);
      setTableData(res?.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHeadList();
  }, []);

  const handleEditClick = async (id) => {
    try {
      setLoading(true);
      const encrypted = encryptPayload({ headId: id });
      const res = await editHeadDataService(encrypted);

      if (res?.status === 200 && res?.data.outcome) {
        const data = res.data.data;
        setFormData({
          headId: data.headId,
          headName: data.headName || "",
          description: data.description || "",
        });
        setExpanded("panel1");
        setErrors({});
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [headStatusId, setHeadId] = useState(null);

  const handleConfirmStatus = async () => {
    try {
      setLoading(true);
      const payload = encryptPayload({ headId: headStatusId });
      const res = await toggleHeadStatusService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        setOpenModal(false);
        getHeadList();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const commonColumns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
      sortable: true,
    },
    {
      name: "Head Code",
      selector: (row) => row.headCode || "N/A",
      sortable: true,
    },
    {
      name: "Head Name",
      selector: (row) => row.headName || "N/A",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => (
        <p className="text-wrap">{row.description || "N/A"}</p>
      ),
    },
    {
      name: "Status",
      width: "100px",
      cell: (row) => (
        <span className={`px-2 py-1 rounded-sm text-xs ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      name: "Action",
      width: "120px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit" arrow>
            <button
              type="button"
              className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
              onClick={() => handleEditClick(row?.headId)}
            >
              <GoPencil className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip title={row.isActive ? "Active" : "Inactive"} arrow>
            <button
              className={`flex items-center justify-center h-8 w-8 rounded-full
                ${row.isActive
                  ? "bg-green-600/25 hover:bg-green-700/25 text-green-600"
                  : "bg-red-500/25 hover:bg-red-600/25 text-red-500"
                }`}
              onClick={() => {
                setOpenModal(true);
                setHeadId(row?.headId);
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
      {/* Accordion 1: Add/Edit Head Form */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          arrowcolor="#fff"
          sx={{ backgroundColor: "#f4f0f2" }}
        >
          <Typography component="span" sx={{ fontSize: "14px", color: "#141414" }}>
            {headId ? "Edit Head" : "Add Head"}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form
              className="grid grid-cols-12 gap-6"
              onSubmit={handleSubmitConfirmModal}
            >
              {/* Head Name Field */}
              <div className="col-span-3">
                <InputField
                  label="Head Name"
                  required={true}
                  name="headName"
                  placeholder="Enter head name"
                  value={formData.headName}
                  onChange={handleChangeInput}
                  error={errors?.headName}
                  maxLength={100}
                />
              </div>

              {/* Description Field */}
              <div className="col-span-6">
                <InputField
                  label="Description"
                  required={false}
                  name="description"
                  placeholder="Enter description"
                  textarea={true}
                  value={formData.description}
                  onChange={handleChangeInput}
                  error={errors?.description}
                  maxLength={255}
                />
              </div>

              {/* Form Actions */}
              <div className="col-span-3">
                <div className="flex justify-start items-center gap-2 text-[13px] mt-6">
                  <ResetBackBtn onClick={() => {
                    setFormData({
                      headId: null,
                      headName: "",
                      description: "",
                    });
                    setErrors({});
                  }} />
                  <SubmitBtn type="submit" btnText={headId ? "Update" : "Save"} />
                </div>
              </div>
            </form>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Accordion 2: Head List */}
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary sx={{ backgroundColor: "#f4f0f2" }}>
          <Typography component="span" sx={{ fontSize: "14px", color: "#141414" }}>
            Head List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={commonColumns} />
        </AccordionDetails>
      </Accordion>

      <ReusableDialog
        open={openModal}
        description="Are you sure you want to change status?"
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmStatus}
      />

      <ReusableDialog
        open={openSubmit}
        description="Are you sure you want to submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default GetHead;