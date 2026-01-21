
import ReusableDataTable from "../../../../components/common/ReusableDataTable";

const GisTable = ({ data = [] }) => {
  const columns = [
    {
      name: "Sl. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "70px",
    },
    {
      name: "Project Name",
      selector: (row) => row.projectName || "N/A",
      sortable: true,
      wrap: true,
      width: "250px",
    },
    {
      name: "District",
      selector: (row) => row.districtName || row.blockName || "N/A",
      sortable: true,
    },
    {
      name: "Sector",
      selector: (row) => row.sectorName || "N/A",
      sortable: true,
      width: "150px",
    },

    {
      name: "Status",
      selector: (row) => row.projectStatus || row.status || "N/A",
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${row.projectStatus === "APPROVED"
            ? "bg-green-100 text-green-800"
            : row.projectStatus === "ONGOING"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
            }`}
        >
          {row.projectStatus || row.status || "N/A"}
        </span>
      ),
    },
    {
      name: "Estimated Cost",
      selector: (row) => row.estimatedCost ? `₹${row.estimatedCost}` : "N/A",
      sortable: true,
      right: true,
    },
    {
      name: "Risk",
      selector: (row) => "MEDIUM",
      sortable: true,
      cell: (row) => (
        <span className="text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded-full text-xs">
          MEDIUM
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 px-2 border-l-4 border-blue-500">
        Project List
      </h3>
      <ReusableDataTable data={data} columns={columns} />
    </div>
  );
};

export default GisTable;