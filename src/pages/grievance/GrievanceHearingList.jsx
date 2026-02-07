import React, { useEffect, useState } from "react";
import { FiFileText, FiEdit } from "react-icons/fi";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import {
  getHearingListService,
} from "../../services/grievanceService";

const GrievanceHearingList = () => {
  const [tableData, setTableData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  /* ---------------- GET CATEGORY NAME ---------------- */
  const getCategoryList = async () => {
    try {
      const res = await getHearingListService();
      setCategoryList(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- GET TABLE DATA ---------------- */
  const getTableData = async () => {
    try {
      const payload = encryptPayload({});
      const res = await getHearingListService(payload);
      setTableData(res?.data?.data || []);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    }
  };

  /* ---------------- EDIT HANDLER ---------------- */
  const handleEdit = (id) => {
    // navigate(`/grievance/monday-hearing/${id}`)
    console.log("Edit ID:", id);
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    // {
    //   name: "Grievance Category",
    //   selector: (row) => {
    //     const ctg = categoryList.find(
    //       (c) => String(c.grievanceCategoryId) === String(row.grvCtgId)
    //     );
    //     return ctg ? ctg.grievanceCategoryName : "N/A";
    //   },
    // },
    // {
    //   name: "Slot Date",
    //   selector: (row) => row.grvSlotDate || "N/A",
    // },
    {
      name: "Slot Time",
      selector: (row) => row.grievanceSlotTime || "N/A",
    },
    {
      name: "Subject",
      selector: (row) => row.subjectLine || "N/A",
      wrap: true,
    },
    {
      name: "Petitioner",
      selector: (row) => row.petitionerName || "N/A",
    },
    {
      name: "Contact No",
      selector: (row) => row.contactNo || "N/A",
    },
    {
      name: "Email",
      selector: (row) => row.email || "N/A",
    },

    {
        name: "Address",
        selector: (row) => row.address || "N/A",
      },
    // {
    //   name: "Action",
    //   selector: (row) => (
    //     <button
    //       className="flex items-center justify-center h-8 w-8 
    //                  bg-blue-500/20 text-blue-600 rounded-full"
    //       onClick={() => handleEdit(row.grvHearigId)}
    //     >
    //       <FiEdit className="w-4 h-4" />
    //     </button>
    //   ),
    //   width: "100px",
    // },
  ];

  useEffect(() => {
    getCategoryList();
    getTableData();
  }, []);

  return (
    <div className="mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div>
        <h3 className="flex items-center gap-2 text-white font-normal text-[18px]
                       border-b-2 border-[#ff9800] px-3 py-2 bg-light-dark rounded-t-md">
          <FiFileText className="text-[#fff2e7] text-[24px] p-1 bg-[#ff7900] rounded" />
          Monday Virtual Grievance Hearing List
        </h3>
      </div>

      {/* Table */}
      <div className="min-h-[120px] py-5 px-4 text-[#444]">
        <ReusableDataTable data={tableData} columns={columns} />
      </div>
    </div>
  );
};

export default GrievanceHearingList;