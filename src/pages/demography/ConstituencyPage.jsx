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
  constituencyListService,
  editConstituencyService,
  saveUpdateConstituency,
  toggleConstituencyStatusService,
} from "../../services/constituencyService";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { avoidSpecialCharUtil } from "../../utils/validationUtils";

const ConstituencyPage = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING

  const [formData, setFormData] = useState({
    consId: null,
    consName: "",
    remarks: "",
    districtId: "",
  });
  const { consId, consName, remarks, districtId } = formData;

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

  const handleChangeInput = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);
  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!districtId) {
      newErrors.districtId = "District name is required";
      setErrors(newErrors);
      return;
    }

    if (!consName || !consName.trim()) {
      newErrors.consName = "Constituency name is required";
      setErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    } else {
      setOpenSubmit(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = {
      consId: consId,
      consName: consName,
      remarks: remarks,
      district: {
        districtId: districtId,
      },
    };
    try {
      const payload = encryptPayload(sendData);
      const res = await saveUpdateConstituency(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        getTableData();
        toast.success(res?.data.message);
        setFormData({
          consId: null,
          consName: "",
          remarks: "",
          districtId: "",
        });
        setOpenSubmit(false);

        setExpanded("panel2");
      } else {
        toast.error(res?.data.message);
        setFormData({
          consId: null,
          consName: "",
          remarks: "",
          districtId: "",
        });
      }
    } catch (error) {
      toast.error(res?.data.message);
      throw error;
    }
    // console.log(sendData);
  };

  const [tableData, setTableData] = useState([]);
  const getTableData = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await constituencyListService(payload);
      console.log(res);

      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    }
  };

  const constituencyColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "District Name",
      selector: (row) => row.district.districtName || "N/A",
    },
    {
      name: "Constituency Name",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p className="text-slate-800">{row.consName}</p> |{" "}
            <p>{row.consCode}</p>
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
              handleEditClick(row?.consId);
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
              setConstituencyStatusId(row?.consId);
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
  const [constituencyStatusId, setConstituencyStatusId] = useState(null);
  const toggleStatus = async () => {
    setOpenModal(false);
    try {
      const payload = encryptPayload({ consId: constituencyStatusId });
      const res = await toggleConstituencyStatusService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        getTableData();
        toast.success(res?.data.message);
      }
    } catch (error) {
      throw error;
    }
  };
  const handleEditClick = async (id) => {
    try {
      const payload = encryptPayload({
        consId: id,
      });
      const res = await editConstituencyService(payload);
      console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        const details = res?.data.data;
        setFormData({
          consId: details?.consId || null,
          consName: details?.consName || "",
          remarks: details?.remarks || "",
          districtId: details?.district.districtId || "",
        });
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
            Add Constituency
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
                  label="Constituency Name"
                  required={true}
                  name="consName"
                  placeholder="Constituency Name"
                  value={avoidSpecialCharUtil(consName)}
                  onChange={handleChangeInput}
                  error={errors.consName}
                  maxLength={50}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="Description"
                  textarea={true}
                  name="remarks"
                  placeholder="Write Remarks..."
                  value={remarks}
                  onChange={handleChangeInput}
                  maxLength={255}
                  // error={errors.remark}
                />
              </div>

              <div className="col-span-2">
                <div className="flex justify-start gap-2 mt-7">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={consId} />
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
            Constituency List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={constituencyColumn} />
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
        description="Are you sure you want submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default ConstituencyPage;
