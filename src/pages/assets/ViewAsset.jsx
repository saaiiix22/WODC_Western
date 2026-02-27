import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { GoEye, GoPencil } from "react-icons/go";
import { MdSend, MdHistory } from "react-icons/md";
import SelectField from "../../components/common/SelectField";
import { FiFileText } from "react-icons/fi";
import {
  getAssetsListService,
  getAssetsTypeListService,
  getAssetsLookupValuesService,
} from "../../services/assetsService";
import { getAllProjectService } from "../../services/projectService";
import { encryptPayload } from "../../crypto.js/encryption";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";
import { ResetBackBtn } from "../../components/common/CommonButtons";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const ViewAsset = () => {
  const navigate = useNavigate();
  const [dataTable, setDataTable] = useState([]);
  const [filters, setFilters] = useState({
    assetsTypeId: "",
    departmentId: "",
    agencyId: "",
    projectId: "",
    geoTagStatus: "",
    lifeCycleStageCode: "",
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5, // default page size
  });

  const [assetTypes, setAssetTypes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [lifeCycleStages, setLifeCycleStages] = useState([]);

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
    {
      field: "assetsId",
      headerName: "Asset ID",
      flex: 1,
      sortable: true,
      valueFormatter: (value) => value || "N/A",
    },
    {
      field: "assetsName",
      headerName: "Asset Name",
      flex: 1,
      sortable: true,
      valueFormatter: (value) => value || "N/A",
    },
    {
      field: "assetsTypeName",
      headerName: "Asset Type",
      flex: 1,
      valueFormatter: (value) => value || "N/A",
    },
    {
      field: "sectorName",
      headerName: "Sector",
      flex: 1,
      valueFormatter: (value) => value || "N/A",
    },
    {
      field: "subSectorName",
      headerName: "Sub Sector",
      flex: 1,
      valueFormatter: (value) => value || "N/A",
    },
    {
      field: "agencyName",
      headerName: "Agency",
      flex: 1,
      valueFormatter: (value) => value || "N/A",
    },
    {
      field: "projectName",
      headerName: "Project",
      flex: 1,
      valueFormatter: (value) => value || "—",
    },
    {
      field: "assetLifeCycleStageCode",
      headerName: "Status",
      flex: 1,
      valueFormatter: (value) => value || "N/A",
    },
    {
      field: "assetAmount",
      headerName: "Value",
      flex: 1,
      valueFormatter: (value) => `₹ ${value?.toLocaleString()}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          {/* <Tooltip title="View Asset">
            <button className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <GoEye />
            </button>
          </Tooltip> */}

          <div className="p-2">
            <Tooltip title="Edit Asset">
              <button
                onClick={() => handleEdit(params.row)}
                className="h-8 w-8 rounded-full bg-blue-500/25 text-blue-600 flex items-center justify-center"
              >
                <GoPencil />
              </button>
            </Tooltip>
          </div>

          {/* <Tooltip title="Submit for Approval">
            <button className="h-8 w-8 rounded-full bg-green-500/25 text-green-600 flex items-center justify-center">
              <MdSend />
            </button>
          </Tooltip>

          <Tooltip title="View Audit Log">
            <button className="h-8 w-8 rounded-full bg-indigo-500/25 text-indigo-600 flex items-center justify-center">
              <MdHistory />
            </button>
          </Tooltip> */}
        </div>
      ),
    },
  ];

  const loadAssets = async (filterValues = filters) => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filterValues).map(([key, value]) => [
          key === "assetTypeId" ? "assetsTypeId" : key,
          value === "" ? null : value,
        ]),
      );

      const encrypted = encryptPayload(cleanFilters);

      const res = await getAssetsListService(encrypted);

      if (res?.data?.outcome) {
        setDataTable(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (row) => {
    // Navigate to create asset page with the asset data for editing
    navigate("/createAsset", { state: { asset: row } });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);

    // Refetch data immediately when filter changes
    loadAssets(updatedFilters);
  };

  const loadAssetTypes = async () => {
    try {
      const res = await getAssetsTypeListService();
      setAssetTypes(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProjects = async () => {
    try {
      const payload = encryptPayload({ isActive: true });

      const res = await getAllProjectService(payload);
      setProjects(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadLifeCycleStages = async () => {
    try {
      const res = await getAssetsLookupValuesService("ASSET_LIFECYCLE_STAGE");
      setLifeCycleStages(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAssetTypes();
    loadProjects();
    loadLifeCycleStages();
    loadAssets();
  }, []);

  return (
    <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div>
        <h3
          className="flex items-center gap-2 text-white font-normal text-[18px]
                       border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md"
        >
          <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
          Asset List
        </h3>
      </div>

      {/* Table */}
      <div className="min-h-[120px] h-auto py-5 px-4 text-[#444]">
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-3">
            <SelectField
              label="Asset Type"
              name="assetsTypeId"
              placeholder="Select"
              value={filters.assetsTypeId}
              onChange={handleFilterChange}
              options={assetTypes.map((d) => ({
                value: d.assetsTypeId,
                label: d.assetsTypeName,
              }))}
            />
          </div>

          <div className="col-span-3">
            <SelectField
              label="Department"
              name="departmentId"
              placeholder="Select Department"
              value={filters.departmentId}
              onChange={handleFilterChange}
            />
          </div>

          <div className="col-span-3">
            <SelectField
              label="Implementing Agency"
              name="agencyId"
              placeholder="Select Agency"
              value={filters.agencyId}
              onChange={handleFilterChange}
            />
          </div>

          <div className="col-span-3">
            <SelectField
              label="Project"
              name="projectId"
              value={filters.projectId}
              onChange={handleFilterChange}
              options={projects.map((d) => ({
                value: d.projectId,
                label: d.projectName,
              }))}
            />
          </div>

          <div className="col-span-3">
            <SelectField
              label="Verification Status"
              name="geoTagStatus"
              value={filters.geoTagStatus}
              onChange={handleFilterChange}
              options={[
                { value: "Verified", label: "Verified" },
                { value: "Not Verified", label: "Not Verified" },
              ]}
            />
          </div>

          <div className="col-span-3">
            <SelectField
              label="Lifecycle Stage"
              name="lifeCycleStageCode"
              value={filters.lifeCycleStageCode}
              onChange={handleFilterChange}
              options={lifeCycleStages.map((d) => ({
                value: d.lookupValueCode,
                label: d.lookupValueName,
              }))}
            />
          </div>
        </div>

        <div className="flex gap-3 mb-3">
          <button
            onClick={() =>
              exportToExcel(
                dataTable,
                columns.filter((col) => col.field !== "actions"),
                "Asset_List",
              )
            }
            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-300 transition"
          >
            Export Excel
          </button>

          <button
            onClick={() =>
              exportToPDF(
                dataTable,
                columns.filter((col) => col.field !== "actions"),
                "Asset_List",
              )
            }
            className="px-4 py-2 bg-rose-100 text-rose-700 border border-rose-300 rounded hover:bg-rose-300 transition"
          >
            Export PDF
          </button>
        </div>

        <div className="h-[400px]">
          <DataGrid
            rows={dataTable}
            columns={columns}
            getRowId={(row) => row.assetsId}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            slotProps={{
              toolbar: { showQuickFilter: true },
            }}
          />
        </div>

        <ResetBackBtn />
      </div>
    </div>
  );
};

export default ViewAsset;
