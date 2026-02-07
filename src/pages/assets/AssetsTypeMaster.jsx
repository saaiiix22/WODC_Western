import React, { useEffect, useState } from "react";
import InputField from "../../components/common/InputField";
import { Tooltip, Typography } from "@mui/material";
import { GoEye, GoPencil } from "react-icons/go";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import ReusableDialog from "../../components/common/ReusableDialog";
import SelectField from "../../components/common/SelectField";
import { SubmitBtn } from "../../components/common/CommonButtons";
import {
  getAssetsTypeByIdService,
  getAssetsTypeListService,
  saveUpdateAssetsTypeService,
} from "../../services/assetsService";
import { toast } from "react-toastify";
import {  encryptPayload } from "../../crypto.js/encryption";

const AssetsTypeMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [expanded, setExpanded] = useState("panel2");
  const [openSubmit, setOpenSubmit] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    assetsTypeId: null,
    assetsTypeName: "",
    assetsTypeCode: "",
    assetsTypeDesc: "",
    active: true,
  });

  const { assetsTypeId, assetsTypeName, assetsTypeCode, assetsTypeDesc, active } =
    formData;

  {
    /* ---------------------------------------API Bindings ------------------------------------ */
  }

  const fetchAssetsTypeList = async () => {
    try {
      // const payload = encryptPayload({ isActive: false });
      // const res = await getAssetsTypeListService(payload);

      const res = await getAssetsTypeListService();

      if (res?.status === 200 && res?.data.outcome) {
        setTableData(res.data.data || []);
      } else {
        toast.error(res?.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  {
    /* --------------------------------------Handler Functions ------------------------------------ */
  }

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!assetsTypeName || !assetsTypeName.trim()) {
      newErrors.assetsTypeName = "Assets Type name is required";
      setErrors(newErrors);
      return;
    }
    if (!assetsTypeCode || !assetsTypeCode.trim()) {
      newErrors.assetsTypeCode = "Assets Type code is required";
      setErrors(newErrors);
      return;
    }
    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    // ✅ SAFE: functional update
    setFormData((prev) => {
      // Auto-generate code ONLY for new records
      if (name === "assetsTypeName" && !prev.assetsTypeId) {
        return {
          ...prev,
          assetsTypeName: value,
          assetsTypeCode: generateAssetsTypeCode(value),
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      setOpenSubmit(false);

      // 🔒 GUARANTEE CODE EXISTS
      const finalCode =
        assetsTypeCode && assetsTypeCode.trim()
          ? assetsTypeCode
          : generateAssetsTypeCode(assetsTypeName);

      if (!finalCode) {
        toast.error("Unable to generate Assets Type Code");
        return;
      }

      const sendData = {
        assetsTypeId,
        assetsTypeName,
        assetsTypeCode: finalCode, // ✅ NEVER NULL
        assetsTypeDesc,
        active,
      };

      const payload = encryptPayload(sendData)

      const res = await saveUpdateAssetsTypeService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res.data.message);
        resetForm();
        setErrors({});
        fetchAssetsTypeList();
        setExpanded("panel2");
      } else {
        toast.error(res?.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (assetsTypeId) => {
    try {
      const sendData = {"assetsTypeId":assetsTypeId};
      const payload=encryptPayload(sendData);
      const res = await getAssetsTypeByIdService(payload);

      if (res?.status == 200 && res?.data.outcome) {
        setFormData(res.data.data);
        setExpanded("panel1");
        setErrors({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateAssetsTypeCode = (TypeName) => {
    if (!TypeName || TypeName.trim().length < 3) return "";

    const prefix = TypeName
      .replace(/\s+/g, "") // remove spaces
      .substring(0, 3) // first 3 letters
      .toUpperCase();

    const randomNumber = Math.floor(100 + Math.random() * 900); // 3-digit

    return `${prefix}${randomNumber}`;
  };

  const resetForm = () => {
    setFormData({
      assetsTypeId: null,
      assetsTypeName: "",
      assetsTypeCode: "",
      assetsTypeDesc: "",
      active: true,
    });
  };

  const assetsTypeColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Type Name",
      selector: (row) => row.assetsTypeName || "N/A",
      width: "180px",
      sortable: true,
    },
    {
      name: " Code",
      selector: (row) => row.assetsTypeCode || "N/A",
      width:"120px",
      sortable: true,
    },
    {
      name: "Asset Type Description",
      minWidth:"180px",
      selector: (row) => row.assetsTypeDesc || "N/A",
    },
    {
      name: "Active Status",
      width:"120px",
      selector: (row) => (row.active ? "Active" : "Inactive"),
    },
    {
      name: "Action",
      width: "160px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* <Tooltip title="View Asset">
            <button className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <GoEye />
            </button>
          </Tooltip> */}

          <Tooltip title="Edit Asset">
            <button className="h-8 w-8 rounded-full bg-blue-500/25 text-blue-600 flex items-center justify-center">
              <GoPencil onClick={() => handleEdit(row.assetsTypeId)} />
            </button>
          </Tooltip>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
    },
  ];

  const statusOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  {
    /*-------------------Redering List--------------------- */
  }
  useEffect(() => {
    fetchAssetsTypeList();
  }, []);

  return (
    <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {/* ================= ADD / UPDATE FORM ================= */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary sx={{ backgroundColor: "#f4f0f2" }}>
          <Typography sx={{ fontSize: "14px", color: "#2c0014" }}>
            Add Assets Type
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          {/* ✅ SINGLE FORM ONLY */}
          <form
            className="grid grid-cols-12 gap-6 p-3"
            onSubmit={handleSubmitConfirmModal}
          >
            <div className="col-span-2">
              <InputField
                label="Assets Type"
                required
                name="assetsTypeName"
                placeholder="Assets Type Name"
                value={assetsTypeName}
                onChange={handleInputChange}
                error={errors.assetsTypeName}
              />
            </div>

            <div className="col-span-2">
              <InputField
                label="Assets Type Code"
                type="text"
                required
                name="assetsTypeCode"
                value={assetsTypeCode}
                onChange={handleInputChange}
                error={errors.assetsTypeCode}
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label="Status"
                name="active"
                options={statusOptions}
                value={String(active)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    active:
                      e.target.value === "true" || e.target.value === true,
                  })
                }
                required
              />
            </div>

            <div className="col-span-4">
              <InputField
                label="Assets Type Description"
                type="text-area"
                name="assetsTypeDesc"
                value={assetsTypeDesc}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="col-span-12">
              <div className="flex justify-center gap-2 bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
                <SubmitBtn
                  type="submit"
                  btnText={assetsTypeId ? "Update" : "Save"}
                />
              </div>
            </div>
          </form>
        </AccordionDetails>
      </Accordion>

      {/* ================= LIST ================= */}
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary sx={{ backgroundColor: "#f4f0f2" }}>
          <Typography sx={{ fontSize: "14px", color: "#2c0014" }}>
            Assets Type List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={assetsTypeColumn} />
        </AccordionDetails>
      </Accordion>

      {/* ================= CONFIRM DIALOG ================= */}
      <ReusableDialog
        open={openSubmit}
        description="Are you sure you want to submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default AssetsTypeMaster;
