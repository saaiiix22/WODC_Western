import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { FiFileText } from "react-icons/fi";
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
  getGpByBlockService,
  getVillageByVillageIdService,
  getVillageListService,
  saveOrUpdateBlockService,
  updateVillageStatusService,
} from "../../services/villageService";
import { getBlockThroughDistrictService } from "../../services/gpService";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { avoidSpecialCharUtil } from "../../utils/validationUtils";

const VillagePage = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING

  const [formData, setFormData] = useState({
    blockId: "",
    distrcitId: "",

    villageId: null,
    villageNameEn: "",
    villageLgdCode: "",
    remarks: "",
    gpId: "",
  });
  const {
    districtId,
    villageId,
    villageLgdCode,
    remarks,
    gpId,
    blockId,
    villageNameEn,
  } = formData;

  const [blockOptions, setblockOptions] = useState([]);
  const [gpOptions, setGpOptions] = useState([]);

  const handleChangeInput = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "districtId") {
      try {
        const payload = encryptPayload({
          districtId: value,
          isActive: true,
        });
        const res = await getBlockThroughDistrictService(payload);
        console.log(res?.data.data);
        setblockOptions(res?.data.data);
      } catch (error) {
        throw error;
      }
    }
    if (name === "blockId") {
      try {
        const payload = encryptPayload({
          blockId: value,
          isActive: true,
        });
        const res = await getGpByBlockService(payload);
        console.log(res);
        setGpOptions(res?.data.data);
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

    let newErrors = {};

    if (!districtId) {
      newErrors.districtId = "District name is required";
      setErrors(newErrors);
      return;
    }
    if (!blockId || !blockId.trim()) {
      newErrors.blockId = "Block name is required";
      setErrors(newErrors);
      return;
    }
    if (!gpId || !gpId.trim()) {
      newErrors.gpId = "Gram Panchayat name is required";
      setErrors(newErrors);
      return;
    }

    if (!villageNameEn || !villageNameEn.trim()) {
      newErrors.villageNameEn = "Village name is required";
      setErrors(newErrors);
      return;
    }
    if (!villageLgdCode || !villageLgdCode.trim()) {
      newErrors.villageLgdCode = "Village LGD Code is required";
      setErrors(newErrors);
      return;
    }
    if (Object.keys(newErrors).length === 0) {
      const sendData = {
        villageId: villageId,
        villageNameEn: villageNameEn,
        villageLgdCode: villageLgdCode,
        remarks: remarks,
        gp: {
          gpId: gpId,
        },
      };
      try {
        setOpenSubmit(false);
        const payload = encryptPayload(sendData);
        const res = await saveOrUpdateBlockService(payload);
        console.log(res);
        if (res?.status === 200 && res?.data.outcome) {
          getTableData();
          toast.success(res?.data.message);
          setFormData({
            blockId: "",
            distrcitId: "",

            villageId: null,
            villageNameEn: "",
            villageLgdCode: "",
            remarks: "",
            gpId: "",
          });
          setExpanded("panel2");
        } else {
          setFormData({
            blockId: "",
            distrcitId: "",

            villageId: null,
            villageNameEn: "",
            villageLgdCode: "",
            remarks: "",
            gpId: "",
          });
          toast.error(res?.data.message);
        }
      } catch (error) {
        throw error;
      }
    }
    // console.log(sendData);
  };
  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!districtId) {
      newErrors.districtId = "District name is required";
      setErrors(newErrors);
      return;
    }
    if (!blockId || !blockId.trim()) {
      newErrors.blockId = "Block name is required";
      setErrors(newErrors);
      return;
    }
    if (!gpId || !gpId.trim()) {
      newErrors.gpId = "Gram Panchayat name is required";
      setErrors(newErrors);
      return;
    }

    if (!villageNameEn || !villageNameEn.trim()) {
      newErrors.villageNameEn = "Village name is required";
      setErrors(newErrors);
      return;
    }
    if (!villageLgdCode || !villageLgdCode.trim()) {
      newErrors.villageLgdCode = "Village LGD Code is required";
      setErrors(newErrors);
      return;
    }
    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    } else {
      setOpenSubmit(false);
    }
  };

  const [distOptions, setDistOptions] = useState([]);
  const getDistOptions = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getAllDists(payload);
      setDistOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };
  const [tableData, setTableData] = useState([]);
  const getTableData = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await getVillageListService(payload);
      // console.log(res);
      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    }
  };
  const villageColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "District",
      selector: (row) => row.gp.block.district.districtName || "N/A",
      sortable: true,
    },
    {
      name: "Block Name",
      selector: (row) => row.gp.block.blockNameEN || "N/A",
      sortable: true,
    },
    {
      name: "Gram Panchayat Name",
      selector: (row) => row.gp.gpNameEN || "N/A",
    },
    {
      name: "Village Name",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p className="text-slate-800">{row.villageNameEn}</p> |{" "}
            <p>{row.villageCode}</p>
          </div>
        ) || "N/A",
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
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
            // onClick={() => {console.log( row.districtId) }}
            onClick={() => {
              handleEditClick(row?.villageId);
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
              setVillageStatusId(row?.villageId);
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
  const [openModal, setOpenModal] = useState(false);
  const [villageStatusId, setVillageStatusId] = useState(null);
  const toggleStatus = async () => {
    try {
      const payload = encryptPayload({
        villageId: villageStatusId,
      });
      const res = await updateVillageStatusService(payload);
      // console.log(res);
      if (res.status && res?.data.outcome) {
        toast.success(res?.data.message);
        getTableData();
        setOpenModal(false);
      } else {
        toast.error(res?.data.message);
      }
    } catch (error) {
      throw error;
    }
  };
  const handleEditClick = async (id) => {
    try {
      const payload = encryptPayload({ villageId: id });
      const res = await getVillageByVillageIdService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        const details = res.data.data;

        const distId = details.gp.block.district.districtId;
        const blkId = details.gp.block.blockId;
        const gpIdFetched = details.gp.gpId;

        setFormData((prev) => ({
          ...prev,
          districtId: distId,
        }));

        const blockPayload = encryptPayload({
          districtId: distId,
          isActive: true,
        });
        const blockRes = await getBlockThroughDistrictService(blockPayload);
        setblockOptions(blockRes.data.data || []);

        setFormData((prev) => ({
          ...prev,
          blockId: blkId,
        }));

        const gpPayload = encryptPayload({
          blockId: blkId,
          isActive: true,
        });
        const gpRes = await getGpByBlockService(gpPayload);
        setGpOptions(gpRes.data.data || []);

        setFormData((prev) => ({
          ...prev,
          gpId: gpIdFetched,
          villageId: details.villageId,
          villageNameEn: details.villageNameEn || "",
          villageLgdCode: details.villageLgdCode || "",
          remarks: details.remarks || "",
        }));

        setExpanded("panel1");
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
            Add Village
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form className="grid grid-cols-12 gap-6" onSubmit={handleSubmitConfirmModal}>
              <div className="col-span-3">
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

              <div className="col-span-3">
                <SelectField
                  label="Block Name"
                  required={true}
                  name="blockId"
                  value={blockId}
                  onChange={handleChangeInput}
                  options={blockOptions?.map((m) => ({
                    value: m.blockId,
                    label: m.blockNameEN,
                  }))}
                  disabled={districtId ? false : true}
                  error={errors.blockId}
                  placeholder="Select an option"
                />
              </div>

              <div className="col-span-3">
                <SelectField
                  label="Gram Panchayat Name"
                  required={true}
                  name="gpId"
                  value={gpId}
                  onChange={handleChangeInput}
                  options={gpOptions?.map((m) => ({
                    value: m.gpId,
                    label: m.gpNameEN,
                  }))}
                  disabled={blockId ? false : true}
                  error={errors.gpId}
                  placeholder="Select an option"
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="Village Name"
                  required={true}
                  name="villageNameEn"
                  placeholder="Village Name"
                  value={avoidSpecialCharUtil(villageNameEn)}
                  onChange={handleChangeInput}
                  error={errors.villageNameEn}
                  maxLength={30}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="Village LGD Code"
                  required={true}
                  name="villageLgdCode"
                  placeholder="Village LGD Code"
                  value={villageLgdCode}
                  onChange={handleChangeInput}
                  error={errors.villageLgdCode}
                  maxLength={30}
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
                  maxLength={500}
                  // error={errors.remark}
                />
              </div>

              <div className="col-span-2">
                <div className="flex justify-start gap-2 mt-7">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={villageId} />
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
            Village List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={villageColumn} />
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

export default VillagePage;
