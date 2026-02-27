import React, { use, useEffect, useState } from "react";
import { FiEdit, FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import ReusableDialog from "../../components/common/ReusableDialog";
import { toast } from "react-toastify";
import SelectField from "../../components/common/SelectField";
import { editGrievanceService, getCategoryListService, saveUpdateGrievanceService } from "../../services/grievanceService";
import { DataGrid } from "@mui/x-data-grid";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    grievanceCategoryId: null,
    grievanceCategoryName: "",
    grvCtgCode: "",
    virtualGrv: "",
    priority: "",
    active: "",
  });

  const {
    grievanceCategoryId,
    grievanceCategoryName,
    grvCtgCode,
    virtualGrv,
    priority,
    active,
  } = formData;
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const priorityOptions = [
    { value: "LOW", label: "Low" },
    { value: "MID", label: "Mid" },
    { value: "HIGH", label: "High" },
  ];

  const handleInp = (e) => {
    const { name, value } = e.target;
  
    let finalValue = value;
  
    // Convert string to boolean for specific fields
    if (name === "virtualGrv" || name === "active") {
      finalValue =
        value === "true" ? true :
        value === "false" ? false :
        "";
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
      ...(name === "grievanceCategoryName" && {
        grvCtgCode: generategrvCtgCode(value),
      }),
      ...(name === "virtualGrv" && finalValue === true && {
        priority: "",
      }),
    }));
  
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  

  const generategrvCtgCode = (name) => {
    if (!name) return "";

    const prefix = name
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 4)
      .toUpperCase();

    const randomLength = Math.floor(Math.random() * 3) + 3; 
    const min = Math.pow(10, randomLength - 1);
    const max = Math.pow(10, randomLength) - 1;
    const uniqueNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return `${prefix}_${uniqueNumber}`;
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [gactive, setGactive] = useState("");

  const handleOnConfirm = (e) => {
    e.preventDefault();
    let newErrors = {};
    console.log(newErrors);
    console.log(errors);
    if (!grievanceCategoryName.trim()) {
      setOpen(false);
      newErrors.grievanceCategoryName = "Please Enter grievanceCategoryName ";
      setErrors(newErrors);
      return;
    }
    if (!grvCtgCode.trim()) {
      newErrors.grvCtgCode = "Please Enter grvCtgCode";
      setErrors(newErrors);
      return;
    }
    if (virtualGrv=== "" || virtualGrv === null) {
      newErrors.virtualGrv = "Please Select virtualGrv";
      setErrors(newErrors);
      return;
    }
    if (active=== "" || active === null) {
      newErrors.active = "Please Select active";
      setErrors(newErrors);
      return;
    }
    if (Object.keys(newErrors).length === 0) {
      setOpen(true)
    }
  };

  const handleSubmit = async (e) => {

    
    const sendData = {
      grievanceCategoryId,
      grievanceCategoryName,
      grvCtgCode,
      virtualGrv,
      priority,
      active,
    };
    const payload = encryptPayload(sendData);

    try {
      const res = await saveUpdateGrievanceService(payload);
       getTableData();
      setFormData({
        grievanceCategoryId: null,
        grievanceCategoryName: "",
        grvCtgCode: "",
        virtualGrv: "",
        active: "",
        priority:"",
      });
      setOpen(false);
      if (res?.data.outcome && res?.status === 200) {
        toast.success(res?.data.message);
        setOpen(false)
      } else {
        toast.error(res?.data.message);
        setOpen(false)
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setOpen(false);
      setFormData({
        grievanceCategoryId: null,
        grievanceCategoryName: "",
        grvCtgCode: "",
        virtualGrv: "",
        priority: "",
        active: "",
       
      });
    }
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
      field: "grievanceCategoryName",
      headerName: "Category Name",
      flex: 1,
    },
    {
      field: "grvCtgCode",
      headerName: "Code",
      flex: 1,
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      sortable: false,
      disableExport: true,
      renderCell: (params) => (
        <button
          className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center"
          onClick={() =>
            editGrievance(params.row.grievanceCategoryId)
          }
        >
          <FiEdit />
        </button>
      ),
    },
  ];

  const grievanceOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const activeOptions = [
    { value: true, label: "Active" },
    { value: false, label: "inActive" },
  ];

  const getTableData = async () => {
    try {
      
         const res = await getCategoryListService();
         const raw = res?.data.data || [];

         const mapped = raw.map(row => ({
           ...row,
           status: row.active ? "Active" : "Inactive",
           priority: row.priority || "N/A",
         }));
         
         setTableData(mapped);    } catch (error) {
      throw error;
    }
  };

  const editGrievance = async (id) => {
    try {
      const payload = encryptPayload({
        grvCtgId: id,  
      });
  
      const res = await editGrievanceService(payload);
  
      const data = res?.data?.data;
  
      setFormData({
        grievanceCategoryId: data?.grievanceCategoryId ?? null,
        grievanceCategoryName: data?.grievanceCategoryName ?? "",
        grvCtgCode: data?.grvCtgCode ?? "",
        virtualGrv: data?.virtualGrv ?? "",
        priority: data?.priority ?? "",
        active: data?.active ?? "",
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  
  
    useEffect(() => {
      getTableData();
    }, []);

  return (
    <>
      <form action="" onSubmit={handleOnConfirm}>
        <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ">
          {/* Header */}
          <div className="p-0">
            <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md  ">
              <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded " />
              Add Category
            </h3>
          </div>

          {/* Body */}
          <div className="min-h-[120px] py-5 px-4 text-[#444]">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-2">
                <InputField
                  label={"Grievance Category"}
                  required={true}
                  name="grievanceCategoryName"
                  value={grievanceCategoryName}
                  onChange={handleInp}
                  maxLength={100}
                  error={errors.grievanceCategoryName}
                />
              </div>
              <div className="col-span-2">
                <InputField
                  label=" Category Code"
                  required
                  name="grvCtgCode"
                  value={grvCtgCode}
                  error={errors.grvCtgCode}
                />
              </div>

              <div className="col-span-2">
                <SelectField
                  label="Is Virtual Grievance:"
                  required={true}
                  name="virtualGrv"
                  value={virtualGrv}
                  onChange={handleInp}
                  options={grievanceOptions}
                  placeholder="Select"
                  error={errors.virtualGrv}
                />
              </div>

              {virtualGrv === false && (
                <div className="col-span-2">
                  <SelectField
                    label="Priority"
                    required={true}
                    name="priority"
                    value={priority}
                    onChange={handleInp}
                    options={priorityOptions}
                    placeholder="Select Priority"
                    error={errors.priority}
                  />
                </div>
              )}


              <div className="col-span-2">
                <SelectField
                  label="Is Active:"
                  required={true}
                  name="active"
                  value={active}
                  onChange={handleInp}
                  options={activeOptions}
                  placeholder="Select"
                  error={errors.active}
                />
              </div>
            </div>
          </div>

          {/* Footer (Optional) */}
          <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            <SubmitBtn type={"submit"} btnText={grievanceCategoryId} />
          </div>
        </div>
      </form>

      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ">
        {/* Header */}
        <div className="p-0">
          <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md ">
            <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded " />
            Category List
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
        <div className="mt-4 bg-white shadow rounded p-3">
        {/* <h3 className="flex items-center gap-2 bg-light-dark text-white px-3 py-2">
          <FiFileText /> Category List
        </h3> */}
   <div className="flex gap-3 mb-3">
  <button
    onClick={() =>
      exportToExcel(
        tableData,
        columns,
        columns.filter(col => col.field !== "action"),
        "Category_List"
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
        columns.filter(col => col.field !== "action"),
        "Category_List"
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
          getRowId={(row) => row.grievanceCategoryId}
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
      </div>
          {/* <ReusableDataTable data={tableData} columns={GrievanceCategoryList} /> */}
        </div>

        <ReusableDialog 
          onClose={() => setOpen(false)}
          onConfirm={handleSubmit}
          open={open}
          title={"Confirmation"}
          description={"Do you want to continue"}
        />
      </div>
    </>
  );
};

export default AddCategory;
