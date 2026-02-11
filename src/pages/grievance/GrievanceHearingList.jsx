
import React, { useEffect, useState } from "react";
import { FiFileText, FiEdit } from "react-icons/fi";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import {
  getGrievanceHearingByIdService,
  getHearingListService,
} from "../../services/grievanceService";
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { ResetBackBtn } from "../../components/common/CommonButtons";
import { DataGrid} from "@mui/x-data-grid";

const GrievanceHearingList = () => {
  const [tableData, setTableData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  /* ---------------- GET CATEGORY NAME ---------------- */
  const getCategoryList = async () => {
    try {
      const res = await getHearingListService();
      setCategoryList(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- GET TABLE DATA ---------------- */
  const getTableData = async () => {
    try {
      const payload = encryptPayload({});
      const res = await getHearingListService(payload);
      setTableData(res?.data?.data || []);
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
      field: "grvSlotDateId",
      headerName: "Slot Date",
      flex: 1,
      renderCell: (params) => {
        const value = params.row.grvSlotDateId;
        return value
          ? new Date(Number(value)).toLocaleDateString("en-GB")
          : "N/A";
      },
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
      renderCell: (params) => {
        const value = params.row.createdOn;
        return value
          ? new Date(Number(value)).toLocaleDateString("en-GB")
          : "N/A";
      },
    }
    
,    
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
  
  // const columns = [
  //   {
  //     name: "Sl No",
  //     selector: (row, index) => index + 1,
  //     width: "80px",
  //   },

  //   {
  //     name: "Name",
  //     selector: (row) => row.petitionerName || "N/A",
  //   },
  //   {
  //     name: "Category",
  //     selector: (row) => row.ctgName || "N/A",
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
  //     name: "Slot Date",
  //     selector: (row) => {
  //       if (!row.grvSlotDateId) return "N/A";
  //       const date = new Date(row.grvSlotDateId); 
  //       return date.toLocaleDateString("en-GB"); 
  //     },
  //   },
  //   {
  //     name: "Slot Time",
  //     selector: (row) => row.grievanceSlotTime || "N/A",
  //   },
  //   {
  //     name: "Issued Date",
  //     selector: (row) =>{ if (!row.createdOn) return "N/A";
  //       const date = new Date(row.createdOn); 
  //       return date.toLocaleDateString("en-GB"); 
  //   },
  // },
  //   {
  //     name: "Subject",
  //     selector: (row) => row.subjectLine || "N/A",
  //     wrap: true,
  //   },
  //   {
  //       name: "Address",
  //       selector: (row) => row.address || "N/A",
  //     },
  //     {
  //       name: "Actions",
  //       cell: (row) => (
  //         <div className="flex items-center gap-2">
  //           <button className="h-8 w-8 bg-blue-500/25 text-blue-500 rounded-sm flex justify-center items-center" onClick={() => ViewUser(row.grvHearigId)}>
  //              <FaEye />
  //           </button>
  //         </div>
  //       ),
  //       width: "120px",
  //     }
      
  // ];

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
          Monday Virtual Grievance Hearing List
        </h3>
      </div>

      {/* Table */}
      <div className="min-h-[120px] py-5 px-4 text-[#444]">
      <div style={{ height: 600, width: "100%" }}>
      <DataGrid
  rows={tableData}
  columns={columns}
  getRowId={(row) => row.grvHearigId}   // ✅ FIX
  pageSize={10}
  rowsPerPageOptions={[10, 20, 50]}
  disableRowSelectionOnClick
  slotProps={{
    toolbar: {
      showQuickFilter: true,
    },
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
