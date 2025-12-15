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
  editMunicipality,
  getMunicipalityListService,
  saveUpdateMunicipalityService,
  toggleMunicipalityStatusService,
} from "../../services/municipalityService";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { avoidSpecialCharUtil, LGDutil } from "../../utils/validationUtils";
import { Tooltip } from "@mui/material";

const Municipality = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING

  const [formData, setFormData] = useState({
    municipalityName: "",
    remarks: "",
    lgdCode: "",
    districtId: "",
    municipalityId: null,
  });

  const { municipalityName, remarks, lgdCode, districtId, municipalityId } =
    formData;

  const [distList, setDistList] = useState([]);

  const getAllDistOptions = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getAllDists(payload);
      // console.log(res);
      setDistList(res?.data.data);
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
    if (!municipalityName) {
      newErrors.municipalityName = "Municipality name is required";
      setErrors(newErrors);
      return;
    }
    if (!lgdCode || !lgdCode.trim()) {
      newErrors.lgdCode = "Municipality LGD is required";
      setErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      const sendData = {
        municipalityName: municipalityName,
        remarks: remarks,
        lgdCode: lgdCode,
        district: {
          districtId: districtId,
        },
        municipalityId: municipalityId,
      };
      try {
        setOpenSubmit(false);
        const payload = encryptPayload(sendData);
        const res = await saveUpdateMunicipalityService(payload);
        console.log(res);
        if (res?.status === 200 && res?.data.outcome) {
          getTableData();
          setFormData({
            municipalityName: "",
            remarks: "",
            lgdCode: "",
            districtId: "",
          });
          toast.success(res?.data.message);
          setExpanded("panel2");
        }
      } catch (error) {
        throw error;
      }
    }
    console.log(formData);
  };
  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!districtId) {
      newErrors.districtId = "District name is required";
      setErrors(newErrors);
      return;
    }
    if (!municipalityName || !municipalityName.trim()) {
      newErrors.municipalityName = "Municipality name is required";
      setErrors(newErrors);
      return;
    }
    if (!lgdCode || !lgdCode.trim()) {
      newErrors.lgdCode = "Municipality LGD is required";
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
  const getTableData = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await getMunicipalityListService(payload);
      console.log(res?.data.data);
      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    }
  };

  const municipalityColumns = [
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
      name: "Municipality Name",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p className="text-slate-800">{row.municipalityName}</p> |{" "}
            <p>{row.municipalityCode}</p>
          </div>
        ) || "N/A",
    },
    {
      name: "LGD Code",
      selector: (row) => row.lgdCode || "N/A",
    },
    {
      name: "Remarks",
      selector: (row) => row.remarks || "N/A",
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
              // onClick={() => {console.log( row.districtId) }}
              onClick={() => {
                handleEditClick(row?.municipalityId);
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
                setMunicipalityStatusId(row?.municipalityId);
                setOpenModal(true);
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
      const payload = encryptPayload({
        municipalityId: id,
      });
      const res = await editMunicipality(payload);
      console.log(res?.data.data);
      const details = res?.data.data;

      if (details) {
        setFormData({
          municipalityName: details.municipalityName || "",
          remarks: details.remarks || "",
          lgdCode: details.lgdCode || "",
          districtId: details?.district.districtId || "",
          municipalityId: details.municipalityId || null,
        });
        setExpanded("panel1");
      }
    } catch (error) {
      throw error;
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [municipalityStatusId, setMunicipalityStatusId] = useState(null);

  const toggleStatus = async () => {
    setOpenModal(true);
    try {
      const payload = encryptPayload({ municipalityId: municipalityStatusId });
      const res = await toggleMunicipalityStatusService(payload);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        getTableData();
        setOpenModal(false);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getTableData();
    getAllDistOptions();
  }, []);

  return (
    <div className="mt-3">
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
            Add Municipality
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
                  label="District Name"
                  required={true}
                  name="districtId"
                  onChange={handleChangeInput}
                  options={distList?.map((d) => ({
                    value: d.districtId,
                    label: d.districtName,
                  }))}
                  value={districtId}
                  error={errors.districtId}
                  placeholder="Select"
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Municipality Name"
                  required={true}
                  name="municipalityName"
                  placeholder="Enter municipality name"
                  value={avoidSpecialCharUtil(municipalityName)}
                  onChange={handleChangeInput}
                  error={errors.municipalityName}
                  maxLength={50}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="LGD Code"
                  required={true}
                  name="lgdCode"
                  placeholder="Enter LGD code"
                  value={LGDutil(lgdCode)}
                  onChange={handleChangeInput}
                  error={errors.lgdCode}
                  maxLength={30}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="Description"
                  textarea={true}
                  name="remarks"
                  placeholder="Write remarks..."
                  value={remarks}
                  maxLength={255}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="col-span-3">
                <div className="flex justify-start gap-2 mt-7">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={municipalityId} />
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
            Municipality List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={municipalityColumns} />
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
        description="Are you sure you want submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default Municipality;
