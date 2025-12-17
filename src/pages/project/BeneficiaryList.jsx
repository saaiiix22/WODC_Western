import React, { useEffect, useState } from "react";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { FiFileText } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { encryptPayload } from "../../crypto.js/encryption";
import { getDetailsByProjectAndMilestoneIdService } from "../../services/workOrderGenerationService";
import ReusableDataTable from "../../components/common/ReusableDataTable";

const BeneficiaryList = () => {
  const projectMilestoneDetails = useLocation();
  console.log(projectMilestoneDetails?.state);

  const [tableData, setTableData] = useState([]);
  const getAllTableData = async () => {
    try {
      if (projectMilestoneDetails?.state) {
        const payload = encryptPayload({
          projectId: projectMilestoneDetails?.state.projectId,
          milestoneId: projectMilestoneDetails?.state.milestoneId,
        });
        const res = await getDetailsByProjectAndMilestoneIdService(payload);
        console.log(res);
        if (res?.data.outcome && res?.status === 200) {
          setTableData(res?.data.data.beneficiaryDto);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const beneficiaryColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Beneficiary Name",
      selector: (row) => row.beneficiaryName || "N/A",
      sortable: true,
    },
    {
      name: "Contact Number",
      selector: (row) => row.contactNo || "N/A",
      sortable: true,
    },
    {
      name: "Aadhar Number",
      selector: (row) => row.aadhaarNo || "N/A",
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address || "N/A",
      sortable: true,
    },
  ];

  useEffect(() => {
    getAllTableData();
  }, []);

  return (
    <div
      className="
            mt-3 p-2 bg-white rounded-sm border border-[#f1f1f1]
            shadow-[0_4px_12px_rgba(0,0,0,0.08)]
          "
    >
      {/* Header */}
      <div className="p-0">
        <h3
          className="
                flex items-center gap-2 text-white font-normal text-[18px]
                border-b-2 border-[#ff9800] px-3 py-2
                bg-light-dark rounded-t-md
              "
        >
          <FiFileText
            className="
                  text-[#fff2e7] text-[24px] p-1
                  bg-[#ff7900] rounded
                "
          />
          Beneficiary List
        </h3>
      </div>

      {/* Body */}
      <div className="min-h-[120px] py-5 px-4 text-[#444]">
        <ReusableDataTable data={tableData} columns={beneficiaryColumn} />
      </div>

      {/* Footer (Optional) */}
      <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
        <ResetBackBtn />
        <SubmitBtn />
      </div>
    </div>
  );
};

export default BeneficiaryList;
