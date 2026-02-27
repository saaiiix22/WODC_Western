import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import {
  getAllGrievanceService,
  getCategoryListService,
  getGrievanceByIdService,
  getSubCategoryListService,
} from "../../services/grievanceService";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ResetBackBtn } from "../../components/common/CommonButtons";
import { DataGrid } from "@mui/x-data-grid";
import { forwardListByMenuService } from "../../services/workflowService";
import { GrSave } from "react-icons/gr";

const GrievanceList = () => {
  const [tableData, setTableData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [activeTab, setActiveTab] = useState("PENDING");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const navigate = useNavigate();

  /* =========================
     FETCH TABLE DATA
  ========================== */
  const getTableData = async (status = null) => {
    try {
      const payload = encryptPayload(
        status ? { status: status } : {}
      );

      const res = await getAllGrievanceService(payload);

      const rawData = res?.data?.data || [];

      const mappedData = rawData.map((row) => {
        const cat = categoryList.find(
          (d) =>
            String(d.grievanceCategoryId) ===
            String(row.grievanceCategory)
        );

        const sub = subCategoryList.find(
          (d) =>
            String(d.grvSubCtgId) ===
            String(row.grievanceSubCategory)
        );

        return {
          ...row,
          grievanceCategoryName:
            cat?.grievanceCategoryName?.trim() || "N/A",
          grievanceSubCategoryName:
            sub?.grvSubCtgName?.trim() || "N/A",
        };
      });

      setTableData(mappedData);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    }
  };

  /* =========================
     INITIAL LOAD (Categories + Subcategories)
  ========================== */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          getCategoryListService(),
          getSubCategoryListService(),
        ]);

        const categories = catRes?.data?.data || [];
        const subCategories = subRes?.data?.data || [];

        setCategoryList(categories);
        setSubCategoryList(subCategories);
      } catch (error) {
        toast.error("Failed to load master data");
      }
    };

    loadInitialData();
  }, []);

  /* =========================
     REFRESH DATA ON TAB CHANGE
  ========================== */
  useEffect(() => {
    if (activeTab === "PENDING") {
      getTableData(); // show all
    } else {
      getTableData(activeTab); // fetch by status
    }
  }, [activeTab, categoryList, subCategoryList]);

  /* =========================
     VIEW
  ========================== */
  const ViewUser = async (id) => {
    try {
      const payload = encryptPayload({
        addGrievanceId: Number(id),
        isActive: false,
      });

      const res = await getGrievanceByIdService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        navigate("/addGrievance", {
          state: { ...res?.data.data },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     COLUMNS
  ========================== */
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
    { field: "grievanceCategoryName", headerName: "Category", flex: 1 },
    { field: "grievanceSubCategoryName", headerName: "SubCategory", flex: 1 },
    { field: "petitionerName", headerName: "Name", flex: 1 },
    { field: "contactNo", headerName: "Contact No", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "purpose", headerName: "Purpose", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <button
          className="h-8 w-8 bg-blue-500/25 text-blue-500 rounded-sm flex justify-center items-center"
          onClick={() =>
            ViewUser(params.row.addGrievanceId)
          }
        >
          <FaEye />
        </button>
      ),
    },
  ];

  return (
    <div className="mt-3 p-2 bg-white rounded-sm border shadow">
      {/* Header */}
      <h3 className="flex items-center gap-2 text-white text-[18px] px-3 py-2 bg-light-dark rounded-t-md">
        <FiFileText className="text-[24px] bg-[#ff7900] p-1 rounded" />
        Grievance List
      </h3>

      {/* Tabs */}
      <div className="bg-gray-100 p-4 rounded-md my-4 flex gap-4">
        {["PENDING", "APPROVED", "REJECTED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md border transition ${
              activeTab === tab
                ? "bg-white border-gray-500 shadow-sm"
                : "bg-gray-200 border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3 mb-3">
        <button
          onClick={() =>
            exportToExcel(tableData, columns, "Grievance_List")
          }
          className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-300 transition"
        >
          Export Excel
        </button>

        <button
          onClick={() =>
            exportToPDF(tableData, columns, "Grievance_List")
          }
          className="px-4 py-2 bg-rose-100 text-rose-700 border border-rose-300 rounded hover:bg-rose-300 transition"
        >
          Export PDF
        </button>
      </div>

      {/* Table */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={tableData || []}
          columns={columns}
          getRowId={(row) => row.addGrievanceId}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </div>

      <ResetBackBtn />
    </div>
  );
};

export default GrievanceList;