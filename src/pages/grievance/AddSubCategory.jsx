import React, { use, useEffect, useState } from "react";
import { FiEdit, FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { width } from "@mui/system";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { enc } from "crypto-js";
import ReusableDialog from "../../components/common/ReusableDialog";
import { set } from "react-hook-form";
import { toast } from "react-toastify";
import { GoPencil } from "react-icons/go";
import { MdCheck, MdClose, MdLockOutline } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import SelectField from "../../components/common/SelectField";
import { DataGrid } from "@mui/x-data-grid";

import {
  
  editSubCategoryService,
  getCategoryListService,
  getRoleTypeListService,
  getSubCategoryListService,
  saveUpdateSubGrievanceService,
} from "../../services/grievanceService";
import MultiSelectDropdown from "../../components/common/MultiSelectDropdown";

const AddSubCategory = () => {
  const [formData, setFormData] = useState({
    grvSubCtgId: null,
    grvSubCtgName: "",
    routeType: [],
    grvCtgId: "",
    isActive: "",
  });

  const {
    grvSubCtgId,
    grvSubCtgName,
    grvCtgId,
    routeType,
    isActive,
  } = formData;

  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [roleList, setRoleList] = useState([]);

 
  const handleInp = async (e) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === "isActive") {
      finalValue = value === "true" ? true : value === "false" ? false : "";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fileInputRef = React.useRef();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleOnConfirm = (e) => {
    e.preventDefault();
    let newErrors = {};
    console.log(newErrors);
    console.log(errors);

    if (!grvCtgId) {
      newErrors.grvCtgId = "Please Enter Category";
      setErrors(newErrors);
      return;
    }
    if (!grvSubCtgName.trim()) {
      setOpen(false);
      newErrors.grvSubCtgName = "Please Enter grievance Sub Category Name ";
      setErrors(newErrors);
      return;
    }
  if (!Array.isArray(routeType) || routeType.length === 0) {
    newErrors.routeType = "Please Select Role Type";
    setErrors(newErrors);
    return; 
  }

  if (isActive === "" || isActive === null) {
    newErrors.isActive = "Please Select Active Status";
    setErrors(newErrors);
    return;
  }
    if (Object.keys(newErrors).length === 0) {
      setOpen(true);
    }
  };

  const getGrievanceCategoryName = async () => {
    try {
      const res = await getCategoryListService();
      setCategoryList(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getrouteType = async () => {
    try {
      const res = await getRoleTypeListService();
      setRoleList(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  
  const handleSubmit = async (e) => {
    const sendData = {
      grvSubCtgId,
      grvSubCtgName,
      isActive,
      grvCtgId: Number(grvCtgId),
      routeType:routeType.map((i)=>String(i))
    };
    const payload = encryptPayload(sendData);

    try {
      const res = await saveUpdateSubGrievanceService(payload);
      getTableData();
      setFormData({
        grvSubCtgId: null,
        grvSubCtgName: "",
        grvCtgId: "",
        isActive: "",
        routeType: [],
      });
      setOpen(false);
      if (res?.data.outcome && res?.status === 200) {
        toast.success(res?.data.message);
        setOpen(false);
      } else {
        toast.error(res?.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setOpen(false);
      setFormData({
        grvSubCtgId: null,
        grvSubCtgName: "",
        grvCtgId: "",
        isActive: "",
        routeType: [],
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const dataGridColumns = [
    {
      field: "slno",
      headerName: "Sl No",
      width: 80,
      sortable: false,
      renderCell: (params) =>
        paginationModel.page * paginationModel.pageSize + 
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    
    {
      field: "category",
      headerName: "Category Type",
      flex: 1,
      valueGetter: (value, row) => {
        if (!row || !categoryList?.length) return "N/A";
    
        const des = categoryList.find(
          (d) => d.grievanceCategoryId === row.grvCtgId
        );
    
        return des ? des.grievanceCategoryName : "N/A";
      },
    },
    
    {
      field: "grvSubCtgName",
      headerName: "Sub Category Type",
      flex: 1,
    },
    {
      field: "grvSubCtgCode",
      headerName: "Sub Category Code",
      flex: 1,
    },
    {
      field: "routeType",
      headerName: "Role Type",
      flex: 1,
      valueGetter: (value, row) => {
        if (!Array.isArray(row?.routeType) || !roleList?.length) return "N/A";
    
        return roleList
          .filter((r) => row.routeType.includes(String(r.roleCode)))
          .map((r) => r.roleName)
          .join(", ");
      },
    },
    
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            params.value ? "" : "bg-red-100 text-red-700"
          }`}
        >
          {params.value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <button
          className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
          onClick={() => editSubCategory(params.row.grvSubCtgId)}
        >
          <FiEdit className="w-4 h-4" />
        </button>
      ),
    },
  ];
  
  // const AchievementChartList = [
  //   {
  //     name: "Sl No.",
  //     selector: (row, index) => index + 1,
  //     width: "80px",
  //   },

  //   {
  //     name: "Category Type",
  //     selector: (row) => {
  //       const des = categoryList.find(
  //         (d) => d.grievanceCategoryId === row.grvCtgId
  //       );
  //       return des ? des.grievanceCategoryName : "N/A";
  //     },
  //   },

  //   {
  //     name: "Sub Category Type",
  //     selector: (row) => row.grvSubCtgName || "N/A",
  //   },
  //   {
  //     name: "Sub Category Code",
  //     selector: (row) => row.grvSubCtgCode || "N/A",
  //   },

  //   {
  //     name: "Role Type",
  //     selector: (row) => {
  //       if (!Array.isArray(row.routeType)) return "N/A";

  //       const names = roleList
  //         .filter((r) => row.routeType.includes(String(r.roleCode))) 
  //         .map((r) => r.roleName)
  //         .join(", ");

  //       return names || "N/A";
  //     },
  //   },

  //   {
  //     name: "Active",
  //     selector: (row) => (row.isActive ? "Active" : "Inactive"),
  //   },

  //   {
  //     name: "Action",
  //     selector: (row) => (
  //       <div className="flex gap-2">
  //         <button
  //           className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
  //           onClick={() => editSubCategory(row?.grvSubCtgId)}
  //         >
  //           <FiEdit className="w-4 h-4" />
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  const isActiveOptions = [
    { value: true, label: "Active" },
    { value: false, label: "inActive" },
  ];

  const getTableData = async () => {
    try {
      const res = await getSubCategoryListService();
      setTableData(res?.data.data || []);
    } catch (error) {
      throw error;
    }
  };

  const editSubCategory = async (id) => {
    
    try {
      const payload = encryptPayload({
        grvSubCtgId: id,
      });

      const res = await editSubCategoryService(payload);

      const data = res?.data?.data;

      setFormData({
        grvSubCtgId: data?.grvSubCtgId ?? null,
        grvSubCtgName: data?.grvSubCtgName ?? "",
        grvCtgId: data?.grvCtgId ?? "",
        routeType: res?.data.data.routeType.map((i)=>String(i)),

        isActive:
          data?.isActive === "true" || data?.isActive === true ? true : false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTableData();
    getGrievanceCategoryName();
    getrouteType();
  }, []);
  
  console.log(routeType);
  

  return (
    <>
      <form action="" onSubmit={handleOnConfirm}>
        <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ">
          {/* Header */}
          <div className="p-0">
            <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md  ">
              <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded " />
              Add Sub Category
            </h3>
          </div>

          {/* Body */}
          <div className="min-h-[120px] py-5 px-4 text-[#444]">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-2">
                <SelectField
                  label="Grievance Category"
                  required
                  name="grvCtgId"
                  value={grvCtgId}
                  onChange={handleInp}
                  options={categoryList.map((d) => ({
                    value: d.grievanceCategoryId,
                    label: d.grievanceCategoryName,
                  }))}
                  error={errors.grvCtgId}
                  placeholder="Select"
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label={"Sub Category"}
                  required={true}
                  name="grvSubCtgName"
                  value={grvSubCtgName}
                  onChange={handleInp}
                  maxLength={100}
                  error={errors.grvSubCtgName}
                />
              </div>

              <div className="col-span-2">
                <MultiSelectDropdown
                  label="Role Type"
                  name="routeType"
                  error={errors.routeType}
                  required
                  value={formData.routeType}
                  onChange={handleInp}
                  options={roleList?.map((i) => ({
                    value: i.roleCode,
                    label: i.roleName,
                   
                  }))}
                />
              </div>

              <div className="col-span-2">
                <SelectField
                  label="Is isActive:"
                  required={true}
                  name="isActive"
                  value={isActive}
                  onChange={handleInp}
                  options={isActiveOptions}
                  placeholder="Select"
                  error={errors.isActive}
                />
              </div>
            </div>
          </div>

          {/* Footer (Optional) */}
          <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            <SubmitBtn type={"submit"} btnText={grvSubCtgId} />
          </div>
        </div>
      </form>

      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ">
        {/* Header */}
        <div className="p-0">
          <h3 className="flex items-center gap-2 text-white font-normal text-[18px] border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md ">
            <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded " />
            Sub Category List
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
        <div style={{ height: 420, width: "100%" }}>
        <DataGrid
  rows={tableData || []}
  columns={dataGridColumns}
  getRowId={(row) => row.grvSubCtgId}

  pagination
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10, 20]}

  disableRowSelectionOnClick
  sx={{
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#fff2e7",
      fontWeight: "bold",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#f9fafb",
    },
  }}
/>

</div>

          {/* <ReusableDataTable data={tableData} columns={AchievementChartList} /> */}
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

export default AddSubCategory;
