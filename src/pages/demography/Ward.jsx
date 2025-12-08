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
  editWardListService,
  getMunicipalityViaDistrictsService,
  saveUpdateWardService,
  toggleWardStatusService,
  wardListService,
} from "../../services/wardService";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { avoidSpecialCharUtil } from "../../utils/validationUtils";

const Ward = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING

  const [formData, setFormData] = useState({
    districtId: "",
    municipalityId: "",
    wardName: "",
    remarks: "",
    wardId: null,
  });
  const { districtId, wardName, remarks, municipalityId, wardId } = formData;
  const [distOptions, setDistOptions] = useState([]);
  const [municipalityOptions, setMunicipalityOptions] = useState([]);
  const getDistOptions = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getAllDists(payload);
      console.log(res);

      setDistOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };
  const handleChangeInput = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "districtId") {
      try {
        const payload = encryptPayload({
          districtId: value,
          isActive: true,
        });
        const res = await getMunicipalityViaDistrictsService(payload);
        // console.log(res?.data.data);
        setMunicipalityOptions(res?.data.data);
      } catch (error) {
        throw error;
      }
    }
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const [errors, setErrors] = useState({});

  const [openSubmit, setOpenSubmit] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    let newErrors = {};

    if (!districtId) {
      newErrors.districtId = "District name is required";
      setErrors(newErrors);
      return;
    }
    if (!municipalityId || !municipalityId.trim()) {
      newErrors.municipalityId = "Municipality name is required";
      setErrors(newErrors);
      return;
    }
    if (!wardName || !wardName.trim()) {
      newErrors.wardName = "Ward name is required";
      setErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      const sendData = {
        wardName: wardName,
        remarks: remarks,
        municipality: {
          municipalityId: municipalityId,
        },
        wardId: wardId,
      };
      try {
        const payload = encryptPayload(sendData);
        const res = await saveUpdateWardService(payload);
        console.log(res);
        if (res?.status === 200 && res?.data.outcome) {
          setOpenSubmit(false);
          toast.success(res?.data.message);
          setFormData({
            districtId: "",
            municipalityId: "",
            wardName: "",
            remarks: "",
          });
          setExpanded("panel2");
          getTableData();
        } else {
          toast.error(res?.data.message);
          setFormData({
            districtId: "",
            municipalityId: "",
            wardName: "",
            remarks: "",
          });
        }
      } catch (error) {
        throw error;
      }
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
    if (!municipalityId || !municipalityId.trim()) {
      newErrors.municipalityId = "Municipality name is required";
      setErrors(newErrors);
      return;
    }
    if (!wardName || !wardName.trim()) {
      newErrors.wardName = "Ward name is required";
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
      const res = await wardListService(payload);
      // console.log(res?.data.data);
      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    }
  };
  // console.log(tableData);

  const wardColumns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "District Name",
      selector: (row) => row.municipality.district.districtName || "N/A",
    },
    {
      name: "Municipality Name",
      selector: (row) => row.municipality.municipalityName || "N/A",
    },
    {
      name: "Ward Name ",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p className="text-slate-800">{row.wardName}</p> |{" "}
            <p>{row.wardCode}</p>
          </div>
        ) || "N/A",
      sortable: true,
    },
    {
      name: "Remarks",
      selector: (row) => row.remarks || "N/A",
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
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
            onClick={() => {
              handleEditClick(row?.wardId);
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
              setSelectedWardId(row?.wardId);
              // toggleStatus(row?.wardId)
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const toggleStatus = async (id) => {
    try {
      const payload = encryptPayload({ wardId: id });
      const res = await toggleWardStatusService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        getTableData();
      } else {
        toast.error(res?.data.message);
      }
    } catch (error) {
      throw error;
    }
  };
  const handleConfirmStatus = async () => {
    try {
      const payload = encryptPayload({ wardId: selectedWardId });
      const res = await toggleWardStatusService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        getTableData();
      } else {
        toast.error(res?.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setOpenModal(false);
      setSelectedWardId(null);
    }
  };
  const handleEditClick = async (id) => {
    try {
      const payload = encryptPayload({ wardId: id });
      const res = await editWardListService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        getTableData();
        const wardDetails = res?.data.data;

        if (wardDetails) {
          const distId = wardDetails.municipality.district.districtId;

          setFormData({
            districtId: distId,
            municipalityId: wardDetails.municipality.municipalityId || "",
            wardName: wardDetails.wardName || "",
            remarks: wardDetails.remarks || "",
            wardId: wardDetails.wardId || null,
          });

          const muniPayload = encryptPayload({
            districtId: distId,
            isActive: true,
          });
          const muniRes = await getMunicipalityViaDistrictsService(muniPayload);

          setMunicipalityOptions(muniRes?.data?.data || []);

          setExpanded("panel1");
        }
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getDistOptions();
    getTableData();
  }, []);

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
            Add Ward
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
                  placeholder="Select an option"
                />
              </div>

              <div className="col-span-2">
                <SelectField
                  label="Municipality Name"
                  required={true}
                  name="municipalityId"
                  value={municipalityId}
                  onChange={handleChangeInput}
                  options={municipalityOptions?.map((m) => ({
                    value: m.municipalityId,
                    label: m.municipalityName,
                  }))}
                  disabled={districtId ? false : true}
                  error={errors.municipalityId}
                  placeholder="Select an option"
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Ward Name"
                  required={true}
                  name="wardName"
                  placeholder="Enter Ward Name"
                  value={avoidSpecialCharUtil(wardName)}
                  onChange={handleChangeInput}
                  error={errors.wardName}
                  maxLength={20}
                />
              </div>

              <div className="col-span-4">
                <InputField
                  label="Description"
                  textarea={true}
                  name="remarks"
                  placeholder="Write Remarks..."
                  value={remarks}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-2">
                <div className="flex justify-start gap-2 text-[13px] mt-7">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={wardId} />
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
            Ward List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={wardColumns} />
        </AccordionDetails>
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
      </Accordion>
    </div>
  );
};

export default Ward;
