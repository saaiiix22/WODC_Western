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
import DatePicker from "react-datepicker";
// import { addDays } from "date-fns";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

// import { addDays } from "date-fns";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import "react-datepicker/dist/react-datepicker.css";
import { DataGrid } from "@mui/x-data-grid";

import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";

import { FaMinusCircle } from "react-icons/fa";

import { Tooltip } from "@mui/material";
import SelectField from "../../components/common/SelectField";
import {
  editGrievanceSlotConfigService,
  getCategoryListService,
  getGrievanceSlotConfigListService,
  getSlotListService,
  getSubCategoryListService,
  saveUpdateGrievanceConfigSlotService,
} from "../../services/grievanceService";
import { dateToDDMMYYYY, formatDateToDDMMYYYY, formatToDDMMYYYY } from "../../utils/validationUtils";

const AddGrievanceSlotConfiguration = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };


  

  const [formData, setFormData] = useState({
    virtualGrvSlotId: null,
    grievanceSubCategory: null,
    // meetingLink: "",
    grvConfigDate: "",
    virtualGrievanceSlotDetailsDto: "",
  });
  const {
    virtualGrvSlotId,
    grvCtgId,
    grvSubCtgId,
    meetingLink,
    grvConfigDate,
  } = formData;
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);

  const [rows, setRows] = useState([
    {
    
      fromTime: "",
      toTime: "",
      meetingLink: "",
      noOfParticipants: null,
      virtualGrvSlotDtlsId: null,
    },
  ]);

  const handleAddRow = () => {
    const hasIncompleteRow = rows.some(
      (row) =>
        !row.fromTime ||
        !row.toTime ||
        row.noOfParticipants === null ||
        row.noOfParticipants === undefined ||
        Number(row.noOfParticipants) <= 0
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
        _rowKey: crypto.randomUUID(),
        noOfParticipantsrName: "",
        toTime: "",
        fromTime: "",
        virtualGrvSlotDtlsId: null,
      },
    ]);
  };

  // const handleRemoveRow = (index) => {
  //   const updated = [...rows];
  //   updated.splice(index, 1);
  //   setRows(updated);
  // };
  const handleRemoveRow = (rowKey) => {
    setRows((prev) => prev.filter((row) => row._rowKey !== rowKey));
  };

  const handleInput = (index, name, value) => {
    const updated = [...rows];
    updated[index][name] = value;
    setRows(updated);
  };
  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);

  const formatDateForInput = (date) => {
    if (!date) return "";
    return date.split("T")[0]; // YYYY-MM-DD
  };

  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    if (!grvCtgId) {
      setErrors({ grvCtgId: "Grievance  Category is required" });
      setOpenSubmit(false);
      return;
    }
    if (!grvSubCtgId) {
      setErrors({ grvSubCtgId: "Grievance Sub Category is required" });
      setOpenSubmit(false);
      return;
    }

    if (!grvConfigDate) {
      setErrors({ grvConfigDate: "Slot Date is required" });
      setOpenSubmit(false);
      return;
    }

    if (rows.length === 0) {
      toast.error("At least one slot row is required");
      setOpenSubmit(false);
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.fromTime?.trim()) {
        toast.error(`Row ${i + 1}: From Time is required`);
        setErrors({ fromTime: "fromTime is required" });
        setOpenSubmit(false);
        return;
      }
      if (!row.toTime?.trim()) {
        toast.error(`Row ${i + 1}: To Time is required`);
        setOpenSubmit(false);
        return;
      }
      if (
        row.noOfParticipants === null ||
        row.noOfParticipants === undefined ||
        row.noOfParticipants === "" ||
        Number(row.noOfParticipants) <= 0
      ) {
        toast.error(`Row ${i + 1}: No. of Participants is required`);
        setOpenSubmit(false);
        return;
      }

      if (!row.meetingLink?.trim()) {
        toast.error(`Row ${i + 1}: MeetingLink is required`);
        setOpenSubmit(false);
        return;
      }


    }

    setErrors({});
    setOpenSubmit(true);
  };
  // const isMondayDate = (date) => {
  //   return date.getDay() === 1; // Monday
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    debugger;
    const sendData = {
      virtualGrvSlotId: formData.virtualGrvSlotId,
      grvCtgId,
      grievanceSubCategory: grvSubCtgId,
      grvConfigDate: formatToDDMMYYYY(grvConfigDate),
      // virtualGrievanceSlotDetailsDto: rows,
      virtualGrievanceSlotDetailsDto: rows.map(({ _rowKey, ...rest }) => rest),

    };

    try {
      setOpenSubmit(false);
      setExpanded("panel2");
      const payload = encryptPayload(sendData);
      const res = await saveUpdateGrievanceConfigSlotService(payload);
      if (res?.data.outcome && res?.status === 200) {
        toast.success(res?.data.message);
        getAllTableData();
        setFormData({
          grvCtgId: "",
          grvSubCtgId: "",
          grvConfigDate: "",
        });
        setRows([
          {
            virtualGrvSlotDtlsId: row.virtualGrvSlotDtlsId,
            fromTime: "",
            toTime: "",
            noOfParticipants: "",
            meetingLink: "",
          },
        ]);
      } else {
        getAllTableData();
        toast.error(res?.data.message);
        setFormData({
          grvCtgId: "",
          grvSubCtgId: "",
          grievanceSubCategory: "",
          grvConfigDate: "",
        });
        setRows([
          {
            meetingLink: "",
            noOfParticipants: "",
            fromTime: "",
            toTime: "",
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
      const res = await getSlotListService(payload);
      console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        const rawData = res?.data.data || [];
      
        const mappedData = rawData.map((row) => {
          const sub = allSubCategories.find(
            (d) =>
              String(d.grvSubCtgId) ===
              String(row.grievanceSubCategory)
          );
      
          return {
            ...row,
            grievanceSubCategoryName:
              sub?.grvSubCtgName?.trim() || "N/A",
      
            fromTime:
              row?.slotTimes?.map((t) => t.fromTime).join(", ") || "N/A",
      
            toTime:
              row?.slotTimes?.map((t) => t.toTime).join(", ") || "N/A",
          };
        });
      
        setTableData(mappedData);
      }
    } catch (error) {
      throw error;
    }
  };


  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // useEffect(() => {
  //   getAllTableData();
  //   getGrievanceCategoryName();
  //   getGrievanceSubCategoryName();
  // }, []);


  const [openModal, setOpenModal] = useState(false);

  const getGrievanceCategoryName = async () => {
    try {
      const res = await getCategoryListService();
      setCategoryList(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getGrievanceSubCategoryName = async () => {
    try {
      const res = await getSubCategoryListService();
      setAllSubCategories(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const editSector = async (id) => {
    try {
      debugger;
      const payload = encryptPayload({ virtualGrvSlotId: id, isActive: false });
      const res = await editGrievanceSlotConfigService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {

        setRows(
          res.data.data.virtualGrievanceSlotDetailsDto.map((row) => ({
            ...row,
            _rowKey: row.virtualGrvSlotDtlsId || crypto.randomUUID(),
          }))
        );

        setFormData({
          virtualGrvSlotId: res?.data.data.virtualGrvSlotId || null,
          grvCtgId: String(res?.data.data.grvCtgId || ""),
          grvSubCtgId: String(res?.data.data.grievanceSubCategory || ""),
          grvConfigDate: formatToDDMMYYYY(res?.data.data.grvConfigDate),
        });

        setExpanded("panel1");
      }
    } catch (error) {
      throw error;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const [openSecId, setSecId] = useState("");
  const [upcomingMonday, setUpcomingMonday] = useState("");

  const handlegrvConfigDateChange = (e) => {
    const value = e.target.value;

    if (!isFutureDate(value)) {
      toast.error("Past dates are not allowed");
      return;
    }

    if (!isMonday(value)) {
      toast.error("Only Mondays are allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      grvConfigDate: value,
    }));
  };

  // const isMonday = (dateStr) => {
  //   const d = new Date(dateStr);
  //   return d.getDay() === 1;
  // };

  const isFutureDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(dateStr);
    selected.setHours(0, 0, 0, 0);

    return selected > today;
  };
  useEffect(() => {
    if (formData.grvCtgId && allSubCategories.length) {
      const filteredSubs = allSubCategories.filter(
        (sub) => String(sub.grvCtgId) === String(formData.grvCtgId)
      );
      setSubCategoryList(filteredSubs);
    }
  }, [formData.grvCtgId, allSubCategories]);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;


    setFormData((prev) => ({

      ...prev,
      grvCtgId: selectedCategoryId,

      // grvSubCtgId: "",

      // grvSubCtgId: "",

      // grvSubCtgId: "",

    }));

    setErrors((prev) => ({
      ...prev,
      grvCtgId: "",
      grvSubCtgId: "",
    }));
  };











  const columns = [

    {
      field: "slNo",
      headerName: "Sl No",
      width: 80,
      sortable: false,
      renderCell: (params) =>
        paginationModel.page * paginationModel.pageSize +
        params.api.getRowIndexRelativeToVisibleRows(params.id) +
        1,
    },

    {
      field: "grievanceSubCategoryName",
      headerName: "Sub Category",
      flex: 1,
    },
    {
      field: "grvConfigDate",
      headerName: "Slot Date",
      flex: 1,
    },

    {
      field: "fromTime",
      headerName: "From Time",
      flex: 1,
    },
    {
      field: "toTime",
      headerName: "To Time",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <button
          className="h-8 w-8 bg-blue-500/25 text-blue-500 rounded-sm flex justify-center items-center"
          onClick={() => editSector(params.row.virtualGrvSlotId)}
        >
          <GoPencil />
        </button>
      ),
    },
  ];
  useEffect(() => {
    if (allSubCategories.length > 0) {
      setTableData((prev) => [...prev]);
    }
  }, [allSubCategories]);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 1️⃣ Load category list
        const catRes = await getCategoryListService();
        setCategoryList(catRes?.data?.data || []);
  
        // 2️⃣ Load subcategory list
        const subRes = await getSubCategoryListService();
        const subCategories = subRes?.data?.data || [];
        setAllSubCategories(subCategories);
  
        // 3️⃣ Load slot list
        const payload = encryptPayload({ isActive: false });
        const slotRes = await getSlotListService(payload);
        const rawData = slotRes?.data?.data || [];
  
        // 4️⃣ Map with subcategory name
        const mappedData = rawData.map((row) => {
          const sub = subCategories.find(
            (d) =>
              String(d.grvSubCtgId) ===
              String(row.grievanceSubCategory)
          );
  
          return {
            ...row,
            grievanceSubCategoryName:
              sub?.grvSubCtgName?.trim() || "N/A",
  
            fromTime:
              row?.slotTimes?.map((t) => t.fromTime).join(", ") || "N/A",
  
            toTime:
              row?.slotTimes?.map((t) => t.toTime).join(", ") || "N/A",
          };
        });
  
        setTableData(mappedData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      }
    };
  
    loadAllData();
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
              color: "#2c0014",
            }}
          >
            Grievance Configuration
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
                  label="Grievance Category"
                  required
                  name="grvCtgId"
                  value={grvCtgId}
                  onChange={handleCategoryChange}
                  options={categoryList.map((d) => ({
                    value: d.grievanceCategoryId,
                    label: d.grievanceCategoryName,
                  }))}
                  error={errors.grvCtgId}
                  placeholder="Select"
                />
              </div>

              <div className="col-span-2">

                <SelectField
                  label=" Sub Category"
                  required
                  name="grvSubCtgId"
                  value={grvSubCtgId || ""}
                  onChange={handleChangeInput}
                  options={subCategoryList.map((d) => ({
                    value: d.grvSubCtgId,
                    label: d.grvSubCtgName,
                  }))}
                  error={errors.grvSubCtgId}
                  placeholder={grvCtgId ? "Select Sub Category" : "Select"}
                  disabled={!grvCtgId}
                />

               
       

              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-medium text-gray-700 mb-1">
                  Slot Date <span className="text-red-500">*</span>
                </label>

                <div className="relative mt-1">
                  <DatePicker
                    selected={
                      formData.grvConfigDate
                        ? new Date(formData.grvConfigDate.split("/").reverse().join("-"))
                        : null
                    }
                    onChange={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      if (date < today) {
                        toast.error("Past dates are not allowed");
                        return;
                      }

                      setFormData((prev) => ({
                        ...prev,
                        grvConfigDate: dateToDDMMYYYY(date),
                      }));
                    }}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    placeholderText="Select a slot date"
                    className={`w-full rounded-md border border-gray-300 px-2.5 py-1.5 pr-10 text-sm ${
                      errors.grvConfigDate ? "border-red-500" : ""
                    }`}
                  />

                  {/* Calendar Icon */}
                  <CalendarMonthIcon
                    fontSize="small"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>

                {errors.grvConfigDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.grvConfigDate}
                  </p>
                )}
              </div>



              <div className="col-span-12">
                <div className="bg-slate-100 border-l-4 border-slate-600  px-4 py-2">
                  <h5 className="text-sm font-semibold text-slate-700">
                    Slot Details
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
                        From Time
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        To Time
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        No. of Participants
                      </td>

                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        Meeting Link
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
                        <tr key={i._rowKey} className="border-b border-slate-200">
                          <td className="border-r border-slate-200 text-center">
                            {index + 1}
                          </td>

                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="fromTime"
                              type="time"
                              value={i.fromTime}
                              onChange={(e) =>
                                handleInput(index, "fromTime", e.target.value)
                              }
                              maxLength={50}
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="toTime"
                              type="time"
                              value={i.toTime}
                              maxLength={30}
                              onChange={(e) =>
                                handleInput(index, "toTime", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                            />
                          </td>
                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="noOfParticipants"
                              type="number"
                              value={i.noOfParticipants}
                              maxLength={255}
                              onChange={(e) =>
                                handleInput(
                                  index,
                                  "noOfParticipants",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                            />
                          </td>

                          <td className="border-r border-slate-200 px-2 py-1">
                            <input
                              name="meetingLink"
                              type="text"
                              placeholder="https://meet.google.com/..."
                              value={i.meetingLink || ""}
                              onChange={(e) =>
                                handleInput(index, "meetingLink", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm"
                            />
                          </td>



                          <td className="border-r border-slate-200 text-center">
                            {rows.length > 1 && (
                              <button
                                type="button"
                                className="text-red-500"
                                onClick={() => handleRemoveRow(i._rowKey)}

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
                  <SubmitBtn type={"submit"} btnText={virtualGrvSlotId} />
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
            Grievance Configuration List
          </Typography>
        </AccordionSummary>

        <ReusableDialog
          open={openSubmit}
          description="Are you sure you want to submit this grievance slot configuration?"
          onClose={() => setOpenSubmit(false)}
          onConfirm={handleSubmit}
        />

        <AccordionDetails>
        <div className="flex gap-3 mb-3">
  <button
    onClick={() =>
      exportToExcel(
        tableData,
        columns,
        "Slot_List"
      )
    }
    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-300 transition"
    >
    Export Excel
  </button>

  <button
    onClick={() =>
      exportToPDF(
        tableData,
        columns,
        "Slot_List"
      )
    }
    className="px-4 py-2 bg-rose-100 text-rose-700 border border-rose-300 rounded hover:bg-rose-300 transition"
    >
    Export PDF
  </button>
</div>

          <div style={{ height: 420, width: "100%" }}>
            <DataGrid
              rows={tableData}
              columns={columns}
              getRowId={(row) => row.virtualGrvSlotId}
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-cell": {
                  borderRight: "2px solid #ddd", // vertical line between cells
                },
                "& .MuiDataGrid-columnHeaders": {
                  borderBottom: "2px solid #ddd", // horizontal line under header
                },
                "& .MuiDataGrid-row": {
                  borderBottom: "2px solid #eee", // horizontal lines between rows
                },
              }}
            />

          </div>


          {/* <ReusableDataTable data={tableData} columns={sectorColumn} /> */}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AddGrievanceSlotConfiguration;
