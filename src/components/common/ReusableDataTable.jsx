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
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f4f0f2",
        borderBottom: "1px solid #ebbea6",
      },
    },
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "14px",
        textAlign: "center",
        borderRight: "1px solid #ebbea6",
        position: "sticky",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        borderBottom: "1px solid #ebbea6",
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #ebbea6",
        textAlign: "left",
        padding: "8px 12px",
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
  };

  return (
    <div className="w-full">
      {/* 🔍 Search Box */}
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

        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30, 50]}
      />
    </div>
  );
};

export default ReusableDataTable;
