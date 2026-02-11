
import React, { useEffect, useState } from "react";
import { FiFileText, FiEdit } from "react-icons/fi";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import {
  getAllGrievanceService,
  getCategoryListService,
  getGrievanceByIdService,
  getHearingListService,
  getSubCategoryListService,
} from "../../services/grievanceService";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ResetBackBtn } from "../../components/common/CommonButtons";
import { DataGrid } from "@mui/x-data-grid";

const GrievanceList = () => {
  const [tableData, setTableData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  const getCategoryList = async () => {
    try {
      const res = await getCategoryListService();
      setCategoryList(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const getSubCategoryList = async () => {
    try {
      const res = await getSubCategoryListService();
      setSubCategoryList(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate()
  const ViewUser = async (id) => {
      try {
          const sendData = {
            addGrievanceId: Number(id),
              isActive: false
          }
          const payload = encryptPayload(sendData)
          const res = await getGrievanceByIdService(payload)
          if (res?.status === 200 && res?.data.outcome) {
              navigate('/addGrievance', { state: res?.data.data })
          }
      } catch (error) {
          throw error
      }
  }
  const getTableData = async () => {
    try {
      const payload = encryptPayload({});
      const res = await getAllGrievanceService(payload);
      setTableData(res?.data?.data || []);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    }
  };
  console.log(categoryList[0]);

  const handleEdit = (id) => {
    console.log("Edit ID:", id);
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
      field: "grievanceCategory",
      headerName: "Category Type",
      flex: 1,
      valueGetter: (value, row) => {
        const cat = categoryList.find(
          d => String(d.grievanceCategoryId) === String(row?.grievanceCategory)
        );
        return cat?.grievanceCategoryName || "";
      },
    },
    {
      field: "grievanceSubCategory",
      headerName: "SubCategory Type",
      flex: 1,
      valueGetter: (value, row) => {
        const sub = subCategoryList.find(
          (d) => String(d.grvSubCtgId) === String(row?.grievanceSubCategory)
        );
        return sub?.grvSubCtgName|| "";
      },
    },
    {
      field: "contactNo",
      headerName: "Contact No",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "purpose",
      headerName: "Purpose",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <button
          className="h-8 w-8 bg-blue-500/25 text-blue-500 rounded-sm flex justify-center items-center"
          onClick={() => ViewUser(params.row.addGrievanceId)}
        >
          <FaEye />
        </button>
      ),
    },
  ];


{/* <div style={{ height: 500, width: "100%" }}>
  <DataGrid
    rows={tableData}
    columns={columns}
    getRowId={(row) => row.addGrievanceId}
    pageSizeOptions={[5, 10, 20]}
    initialState={{
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
      },
    }}
    disableRowSelectionOnClick
  />
</div> */}
  
  // const columns = [
  //   {
  //     name: "Sl No",
  //     selector: (row, index) => index + 1,
  //     width: "80px",
  //   },
  //   {
  //     name: "Category Type",
  //     selector: (row) => {
  //       const cat = categoryList.find(
  //         (d) => String(d.grievanceCategoryId) === String(row.grievanceCategory)
  //       );
  //       return cat?.grievanceCategoryName?.trim() || "N/A";
  //     },
  //   } ,
  //   {
  //     name: "SubCategory Type",
  //     selector: (row) => {
  //       const cat = subCategoryList.find(
  //         (d) => String(d.grvSubCtgId) === String(row.grievanceSubCategory)
  //       );
  //       return cat?.grvSubCtgName?.trim() || "N/A";
  //     },
  //   },
  //   {
  //     name: "Contact No",
  //     selector: (row) => row.contactNo || "N/A",
  //   },
  //   {
  //     name: "Email",
  //     selector: (row) => row.email || "N/A",
  //   },

  //   {
  //       name: "Purpose",
  //       selector: (row) => row.purpose || "N/A",
  //     },
  //     {
  //       name: "Actions",
  //       cell: (row) => (
  //         <div className="flex items-center gap-2">
  //           <button className="h-8 w-8 bg-blue-500/25 text-blue-500 rounded-sm flex justify-center items-center" onClick={() => ViewUser(row.addGrievanceId)}>
  //              <FaEye />
  //           </button>
  //         </div>
  //       ),
  //       width: "120px",
  //     }
  // ];

  useEffect(() => {
    getCategoryList();
    getSubCategoryList();
    getTableData();
  }, []);

  return (
    <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div>
        <h3 className="flex items-center gap-2 text-white font-normal text-[18px]
                       border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md">
          <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
           Grievance  List
        </h3>
      </div>

      {/* Table */}
      <div className="min-h-[120px] py-5 px-4 text-[#444]">
      <div style={{ height: 500, width: "100%" }}>
      <DataGrid
  rows={tableData || []}
  columns={columns}
  getRowId={(row) => row.addGrievanceId}

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
</div>        <ResetBackBtn />

      </div>
    </div>
  );
};

export default GrievanceList;
