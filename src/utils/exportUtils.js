import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------------- PREPARE DATA ---------------- */
const prepareExportData = (data, columns) => {
  // Remove action column automatically
  const exportColumns = columns.filter(
    (col) => col.field !== "actions"
  );

  const formattedData = data.map((row, index) => {
    let obj = {};

    exportColumns.forEach((col) => {
      if (col.field === "slNo") {
        obj[col.headerName] = index + 1;
      } else if (col.valueGetter) {
        obj[col.headerName] = col.valueGetter({ row }) ?? "";
      } else {
        obj[col.headerName] = row[col.field] ?? "";
      }
    });

    return obj;
  });

  return { formattedData, exportColumns };
};

/* ---------------- EXPORT EXCEL ---------------- */
export const exportToExcel = (data, columns, fileName = "Report") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  const { formattedData } = prepareExportData(data, columns);

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, `${fileName}.xlsx`);
};

/* ---------------- EXPORT PDF ---------------- */
export const exportToPDF = (data, columns, fileName = "Report") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  const doc = new jsPDF();

  const { formattedData, exportColumns } = prepareExportData(
    data,
    columns
  );

  const tableColumn = exportColumns.map((col) => col.headerName);
  const tableRows = formattedData.map((row) =>
    Object.values(row)
  );

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
  });

  doc.save(`${fileName}.pdf`);
};
