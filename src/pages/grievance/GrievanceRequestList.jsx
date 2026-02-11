import React, { useEffect, useState } from "react";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { Tooltip } from "@mui/material";
import { GoEye } from "react-icons/go";

const GrievanceRequestList = () => {
  // Sl.No	Token No.	Status	Contact No	Email Id	Issued Date	Action

  const [dataTable, setDataTable] = useState([]);
    const [count, setCount] = useState(1);
    const [pageInfo, setPageInfo] = useState({
            totalPages: 0,
            totalElements: 0,
            first: true,
            last: false
        })

  const grievanceRequestColumns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Token No.",
      selector: (row) => row.tokenId || "N/A",
    },
    {
      name: "Status",
      selector: (row) => row.status || "N/A",
    },
    {
      name: "Contact No.",
      selector: (row) => row.assetType || "N/A",
    },
    {
      name: "Email Id",
      selector: (row) => row.sector || "N/A",
    },
    {
      name: "Issued Date",
      selector: (row) => row.subSector || "N/A",
    },
    {
      name: "Action",
      width: "160px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View ">
            <button className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <GoEye />
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
    <div>
      <>
        <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h3 className="flex items-center gap-2 text-white text-[18px] px-3 py-2 bg-light-dark rounded-t-md">
            Grievance Requested List
          </h3>

          <div className="min-h-[120px] py-5 px-4">
            <ReusableDataTable
              data={dataTable}
              columns={grievanceRequestColumns}
            />
          </div>

          {/* pagination  */}
          <div className="col-span-12 grid grid-cols-12 items-center mt-3">
            <div className="col-span-6 flex items-center gap-1">
              <label className="text-sm">Show</label>
              <select
                name="size"
                // value={formData.size}
                // onChange={handleChange}
                className="px-2 border border-slate-400"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm">Pages</span>
            </div>

            <div className="col-span-6 flex flex-col items-end gap-2 justify-end w-full">
              <label className="text-sm">
                Showing page {count} of {pageInfo.totalPages} pages
              </label>

              <div className="flex gap-2 justify-end mt-1">
                <button
                  className="px-2 py-0.5 bg-slate-200 text-[11px]"
                  disabled={pageInfo.first}
                  onClick={() => setCount(1)}
                >
                  First
                </button>

                <button
                  className="px-2 py-0.5 bg-slate-200 text-[11px]"
                  disabled={pageInfo.first}
                  onClick={() => setCount((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>

                <button
                  className="px-2 py-0.5 bg-slate-200 text-[11px]"
                  disabled={pageInfo.last}
                  onClick={() => setCount((prev) => prev + 1)}
                >
                  Next
                </button>

                <button
                  className="px-2 py-0.5 bg-slate-200 text-[11px]"
                  disabled={pageInfo.last}
                  onClick={() => setCount(pageInfo.totalPages)}
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default GrievanceRequestList;
