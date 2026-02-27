
import React, { useEffect, useState } from "react";
import { FiFileText, FiEdit } from "react-icons/fi";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import {
  getCategoryListService,
  getGrievanceHearingByIdService,
  getHearingListService,
} from "../../services/grievanceService";
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { ResetBackBtn } from "../../components/common/CommonButtons";
import { DataGrid} from "@mui/x-data-grid";
import SelectField from "../../components/common/SelectField";

const GrievanceHearingList = () => {

  const [filters, setFilters] = useState({
    grvCategoryId: "",
    grvSlotDateId: "",
    grievanceSlotId: ""
  });
  

  const [allData, setAllData] = useState([]);


  const [tableData, setTableData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  /* ---------------- GET CATEGORY NAME ---------------- */
  const getCategoryList = async () => {
    try {
      const res = await getCategoryListService();
      setCategoryList(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };



  const handleFilterChange = (e) => {
    const { name, value } = e.target;
  
    const updatedFilters = {
      ...filters,
      [name]: value
    };
  
    setFilters(updatedFilters);
  
    // Refetch data immediately when filter changes
    getTableData(updatedFilters);
  };
  




  /* ---------------- GET TABLE DATA ---------------- */
  // const getTableData = async () => {
  //   try {
  //     const payload = encryptPayload({});
  //     const res = await getHearingListService(payload);
  //     setTableData(res?.data?.data || []);
  //   } catch (error) {
  //     toast.error("Failed to load data");
  //     console.error(error);
  //   }
  // };
  
const [paginationModel, setPaginationModel] = useState({
  page: 0,
  pageSize: 5, // default page size
});
  const getTableData = async (filterValues = filters) => {
    try {
  
      const params = {};
  
      if (filterValues.grvCategoryId)
        params.grvCategoryId = Number(filterValues.grvCategoryId);
  
      if (filterValues.grvSlotDateId)
        params.grvSlotDateId = Number(filterValues.grvSlotDateId);
  
      if (filterValues.grievanceSlotId !== "" && !isNaN(Number(filterValues.grievanceSlotId))) {
        params.grievanceSlotId = Number(filterValues.grievanceSlotId);
      }
      
  
      const res = await getHearingListService(params);
  
      const data = res?.data?.data || [];

const formattedData = data.map((row) => ({
  ...row,
  createdOn: row.createdOn
    ? new Date(Number(row.createdOn)).toLocaleDateString("en-GB")
    : "N/A",
}));

setTableData(formattedData);

      if (
        !filterValues.grvCategoryId &&
        !filterValues.grvSlotDateId &&
        !filterValues.grievanceSlotId
      ) {
        setAllData(formattedData);
      }
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    }
  };
  
  
  const navigate = useNavigate()
  const ViewUser = async (id) => {
      try {
          const sendData = {
            grvHearigId: Number(id),
              isActive: false
          }
          const payload = encryptPayload(sendData)
          const res = await getGrievanceHearingByIdService(payload)
          console.log(res);
          if (res?.status === 200 && res?.data.outcome) {
              navigate('/virtualGrievanceHearing', { state: res?.data.data })
          }
      } catch (error) {
          throw error
      }
  }
  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      width: 80,
      sortable: false,
      renderCell: (params) => {
        const page = params.api.state.pagination.paginationModel.page;
        const pageSize = params.api.state.pagination.paginationModel.pageSize;
        const index = params.api.getAllRowIds().indexOf(params.id);
        return page * pageSize + index + 1;
      },
    },
  
    { field: "petitionerName", headerName: "Name", flex: 1 },
  
    { field: "ctgName", headerName: "Category", flex: 1 },
  
    { field: "contactNo", headerName: "Contact No", flex: 1 },
  
    { field: "email", headerName: "Email", flex: 1 },
  
    {
      field: "grvSlotDate",
      headerName: "Slot Date",
      flex: 1,
    },
    
    
  
    {
      field: "grievanceSlotTime",
      headerName: "Slot Time",
      flex: 1,
    },
    {
      field: "createdOn",
      headerName: "Issued Date",
      flex: 1,
    },
    
    
    {
      field: "subjectLine",
      headerName: "Subject",
      flex: 2,
    },
  
    {
      field: "address",
      headerName: "Address",
      flex: 2,
    },
  
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <button
          className="h-8 w-8 bg-blue-500/25 text-blue-500 rounded-sm flex justify-center items-center"
          onClick={() => ViewUser(params.row.grvHearigId)}
        >
          <FaEye />
        </button>
      ),
    },
  ];
  


  useEffect(() => {
    getCategoryList();
    getTableData();
  }, []);

  return (
    <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div>
        <h3 className="flex items-center gap-2 text-white font-normal text-[18px]
                       border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md">
          <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
           Virtual Grievance Hearing List
        </h3>
      </div>

      {/* Table */}
      <div className="min-h-[120px] h-auto py-5 px-4 text-[#444]">
      <div className="grid grid-cols-12 gap-4 mb-4">

{/* Category Dropdown */}
<div className="col-span-3">
  <SelectField
    label="Category"
    name="grvCategoryId"
    value={filters.grvCategoryId}
    onChange={handleFilterChange}
    options={categoryList.map((d) => ({
      value: d.grievanceCategoryId,
      label: d.grievanceCategoryName,
    }))}
    placeholder="All Categories"
  />
</div>

{/* Slot Date Dropdown */}
<div className="col-span-3">
  <SelectField
    label="Slot Date"
    name="grvSlotDateId"
    value={filters.grvSlotDateId}
    onChange={handleFilterChange}
    options={[
      ...new Map(
        allData.map((d) => [
          d.grvSlotDateId,
          {
            value: d.grvSlotDateId,
            label: d.grvSlotDate,
          },
        ])
      ).values(),
    ]}
    
    placeholder="All Dates"
  />
</div>

{/* Slot Time Dropdown */}
<div className="col-span-3">
  <SelectField
    label="Slot Time"
    name="grievanceSlotId"
    value={filters.grievanceSlotId}
    onChange={handleFilterChange}
    options={[
      ...new Map(
        allData.map((d) => [
          d.grievanceSlotId,
          {
            value: d.grievanceSlotId,
            label: d.grievanceSlotTime,
          },
        ])
      ).values(),
    ]}
    
    placeholder="All Time Slots"
  />
</div>

</div>
<div className="flex gap-3 mb-3">
  <button
    onClick={() =>
      exportToExcel(
        tableData,
        columns.filter(col => col.field !== "actions"), 
        "Virtual_Grievance_Hearing_List"
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
        columns.filter(col => col.field !== "actions"),
        "Virtual_Grievance_Hearing_List"
      )
    }
    className="px-4 py-2 bg-rose-100 text-rose-700 border border-rose-300 rounded hover:bg-rose-300 transition"
  >
    Export PDF
  </button>
</div>

<div className="h-[400px]">

{/* FILTER SECTION */}


<DataGrid
  className="h-[300px]"
  rows={tableData}
  columns={columns}
  getRowId={(row) => row.grvHearigId}
  pagination
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10, 20]}  // your desired options
  disableRowSelectionOnClick
  slotProps={{
    toolbar: { showQuickFilter: true },
  }}
/>

</div>




        {/* <ReusableDataTable data={tableData} columns={columns} /> */}
        <ResetBackBtn />
      </div>     
     
    </div>
    
  );
};

export default GrievanceHearingList;
