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
import {
  saveUpdateBlockService,
  getAllDists,
  getAllBlockListService,
  editBlockDataService,
  toggleBlockStatusService,
} from "../../services/blockService";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { avoidSpecialCharUtil, LGDutil } from "../../utils/validationUtils";
import Loader from "../../components/common/Loader";
import { Tooltip } from "@mui/material";

const Block = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [loading, setLoading] = useState(false);

  // FORM HANDLING

  const [formData, setFormData] = useState({
    districtId: "",
    remark: "",
    blockNameEN: "",
    blocklgdCode: "",
    blockId: null,
  });
  const { districtId, remark, blockNameEN, blocklgdCode, blockId } = formData;
  const [errors, setErrors] = useState({});

  const [distOptions, setDistOptions] = useState([]);
  const getAllDistsOptions = async () => {
    try {
      setLoading(true);
      const payload = encryptPayload({ isActive: true });
      const res = await getAllDists(payload);
      // console.log(res);
      setDistOptions(res?.data.data);
    } catch (error) {
      // throw error;
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    let updatedVal = value
    if(name === "blockNameEN"){
      updatedVal = avoidSpecialCharUtil(value)
    }
    if(name === "blocklgdCode"){
      updatedVal = LGDutil(value)
    }
    setFormData({ ...formData, [name]: updatedVal });
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const [openSubmit, setOpenSubmit] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!districtId) {
      newErrors.districtId = "District name is required";
      setErrors(newErrors);
      return;
    }

    if (!blockNameEN || !blockNameEN.trim()) {
      newErrors.blockNameEN = "Block name is required";
      setErrors(newErrors);
      return;
    }

    if (!blocklgdCode || !blocklgdCode.trim()) {
      newErrors.blocklgdCode = "LGD Code is required";
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const sendData = {
        blockNameEN: blockNameEN,
        remark: remark,
        blocklgdCode: blocklgdCode,
        district: {
          districtId: districtId,
        },
        blockId: blockId,
      };
      try {
        setLoading(true);
        setOpenSubmit(false);
        const payload = encryptPayload(sendData);

        const res = await saveUpdateBlockService(payload);

        if (res?.status === 200 && res?.data.outcome) {
          getAllBlockTableData();
          toast.success(res?.data.message);
          setFormData({
            districtId: "",
            remark: "",
            blockNameEN: "",
            blocklgdCode: "",
          });
          setExpanded("panel2");
        } else {
          toast.error(res?.data.message);
          setFormData({
            districtId: "",
            remark: "",
            blockNameEN: "",
            blocklgdCode: "",
          });
        }
      } catch (error) {
        // throw error;
        console.log(error);
      } finally {
        setLoading(false);
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

    if (!blockNameEN || !blockNameEN.trim()) {
      newErrors.blockNameEN = "Block name is required";
      setErrors(newErrors);
      return;
    }

    if (!blocklgdCode || !blocklgdCode.trim()) {
      newErrors.blocklgdCode = "LGD Code is required";
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
  const getAllBlockTableData = async () => {
    try {
      setLoading(true);
      const payload = encryptPayload({ isActive: false });
      const res = await getAllBlockListService(payload);
      // console.log(res?.data.data);
      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (id) => {
    try {
      setLoading(true);
      const payload = encryptPayload({ blockId: id });
      const res = await editBlockDataService(payload);
      console.log(res?.data.data);
      const details = res?.data.data;
      setFormData({
        districtId: details?.district?.districtId || "",
        remark: details?.remark || "",
        blockNameEN: details?.blockNameEN || "",
        blocklgdCode: details?.blocklgdCode || "",
        blockId: details.blockId || null,
      });
      setExpanded("panel1");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const [openModal, setOpenModal] = useState(false);
  const [blockStatusId, setBlockStatusId] = useState(null);

  const handleConfirmStatus = async () => {
    try {
      setLoading(true);

      const payload = encryptPayload({ blockId: blockStatusId });
      const res = await toggleBlockStatusService(payload);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        getAllBlockTableData();
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
    getAllBlockTableData();
  }, []);

  const blockColumn = [
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
      name: "Block Name",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p className="text-slate-800">{row.blockNameEN}</p> |{" "}
            {/* <p>{row.blockCode}</p> */}
            <p>{row.blocklgdCode}</p>
          </div>
        ) || "N/A",
    },
    // {
    //   name: "LGD Code",
    //   selector: (row) => row.blocklgdCode || "N/A",
    // },
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
          <Tooltip title="Edit" arrow>
            <button
              type="button"
              className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
              // onClick={() => {console.log( row.districtId) }}
              onClick={() => {
                handleEditClick(row?.blockId);
              }}
            >
              <GoPencil className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* ACTIVE / INACTIVE BUTTON */}
          <Tooltip title={row.isActive?"Active" : "Inactive"} arrow>
            <button
              className={`flex items-center justify-center h-8 w-8 rounded-full 
            ${
              row.isActive
                ? "bg-green-600/25 hover:bg-green-700/25 text-green-600"
                : "bg-red-500/25 hover:bg-red-600/25 text-red-500 "
            }`}
              // onClick={() => toggleStatus(row?.blockId)}
              onClick={() => {
                setBlockStatusId(row?.blockId);
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

  return (
    <div className="mt-3">
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
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
            Add Block
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
                  value={districtId}
                  onChange={handleChangeInput}
                  options={distOptions?.map((d) => ({
                    value: d.districtId,
                    label: d.districtName,
                  }))}
                  error={errors.districtId}
                  placeholder="Select"
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Block Name"
                  required={true}
                  name="blockNameEN"
                  placeholder="Enter block name"
                  value={blockNameEN}
                  onChange={handleChangeInput}
                  maxLength={50}
                  error={errors.blockNameEN}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="LGD Code"
                  required={true}
                  name="blocklgdCode"
                  placeholder="Enter LGD code"
                  value={blocklgdCode}
                  onChange={handleChangeInput}
                  error={errors.blocklgdCode}
                  maxLength={30}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="Description"
                  textarea={true}
                  name="remark"
                  placeholder="Write remarks..."
                  value={remark}
                  onChange={handleChangeInput}
                  error={errors.remark}
                  minLength={5}
                  maxLength={255}
                />
              </div>

              <div className="col-span-3">
                <div className="flex justify-start gap-2 mt-7 ">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={blockId} />
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
            Block List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={blockColumn} />
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

export default Block;
