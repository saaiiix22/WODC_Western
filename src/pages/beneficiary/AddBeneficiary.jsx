import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import { encryptPayload } from "../../crypto.js/encryption";
import { getProjectListService } from "../../services/projectService";
import { getMilesStoneListService } from "../../services/milesStoneService";
import { GrDocumentExcel } from "react-icons/gr";
import { GrDocumentUpload } from "react-icons/gr";

const AddBeneficiary = () => {
  const [formData, setFormData] = useState({
    projectId: "",
    milestoneId: "",
  });
  const [projectDropdown, setProjectDropdown] = useState([]);
  const [milestoneDropdown, setMilestoneDropdown] = useState([]);

  const getAllDropdowns = async () => {
    try {
      const payload = encryptPayload({
        isActive: true,
      });
      const projectRes = await getProjectListService(payload);
      if (projectRes?.status === 200 && projectRes?.data.outcome) {
        setProjectDropdown(projectRes?.data.data);
      }
      const milestoneRes = await getMilesStoneListService(payload);
      console.log(milestoneRes?.data.data);
      if (milestoneRes?.status === 200 && milestoneRes?.data.outcome) {
        setMilestoneDropdown(milestoneRes?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const dummyDetails = {
    projectName: "Rural Water Supply Project",
    agencyName: "Odisha Water Resources Dept.",
    milestoneName: "Phase 1 — Pipeline Installation",
    startDate: "2024-01-10",
    endDate: "2024-06-20",
    actualStartDate: "2024-01-15",
    actualEndDate: "2024-07-05",
    delayDays: 15,
    amount: "1,20,00,000",
  };

  useEffect(() => {
    getAllDropdowns();
  }, []);

  const handleInput = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form action="">
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
            Add Beneficiary
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <SelectField
                label={"Project"}
                required={true}
                name={"projectId"}
                value={formData.projectId}
                onChange={handleInput}
                placeholder="Select"
                options={projectDropdown?.map((opt) => ({
                  value: opt.projectId,
                  label: opt.projectName,
                }))}
              />
            </div>
            <div className="col-span-2">
              <SelectField
                label={"Milestone"}
                required={true}
                name={"milestoneId"}
                value={formData.milestoneId}
                onChange={handleInput}
                placeholder="Select"
                options={milestoneDropdown?.map((opt) => ({
                  value: opt.milestoneId,
                  label: opt.milestoneName,
                }))}
              />
            </div>
            <div className="col-span-12">
              <div className="">
                {/* Header Section (Minimal) */}
                <div className="flex items-center mb-5 gap-5">
                  <div className="flex items-center">
                    <h3 className="text-xl font-semibold text-light-dark">
                      Project Overview
                    </h3>
                  </div>
                  <div className="flex items-center">
                    <button className="me-3 text-sm flex items-center gap-1 px-3 py-1 rounded-sm bg-green-600/25 text-green-700">
                      <GrDocumentExcel />
                      Excel
                    </button>
                    <button type="button" className="me-3 text-sm flex items-center gap-1 px-3 py-1 rounded-sm bg-blue-600/25 text-blue-700" onClick={() => document.getElementById("fileUpload").click()}>
                      <GrDocumentUpload /> Upload
                    </button>
                  </div>
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    onChange={(e) =>
                      console.log("Selected file:", e.target.files[0])
                    }
                  />
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Project Name (Blue - Primary Identity) */}
                  <div className="flex flex-col p-4 bg-blue-100 rounded-lg shadow-sm">
                    <span className="text-xs font-medium uppercase text-blue-700 mb-1">
                      Project Name
                    </span>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {dummyDetails.projectName}
                    </p>
                  </div>

                  {/* Agency Name (Violet - Secondary Identity) */}
                  <div className="flex flex-col p-4 bg-violet-100 rounded-lg shadow-sm">
                    <span className="text-xs font-medium uppercase text-violet-700 mb-1">
                      Agency Name
                    </span>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {dummyDetails.agencyName}
                    </p>
                  </div>

                  {/* Milestone (Green - Status/Progress) */}
                  <div className="flex flex-col p-4 bg-green-100 rounded-lg shadow-sm">
                    <span className="text-xs font-medium uppercase text-green-700 mb-1">
                      Milestone
                    </span>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {dummyDetails.milestoneName}
                    </p>
                  </div>

                  {/* Amount (Pink - Financial) */}
                  <div className="flex flex-col p-4 bg-pink-100 rounded-lg shadow-sm">
                    <span className="text-xs font-medium uppercase text-pink-700 mb-1">
                      Amount
                    </span>
                    <p className="text-sm font-semibold text-gray-900">
                      <span className="text-xs font-normal">₹</span>{" "}
                      {dummyDetails.amount}
                    </p>
                  </div>

                  {/* Start Date (Teal - Planned Timeline) */}
                  <div className="flex flex-col p-4 bg-teal-100 rounded-lg shadow-sm">
                    <span className="text-xs font-medium uppercase text-teal-700 mb-1">
                      Start Date
                    </span>
                    <p className="text-sm font-medium text-gray-800">
                      {dummyDetails.startDate}
                    </p>
                  </div>

                  {/* End Date (Orange - Planned Deadline) */}
                  <div className="flex flex-col p-4 bg-orange-100 rounded-lg shadow-sm">
                    <span className="text-xs font-medium uppercase text-orange-700 mb-1">
                      End Date
                    </span>
                    <p className="text-sm font-medium text-gray-800">
                      {dummyDetails.endDate}
                    </p>
                  </div>

                  {/* Actual Start Date (Sky Blue - Actual Timeline) */}
                  <div className="flex flex-col p-4 bg-sky-100 rounded-lg shadow-sm">
                    <span className="text-xs font-medium uppercase text-sky-700 mb-1">
                      Actual Start
                    </span>
                    <p className="text-sm font-medium text-gray-800">
                      {dummyDetails.actualStartDate}
                    </p>
                  </div>

                  {/* Actual End Date (Lime - Actual Completion) */}
                  <div className="flex flex-col p-4 bg-lime-100 rounded-lg shadow-sm">
                    <span className="text-xs font-medium uppercase text-lime-700 mb-1">
                      Actual End
                    </span>
                    <p className="text-sm font-medium text-gray-800">
                      {dummyDetails.actualEndDate}
                    </p>
                  </div>

                  {/* Delay (Critical Red/Dynamic Highlight) */}
                  <div
                    className="col-span-2 flex flex-col items-center justify-center p-4 rounded-lg shadow-md 
                    bg-red-500 text-white transform hover:scale-105 transition-transform duration-200"
                  >
                    <span className="text-sm uppercase text-red-200 mb-0.5">
                      Delay
                    </span>
                    <p className="text-3xl font-extrabold tracking-tight">
                      {dummyDetails.delayDays}
                    </p>
                    <span className="text-sm uppercase">Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Optional) */}
        <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          <SubmitBtn />
        </div>
      </div>
    </form>
  );
};

export default AddBeneficiary;
