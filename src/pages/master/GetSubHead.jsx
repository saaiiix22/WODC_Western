import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import { Tooltip } from "@mui/material";
import {
  getAllSubHeadListService,
  saveUpdateSubHeadService,
  editSubHeadDataService,
  toggleSubHeadStatusService,
} from "../../services/headService";
import { getAllHeadListService } from "../../services/headService";
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

const GetSubHead = () => {
  const [expanded, setExpanded] = useState("panel2");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("getSubHead");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING
  const [formData, setFormData] = useState({
    subHeadId: null,
    subHeadName: "",
    headId: "",
    isActive: true
  });

  const [headOptions, setHeadOptions] = useState([]);

  const { subHeadId, subHeadName, headId } = formData;
  const [errors, setErrors] = useState({});

  // Fetch heads for dropdown
  const getHeadList = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getAllHeadListService(payload);
      if (res?.status === 200 && res?.data.outcome) {
        const options = res.data.data.map(head => ({
          value: head.headId,
          label: `${head.headCode} - ${head.headName}`
        }));
        setHeadOptions(options);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getHeadList();
  }, []);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "subHeadName") {
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
    if (!formData.subHeadName.trim()) {
      newErrors.subHeadName = "Sub Head name is required";
    }

    if (!formData.headId) {
      newErrors.headId = "Head is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = encryptPayload({
        subHeadId: subHeadId,
        subHeadName: subHeadName,
        head: {
          headId: headId
        }
      });

      const res = await saveUpdateSubHeadService(payload);

      if (res?.data.outcome && res.status === 200) {
        setOpenSubmit(false);
        toast.success(res?.data.message);
        setExpanded("panel2");
        getSubHeadList();
        setFormData({
          subHeadId: null,
          subHeadName: "",
          headId: "",
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

    if (!formData.subHeadName.trim()) {
      newErrors.subHeadName = "Sub Head name is required";
    }

    if (!formData.headId) {
      newErrors.headId = "Head is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    }
  };

  const [tableData, setTableData] = useState([]);

  const getSubHeadList = async () => {
    try {
      setLoading(true);
      const payload = encryptPayload({ isActive: false });
      const res = await getAllSubHeadListService(payload);
      setTableData(res?.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubHeadList();
  }, []);

  const handleEditClick = async (id) => {
    try {
      setLoading(true);
      const encrypted = encryptPayload({ subHeadId: id });
      const res = await editSubHeadDataService(encrypted);

      if (res?.status === 200 && res?.data.outcome) {
        const data = res.data.data;
        setFormData({
          subHeadId: data.subHeadId,
          subHeadName: data.subHeadName || "",
          headId: data.head?.headId || "",
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
  const [subHeadStatusId, setSubHeadId] = useState(null);

  const handleConfirmStatus = async () => {
    try {
      setLoading(true);
      const payload = encryptPayload({ subHeadId: subHeadStatusId });
      const res = await toggleSubHeadStatusService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        setOpenModal(false);
        getSubHeadList();
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
      name: "Sub Head Code",
      selector: (row) => row.subHeadCode || "N/A",
      sortable: true,
    },
    {
      name: "Sub Head Name",
      selector: (row) => row.subHeadName || "N/A",
      sortable: true,
    },
    {
      name: "Head",
      selector: (row) => row.head ? `${row.head.headCode} - ${row.head.headName}` : "N/A",
      sortable: true,
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
              onClick={() => handleEditClick(row?.subHeadId)}
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
                setSubHeadId(row?.subHeadId);
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
      {/* Accordion 1: Add/Edit SubHead Form */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          arrowcolor="#fff"
          sx={{ backgroundColor: "#f4f0f2" }}
        >
          <Typography component="span" sx={{ fontSize: "14px", color: "#141414" }}>
            {subHeadId ? "Edit Sub Head" : "Add Sub Head"}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form
              className="grid grid-cols-12 gap-6"
              onSubmit={handleSubmitConfirmModal}
            >
              {/* Head Selection Field */}
              <div className="col-span-3">
                <SelectField
                  label="Head"
                  required={true}
                  name="headId"
                  options={headOptions}
                  value={formData.headId}
                  onChange={handleChangeInput}
                  error={errors?.headId}
                  placeholder="Select head"
                />
              </div>

              {/* Sub Head Name Field */}
              <div className="col-span-3">
                <InputField
                  label="Sub Head Name"
                  required={true}
                  name="subHeadName"
                  placeholder="Enter sub head name"
                  value={formData.subHeadName}
                  onChange={handleChangeInput}
                  error={errors?.subHeadName}
                  maxLength={100}
                />
              </div>

              {/* Form Actions */}
              <div className="col-span-3">
                <div className="flex justify-start items-center gap-2 text-[13px] mt-6">
                  <ResetBackBtn onClick={() => {
                    setFormData({
                      subHeadId: null,
                      subHeadName: "",
                      headId: "",
                    });
                    setErrors({});
                  }} />
                  <SubmitBtn type="submit" btnText={subHeadId ? "Update" : "Save"} />
                </div>
              </div>
            </form>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Accordion 2: SubHead List */}
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary sx={{ backgroundColor: "#f4f0f2" }}>
          <Typography component="span" sx={{ fontSize: "14px", color: "#141414" }}>
            Sub Head List
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

export default GetSubHead;