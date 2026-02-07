import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import InputField from "../../../components/common/InputField";
import Tooltip from "@mui/material/Tooltip";
import {
  districtList,
  getDistById,
  saveDistrictService,
  updateStatus,
} from "../../../services/demographyService";
import { encryptPayload } from "../../../crypto.js/encryption";
import { toast } from "react-toastify";
import ReusableDataTable from "../../../components/common/ReusableDataTable";
import { useEffect } from "react";
import { GoPencil } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import ReusableDialog from "../../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../../components/common/CommonAccordion";
import {
  ResetBackBtn,
  SubmitBtn,
} from "../../../components/common/CommonButtons";
import {
  avoidSpecialCharUtil,
  cleanStringUtil,
  LGDutil,
} from "../../../utils/validationUtils";
import districtFormFields from './district.json'
import { useTranslation } from "react-i18next";
import { sanitizeInputUtil } from "../../../utils/sanitizeInputUtil";

const GetDistrict = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [loading, setLoading] = useState(false);

  // FORM HANDLING

  const {t} = useTranslation("getDistrict")

  const [formData, setFormData] = useState({
    districtName: "",
    districtlgdCode: "",
    remark: "",
    districtId: null,
  });
  const { districtName, districtlgdCode, remark, districtId, } = formData;
  const [errors, setErrors] = useState({});

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "districtName") {
      updatedValue = avoidSpecialCharUtil(value);
    }
    if (name === "districtlgdCode") {
      updatedValue = LGDutil(value);
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
    if (!formData.districtName.trim()) {
      newErrors.districtName = "District name is required";
      setErrors(newErrors);
      return;
    }

    if (!formData.districtlgdCode.trim()) {
      newErrors.districtlgdCode = "District lgd code is required";
      setErrors(newErrors);
      return;
    }


    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const payload = encryptPayload({
          districtId: districtId,
          districtName: districtName,
          districtlgdCode: districtlgdCode,
          remark: remark,
        });
        const res = await saveDistrictService(payload);
        // console.log(res);
        if (res?.data.outcome && res.status === 200) {
          setOpenSubmit(false);
          toast.success(res?.data.message);
          setExpanded("panel2");
          getDistrictList();
          setFormData({
            districtName: "",
            remark: "",
            districtId: null,
            districtlgdCode: "",
          });
        } else {
          setOpenSubmit(false);
          toast.error(res?.data.message);
          setFormData({
            districtName: "",
            remark: "",
            districtlgdCode: "",
            districtId: null,
          });
        }
        setLoading(false);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };
  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();

    let newErrors = {};


    if (!formData.districtName.trim()) {
      newErrors.districtName = "District name is required";
      setErrors(newErrors);
      return;
    }

    if (!formData.districtlgdCode) {
      newErrors.districtlgdCode = "District lgd code is required";
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    } else {
      setOpenSubmit(false);
    }
  };

  const [tableData, setTableData] = useState([]);
  const getDistrictList = async () => {
    try {
      setLoading(true);
      const payload = encryptPayload({ isActive: false });
      const res = await districtList(payload);
      // console.log(res);
      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getDistrictList();
  }, []);

  const commonColumns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
      sortable: true,
    },
    {
      name: "District Name",

      selector: (row) =>
        (
          <div className="flex gap-1">
            <p>{row.districtlgdCode}</p> |{" "}
            <p className="text-slate-800">{row.districtName}</p>
          </div>
        ) || "N/A",
    },

    {
      name: "Status",
      // selector: (row) => (row.isActive ? "Active" : "Inactive"),
      width: "100px",
      cell: (row) => (
        <span className={`px-2 py-1 rounded-sm text-xs ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      name: "Remarks",
      selector: (row) => <p className="text-wrap">{row.remark || "N/A"}</p>,
      sortable: true,
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
              onClick={() => {
                handleEditClick(row?.districtId);
              }}
            >
              <GoPencil className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* ACTIVE / INACTIVE BUTTON */}

          <Tooltip title={row.isActive ? "Active" : "Inactive"} arrow>
            <button
              className={`flex items-center justify-center h-8 w-8 rounded-full
           ${row.isActive
                  ? "bg-green-600/25 hover:bg-green-700/25 text-green-600"
                  : "bg-red-500/25 hover:bg-red-600/25 text-red-500 "
                }`}
              onClick={() => {
                setOpenModal(true);
                setDistrictId(row?.districtId);
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

  const handleEditClick = async (id) => {
    try {
      setLoading(true);
      const encrypted = encryptPayload({ districtId: id });

      const res = await getDistById(encrypted);
      console.log(res);

      if (res?.status === 200 && res?.data.outcome) {
        const data = res.data.data;
        setFormData({
          districtId: data.districtId,
          districtName: data.districtName || "",
          districtlgdCode: data.districtlgdCode || "",
          remark: data.remark || "",
        });

        setExpanded("panel1");
        setErrors({})
      } else {
        // toast.error(res?.data.message);
        console.log(error);

      }
      // console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const [openModal, setOpenModal] = useState(false);
  const [districtStatusId, setDistrictId] = useState(null);
  const handleConfirmStatus = async () => {
    try {
      setLoading(true);
      const payload = encryptPayload({ districtId: districtStatusId });
      const res = await updateStatus(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        setOpenModal(false);
      }
      getDistrictList();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
              color: "#141414",
            }}
          >
            Add District
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form
              className="grid grid-cols-12 gap-6"
              onSubmit={handleSubmitConfirmModal}
            >
              {districtFormFields.map((field) => (
                <div key={field.name} className={`col-span-${field.colSpan}`}>
                  <InputField
                    label={t(field.label)}
                    required={field.required}
                    name={field.name}
                    placeholder={field.placeholder}
                    textarea={field.textarea}
                    maxLength={field.maxLength}
                    value={formData[field.name]}
                    onChange={handleChangeInput}
                    error={errors?.[field.name]}
                  />
                </div>
              ))}

              <div className="col-span-3">
                <div className="flex justify-start items-center gap-2 text-[13px] mt-6">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={districtId} />
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
              color: "#141414",
            }}
          >
            District List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={commonColumns} />
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

export default GetDistrict;
