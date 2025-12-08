
import DataTable from "react-data-table-component";

const ReusableDataTable = ({ data, columns }) => {
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
        "&:last-of-type": {
          borderBottom: 0,
        },
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
    <DataTable
      columns={columns}
      data={data}
      highlightOnHover
      pointerOnHover
      striped
      responsive
      noHeader
      fixedHeader          
      fixedHeaderScrollHeight="550px" 
      customStyles={customStyles}
    />
  );
};

export default ReusableDataTable;
