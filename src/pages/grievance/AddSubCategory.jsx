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
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

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
      field: "category",
      headerName: "Category Type",
      flex: 1,
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
    },
    
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
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
  

  const isActiveOptions = [
    { value: true, label: "Active" },
    { value: false, label: "inActive" },
  ];

  const getTableData = async () => {
    try {
      const res = await getSubCategoryListService();
      const raw = res?.data?.data || [];
  
      const mapped = raw.map((row, index) => {
        const category = categoryList.find(
          (c) => c.grievanceCategoryId === row.grvCtgId
        );
  
        const roleNames = Array.isArray(row.routeType)
          ? roleList
              .filter((r) =>
                row.routeType.includes(String(r.roleCode))
              )
              .map((r) => r.roleName)
              .join(", ")
          : "N/A";
  
        return {
          ...row,
          slNo: index + 1,
          category: category
            ? category.grievanceCategoryName
            : "N/A",
          routeType: roleNames || "N/A",
          isActive: row.isActive ? "Active" : "Inactive",
        };
      });
  
      setTableData(mapped);
    } catch (error) {
      console.error(error);
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
    const fetchAll = async () => {
      try {
        const categoryRes = await getCategoryListService();
        const roleRes = await getRoleTypeListService();
  
        const categories = categoryRes?.data?.data || [];
        const roles = roleRes?.data?.data || [];
  
        setCategoryList(categories);
        setRoleList(roles);
  
        // Now fetch table AFTER lists are ready
        const subRes = await getSubCategoryListService();
        const raw = subRes?.data?.data || [];
  
        const mapped = raw.map((row, index) => {
          const category = categories.find(
            (c) => c.grievanceCategoryId === row.grvCtgId
          );
  
          const roleNames = Array.isArray(row.routeType)
            ? roles
                .filter((r) =>
                  row.routeType.includes(String(r.roleCode))
                )
                .map((r) => r.roleName)
                .join(", ")
            : "N/A";
  
          return {
            ...row,
            slNo: index + 1,
            category: category
              ? category.grievanceCategoryName
              : "N/A",
            grvSubCtgCode: row.grvSubCtgCode || "N/A",
            routeType: roleNames || "N/A",
            isActive: row.isActive ? "Active" : "Inactive",
          };
        });
  
        setTableData(mapped);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchAll();
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
                  label="Is Active:"
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
        <div className="flex gap-3 mb-3">
  <button
    onClick={() =>
      exportToExcel(
        tableData,
        dataGridColumns.filter(col => col.field !== "action"),
        "SubCategory_List"
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
        dataGridColumns.filter(col => col.field !== "action"),
        "SubCategory_List"
      )
    }
    className="px-4 py-2 bg-rose-100 text-rose-700 border border-rose-300 rounded hover:bg-rose-300 transition"
    >
    Export PDF
  </button>
</div>

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
