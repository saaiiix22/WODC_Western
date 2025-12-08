import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
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
import {
  saveUpdateBlockService,
  getAllDists,
  getAllBlockListService,
  editBlockDataService,
  toggleBlockStatusService,
} from "../../services/blockService";
import {
  editGpService,
  getBlockThroughDistrictService,
  getGpListService,
  saveUpdateGpService,
  toggleGpStatusService,
} from "../../services/gpService";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { avoidSpecialCharUtil } from "../../utils/validationUtils";

const GramPanchayatPage = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [loading, setLoading] = useState(false);

  // FORM HANDLING

  const [formData, setFormData] = useState({
    gpNameEN: "",
    remark: "",
    blockId: "",
    districtId: "",
    gpId: null,
    gpLgdCode: "",
  });
  const { districtId, gpNameEN, blockId, remark, gpLgdCode, gpId } = formData;

  const [distList, setDistList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const getAllDistsOptions = async () => {
    try {
      setLoading(true);
      const payload = encryptPayload({ isActive: true });
      const res = await getAllDists(payload);
      setDistList(res?.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeInput = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "districtId") {
      try {
        setLoading(true);
        const payload = encryptPayload({ isActive: true, districtId: value });
        const res = await getBlockThroughDistrictService(payload);
        console.log(res?.data.data);
        setBlockList(res?.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
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

    const sendData = {
      gpNameEN: gpNameEN,
      remarks: remark,
      gpLgdCode: gpLgdCode,
      block: {
        blockId: blockId,
      },
      gpId: gpId,
    };

    try {
      setLoading(true);
      setOpenSubmit(false);
      const payload = encryptPayload(sendData);
      const res = await saveUpdateGpService(payload);
      console.log(res);
      if (res?.data.data && res?.data.outcome && res.status === 200) {
        getGpTableList();
        toast.success(res?.data.message);
        setFormData({
          gpNameEN: "",
          remark: "",
          blockId: "",
          districtId: "",
          gpLgdCode: "",
          gpId: null,
        });
        setExpanded("panel2");
      } else {
        toast.error(res?.data.message);
        setFormData({
          gpNameEN: "",
          remark: "",
          blockId: "",
          districtId: "",
          gpLgdCode: "",
          gpId: null,
        });
      }
    } catch (error) {
      // throw error;
      console.log(error);
    } finally {
      setLoading(false);
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
    if (!blockId || !blockId.trim()) {
      newErrors.blockId = "Block name is required";
      setErrors(newErrors);
      return;
    }

    if (!gpNameEN || !gpNameEN.trim()) {
      newErrors.gpNameEN = "Gram panchanyat name is required";
      setErrors(newErrors);
      return;
    }

    if (!gpLgdCode || !gpLgdCode.trim()) {
      newErrors.gpLgdCode = "Gram panchanyat LGD Code is required";
      setErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    } else {
      setOpenSubmit(true);
    }
  };

  const [tableData, setTableData] = useState([]);
  const getGpTableList = async () => {
    try {
      setLoading(true);
      const payload = encryptPayload({ isActive: false });
      const res = await getGpListService(payload);
      console.log(res?.data.data);
      setTableData(res?.data.data || []);
    } catch (error) {
      // throw error;
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const gpColumns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "District ",
      selector: (row) => row.block.district.districtName || "N/A",
      sortable: true,
    },
    {
      name: "Block",
      selector: (row) => row.block.blockNameEN || "N/A",
    },
    {
      name: "GP Name",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p className="text-slate-800">{row.gpNameEN}</p> |{" "}
            <p>{row.gpCode}</p>
          </div>
        ) || "N/A",
    },
    {
      name: "Status",
      selector: (row) => (row.isActive ? "Active" : "Inactive"),
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
            onClick={() => {
              handleEditClick(row?.gpId);
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
              setGpStatusId(row?.gpId);
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

  const handleEditClick = async (id) => {
    try {
      setLoading(true);
      const payload = encryptPayload({ gpId: id });
      const res = await editGpService(payload);
      const details = res?.data.data;
      console.log(details);

      setFormData((prev) => ({
        ...prev,
        districtId: details?.block?.district?.districtId || "",
        blockId: "",
        gpNameEN: details?.gpNameEN || "",
        remark: details?.remarks || "",
        gpLgdCode: details?.gpLgdCode || "",
        gpId: details?.gpId || null,
      }));

      const blockPayload = encryptPayload({
        isActive: true,
        districtId: details?.block?.district?.districtId,
      });
      const blockRes = await getBlockThroughDistrictService(blockPayload);

      setBlockList(blockRes?.data.data || []);

      setFormData((prev) => ({
        ...prev,
        blockId: details?.block?.blockId || "",
      }));
      setExpanded("panel1");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [gpStatusId, setGpStatusId] = useState(null);
  const toggleStatus = async () => {
    setOpenModal(true);
    try {
      setLoading(true);
      const payload = encryptPayload({ gpId: gpStatusId });
      const res = await toggleGpStatusService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        getGpTableList();
        toast.success(res?.data.message);
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDistsOptions();
    getGpTableList();
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
            Add Gram Panchayat
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
                  onChange={handleChangeInput}
                  options={distList?.map((d) => ({
                    value: d.districtId,
                    label: d.districtName,
                  }))}
                  value={districtId}
                  error={errors.districtId}
                  placeholder="Select an option"
                />
              </div>

              <div className="col-span-2">
                <SelectField
                  label="Select Block"
                  required={true}
                  name="blockId"
                  onChange={handleChangeInput}
                  options={blockList?.map((d) => ({
                    value: d.blockId,
                    label: d.blockNameEN,
                  }))}
                  value={blockId}
                  disabled={districtId ? false : true}
                  error={errors.blockId}
                  placeholder="Select an option"
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Gram Panchayat Name"
                  required={true}
                  name="gpNameEN"
                  placeholder="Enter Gram Panchayat Name"
                  value={avoidSpecialCharUtil(gpNameEN)}
                  onChange={handleChangeInput}
                  error={errors.gpNameEN}
                  maxLength={50}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="LGD Code"
                  required={true}
                  name="gpLgdCode"
                  placeholder="Enter LGD Code"
                  value={gpLgdCode}
                  onChange={handleChangeInput}
                  error={errors.gpLgdCode}
                  maxLength={50}
                />
              </div>

              <div className="col-span-4">
                <InputField
                  label="Description"
                  textarea={true}
                  name="remark"
                  placeholder="Write Remarks..."
                  value={remark}
                  onChange={handleChangeInput}
                  maxLength={500}
                  minLength={10}
                />
              </div>
              <div className="col-span-12">
                <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md ">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={gpId} />
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
            Gram Panchayat List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={gpColumns} />
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

export default GramPanchayatPage;
