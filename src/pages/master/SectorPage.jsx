import React, { Fragment, useState } from "react";
import Typography from "@mui/material/Typography";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useEffect } from "react";
import { GoPencil } from "react-icons/go";
import { MdLockOutline, MdOutlineAddCircle } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import {
  editMilestoneService,
  toggleMilestoneStatusService,
} from "../../services/milesStoneService";
import { FaMinusCircle } from "react-icons/fa";
import { getAgencyDetailsService } from "../../services/agencyService";
import {
  editSectorService,
  getAllSectorListService,
  saveSectorService,
  toggleSectorStatusService,
} from "../../services/sectorService";
import { Tooltip } from "@mui/material";

const SectorPage = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING

  const [formData, setFormData] = useState({
    sectorName: "",
    remarks: "",
    sectorId: null,
  });
  const { sectorName, remarks, sectorId } = formData;
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const [rows, setRows] = useState([
    {
      subSectorName: "",
      subSectorCode: "",
      remarks: "",
      subSectorId: null,
    },
  ]);

  const handleAddRow = () => {
    const hasIncompleteRow = rows.some(
      (row) =>
        !row.subSectorName?.trim() ||
        !row.subSectorCode?.trim() ||
        !row.remarks?.trim()
    );

    if (hasIncompleteRow) {
      toast.error(
        "Please fill all fields in the existing rows before adding a new one."
      );
      return;
    }

    setRows([
      ...rows,
      {
        subSectorName: "",
        subSectorCode: "",
        remarks: "",
        subSectorId: null,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleInput = (index, name, value) => {
    const updated = [...rows];
    updated[index][name] = value;
    setRows(updated);
  };
  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);
  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!sectorName || !sectorName.trim()) {
      newErrors.sectorName = "Sector name is required";
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
      sectorName,
      remarks,
      sectorId: sectorId,
      subSectorDtoList: rows,
    };
    // console.log(sendData);

    try {
      setOpenSubmit(false);
      setExpanded('panel2')
      const payload = encryptPayload(sendData);
      const res = await saveSectorService(payload);
      //   console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        toast.success(res?.data.message);
        getAllTableData();
        setFormData({
          sectorName: "",
          remarks: "",
        });
        setRows([
          {
            subSectorName: "",
            subSectorCode: "",
            remarks: "",
          },
        ]);
      } else {
        getAllTableData();
        toast.error(res?.data.message);
        setFormData({
          sectorName: "",
          remarks: "",
        });
        setRows([
          {
            subSectorName: "",
            subSectorCode: "",
            remarks: "",
          },
        ]);
      }
    } catch (error) {
      throw error;
    }
  };

  const [tableData, setTableData] = useState([]);
  const getAllTableData = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await getAllSectorListService(payload);
      console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        setTableData(res?.data.data || []);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllTableData();
  }, []);

  const [openModal, setOpenModal] = useState(false);

  const editSector = async (id) => {
    try {
      const payload = encryptPayload({ sectorId: id, isActive: false });
      const res = await editSectorService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setFormData(res?.data.data);
        setRows(res?.data.data.subSectorDtoList);
        setExpanded("panel1");
      }
    } catch (error) {
      throw error;
    }
  };

  const [openSecId, setSecId] = useState("");

  const toggleStatus = async () => {
    try {
      const payload = encryptPayload({ sectorId: openSecId });
      const res = await toggleSectorStatusService(payload);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        setOpenModal(false);
        getAllTableData();
      }
    } catch (error) {
      throw error;
    }
  };

  const sectorColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Sector Name",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p>{row.sectorCode}</p> |{" "}
            <p className="text-slate-800">{row.sectorName}</p>
          </div>
        ) || "N/A",
      sortable: true,
    },
    {
      name: "Sub Sector",
      selector: (row) =>
        (
          <div className="flex flex-wrap gap-2">
            {row.subSectorDtoList.map((i, idx) => {
              return (
                <p
                  className="text-[12px] rounded-sm"
                  key={idx}
                >
                  {i.subSectorName}
                </p>
              );
            })}
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
          <Tooltip title="Edit" arrow>
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
            onClick={() => {
              editSector(row?.sectorId);
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
              setOpenModal(true);
              setSecId(row?.sectorId);
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
            Add Sector
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form className="grid grid-cols-12 gap-6" onSubmit={handleSubmitConfirmModal}>
              <div className="col-span-2">
                <InputField
                  label="Sector Name"
                  required={true}
                  name="sectorName"
                  placeholder="Enter sector name"
                  value={sectorName}
                  onChange={handleChangeInput}
                  maxLength={30}
                  error={errors.sectorName}
                />
              </div>

              <div className="col-span-4">
                <InputField
                  label="Remarks"
                  textarea={true}
                  name="remarks"
                  placeholder="Write remarks ..."
                  value={remarks}
                  onChange={handleChangeInput}
                  maxLength={255}
                />
              </div>

              <div className="col-span-12">
                <div className="bg-slate-100 border-l-4 border-slate-600  px-4 py-2">
                  <h5 className="text-sm font-semibold text-slate-700">
                    Add Sub-sectors
                  </h5>
                </div>
              </div>

              <div className="col-span-12">
                <table className="table-fixed w-full border border-slate-300">
                  <thead className="bg-slate-100">
                    <tr>
                      <td className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-slate-200">
                        SL No
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        Sub-sector Name
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        Code
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        Remarks
                      </td>
                      <td className="w-[60px] text-center text-sm px-4 py-1 border-r border-slate-200">
                        <button type="button" onClick={handleAddRow}>
                          <MdOutlineAddCircle className="inline text-green-600 text-xl" />
                        </button>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {rows?.map((i, index) => {
                      return (
                        <tr key={index} className="border-b border-slate-200">
                          <td className="border-r border-slate-200 text-center">
                            {index + 1}
                          </td>

                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="subSectorName"
                              value={i.subSectorName}
                              onChange={(e) =>
                                handleInput(
                                  index,
                                  "subSectorName",
                                  e.target.value
                                )
                              }
                              maxLength={50}
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="subSectorCode"
                              value={i.subSectorCode}
                              maxLength={30}
                              onChange={(e) =>
                                handleInput(
                                  index,
                                  "subSectorCode",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="remarks"
                              value={i.remarks}
                              maxLength={255}
                              onChange={(e) =>
                                handleInput(index, "remarks", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                            />
                          </td>
                          <td className="border-r border-slate-200 text-center">
                            {rows.length > 1 && (
                              <button
                                type="button"
                                className="text-red-500"
                                onClick={() => handleRemoveRow(index)}
                              >
                                <FaMinusCircle />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="col-span-12">
                <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={sectorId} />
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
            Sector List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={sectorColumn} />
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

export default SectorPage;
