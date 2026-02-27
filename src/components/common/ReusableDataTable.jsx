import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf, FaFileExcel, FaSearch } from "react-icons/fa";

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

  const getExportData = () =>
    filteredData.map((row, index) => {
      const obj = {};
      columns.forEach((col) => {
        if (!col.ignoreExport && col.exportValue) {
          obj[col.name] = col.exportValue(row, index);
        }
      });
      return obj;
    });

  const handleExportExcel = () => {
    if (!filteredData.length) return;

    const worksheet = XLSX.utils.json_to_sheet(getExportData());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `table-data-${Date.now()}.xlsx`
    );
  };

  const handleExportPDF = () => {
    if (!filteredData.length) return;

    const doc = new jsPDF("l", "mm", "a4");
    const tableColumn = columns.map((col) => col.name);
    const tableRows = getExportData().map((row) => Object.values(row));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [255, 237, 213],
        textColor: 40,
      },
    });

    doc.save(`table-data-${Date.now()}.pdf`);
  };

  const customStyles = {
    table: {
      style: {
        borderRadius: "10px",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#fff7ed",
        borderBottom: "2px solid #fed7aa",
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "13px",
        color: "#78350f",
        textAlign: "center",
        padding: "14px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        color: "#374151",
        minHeight: "50px",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#fff7ed",
        cursor: "pointer",
      },
    },
    cells: {
      style: {
        padding: "12px",
        borderRight: "1px solid #fde68a",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #fde68a",
        fontSize: "13px",
      },
    },
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-orange-100">
      {/* Header */}
      <div className="flex flex-wrap gap-3 items-center justify-between p-4 border-b border-orange-100 bg-orange-50/50">
        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold
              text-red-700 bg-red-100 border border-red-300 rounded-md
              hover:bg-red-200 transition"
          >
            <FaFilePdf />
            Export PDF
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold
              text-green-700 bg-green-100 border border-green-300 rounded-md
              hover:bg-green-200 transition"
          >
            <FaFileExcel />
            Export Excel
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search records..."
            className="pl-9 pr-3 py-1.5 text-sm border border-orange-200
              rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        highlightOnHover
        pointerOnHover
        responsive
        fixedHeader
        // fixedHeaderScrollHeight="520px"
        customStyles={customStyles}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30, 50]}
      />
    </div>
  );
};

export default ReusableDataTable;