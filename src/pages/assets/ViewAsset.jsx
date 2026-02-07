import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../components/common/CommonAccordion";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import SearchableInput from "../../components/common/SearchableInput";
import ReusableDialog from "../../components/common/ReusableDialog";
import { Tooltip } from "@mui/material";
import { GoEye, GoPencil } from "react-icons/go";
import { MdSend, MdHistory } from "react-icons/md";
import SelectField from "../../components/common/SelectField";
import { FiFileText } from "react-icons/fi";
import InputField from "../../components/common/InputField";

const ViewAsset = () => {
  const [dataTable, setDataTable] = useState([]);
  const [filters, setFilters] = useState({
    assetTypeId: "",
    departmentId: "",
    agencyId: "",
    projectId: "",
    geoTagStatus: "",
    lifeCycleStageCode: "",
  });

  const assetColumns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Asset ID",
      selector: (row) => row.assetId || "N/A",
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.assetName || "N/A",
      sortable: true,
    },
    {
      name: "Asset Type",
      selector: (row) => row.assetType || "N/A",
    },
    {
      name: "Sector",
      selector: (row) => row.sector || "N/A",
    },
    {
      name: "Sub Sector",
      selector: (row) => row.subSector || "N/A",
    },
    {
      name: "Agency",
      selector: (row) => row.agency || "N/A",
    },
    {
      name: "Project",
      selector: (row) => row.projectName || "—",
    },
    {
      name: "Location",
      selector: (row) => `${row.district} / ${row.block}`,
    },
    {
      name: "Status",
      selector: (row) => row.assetStatus,
    },
    {
      name: "Value",
      selector: (row) => `₹ ${row.currentValue?.toLocaleString()}`,
      right: true,
    },
    // {
    //   name: "Verification",
    //   selector: (row) => row.geoTagStatus,
    // },
    // {
    //   name: "Geo-tag Image",
    //   selector: (row) => row.geoTagImage,
    // },
    {
      name: "Action",
      width: "160px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View Asset">
            <button className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <GoEye />
            </button>
          </Tooltip>

          <Tooltip title="Edit Asset">
            <button className="h-8 w-8 rounded-full bg-blue-500/25 text-blue-600 flex items-center justify-center">
              <GoPencil />
            </button>
          </Tooltip>

          <Tooltip title="Submit for Approval">
            <button className="h-8 w-8 rounded-full bg-green-500/25 text-green-600 flex items-center justify-center">
              <MdSend />
            </button>
          </Tooltip>

          <Tooltip title="View Audit Log">
            <button className="h-8 w-8 rounded-full bg-indigo-500/25 text-indigo-600 flex items-center justify-center">
              <MdHistory />
            </button>
          </Tooltip>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
    },
  ];

  useEffect(() => {
    setDataTable([{}]);
  }, []);

  return (
    <>
      {/* ---------------- FILTER PANEL ---------------- */}
      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <h3 className="flex items-center gap-2 text-white text-[18px] px-3 py-2 bg-light-dark rounded-t-md">
          <FiFileText className="text-[24px] p-1 bg-[#ff7900] rounded" />
          Asset Filters
        </h3>

        <div className="grid grid-cols-12 gap-6 p-4">
          <div className="col-span-3">
            <SelectField
              label="Asset Type"
              name="assetType"
              placeholder="Select"
              value={filters.assetsTypeId}
              onChange={(e) =>
                setFilters({ ...filters, assetsTypeId: e.target.value })
              }
            />
          </div>

          <div className="col-span-3">
            <SelectField
              label="Department"
              name="department"
              placeholder="Select Department"
              value={filters.departmentId}
              onChange={(e) =>
                setFilters({ ...filters, departmentId: e.target.value })
              }
            />
          </div>

          <div className="col-span-3">
            <SelectField
              label="Implementing Agency"
              name="agency"
              placeholder="Select Agency"
              value={filters.agencyId}
              onChange={(e) =>
                setFilters({ ...filters, agencyId: e.target.value })
              }
            />
          </div>

          <div className="col-span-3">
            <SelectField
              label="Project"
              name="project"
              value={filters.projectId}
              onChange={(e) =>
                setFilters({ ...filters, projectId: e.target.value })
              }
            />
          </div>
          {/* 
          <div className="col-span-3">
            <SelectField label="Location" name="assetStatus" />
          </div> */}

          <div className="col-span-3">
            <SelectField label="Verification Status" name="geoTagStatus" />
          </div>

          <div className="col-span-3">
            <SelectField
              label="Lifecycle Stage"
              name="lifeCycleState"
              value={filters.lifeCycleStageCode}
              onChange={(e) =>
                setFilters({ ...filters, lifeCycleStageCode: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* ---------------- ASSET LIST TABLE ---------------- */}
      <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <h3 className="flex items-center gap-2 text-white text-[18px] px-3 py-2 bg-light-dark rounded-t-md">
          <FiFileText className="text-[24px] p-1 bg-[#ff7900] rounded" />
          Asset List
        </h3>

        <div className="min-h-[120px] py-5 px-4">
          <ReusableDataTable data={dataTable} columns={assetColumns} />
        </div>
      </div>

      {/* ---------------- CONFIRM DIALOG ---------------- */}
      <ReusableDialog
        title="Confirmation"
        description="Are you sure you want to submit this asset for approval?"
      />
    </>
  );
};

export default ViewAsset;
