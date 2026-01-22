import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";

const ReusableDataTable = ({ data = [], columns }) => {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  const customStyles = {
    table: {
      style: {
        border: "1px solid #ebbea6",
        fontFamily:
          "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
    },

    headRow: {
      style: {
        backgroundColor: "#f4f0f2",
        borderBottom: "2px solid #ebbea6",
        minHeight: "52px",
      },
    },

    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "13px",
        letterSpacing: "0.6px",
        textTransform: "capitalize",
        color: "#4b5563",
        textAlign: "center",
        borderRight: "1px solid #ebbea6",
        padding: "12px",
      },
    },

    rows: {
      style: {
        fontSize: "14px",
        fontWeight: "400",
        color: "#1f2937",
        minHeight: "48px",
        borderBottom: "1px solid #ebbea6",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#fff7f2",
        borderBottom: "1px solid #ebbea6",
        outline: "1px solid #ebbea6",
        transition: "background-color 0.2s ease",
        cursor: "pointer",
      },
    },
    cells: {
      style: {
        padding: "10px 14px",
        borderRight: "1px solid #ebbea6",
        whiteSpace: "normal",
        wordBreak: "break-word",
        lineHeight: "1.4",
      },
    },

    pagination: {
      style: {
        borderTop: "1px solid #ebbea6",
        fontSize: "13px",
        fontFamily:
          "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
    },
  };

  return (
    <div className="w-full ">
      <div className="mb-3 flex justify-end">
        <input
          type="text"
          placeholder="Search"
          className="border border-[#ebbea6] px-3 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        highlightOnHover
        pointerOnHover
        striped
        responsive
        noHeader
        fixedHeader
        fixedHeaderScrollHeight="550px"
        customStyles={customStyles}
        stripedRowsStyle={{ backgroundColor: "#fffaf7" }}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30, 50]}
      />
    </div>
  );
};

export default ReusableDataTable;
