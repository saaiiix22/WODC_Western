import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import { encryptPayload } from "../../crypto.js/encryption";
import {
  getBeneficaryDetailsServiceInProject,
  getBeneficiaryByIdsService,
  getMilestoneByProjectIdService,
  getProjectAgencyMilestoneMapDetailsService,
  getProjectListService,
  saveUpdateAgencyMilestoneService,
} from "../../services/projectService";
import { GrDocumentExcel } from "react-icons/gr";
import { GrDocumentUpload } from "react-icons/gr";
import { toast } from "react-toastify";
const AddBeneficiary = () => {
  const [formData, setFormData] = useState({
    projectId: "",
    milestoneId: "",
  });
  const [uploadType, setUploadType] = useState("");

  const handleInp = (e) => {
    const value = e.target.value;
    setUploadType(value);
  };

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
    } catch (error) {
      throw error;
    }
  };

  const getMilestoneOpts = async () => {
    try {
      const milestonePayload = encryptPayload({
        isActive: true,
        projectId: formData.projectId,
      });
      const milestoneRes = await getMilestoneByProjectIdService(
        milestonePayload
      );
      // console.log(milestoneRes);
      if (milestoneRes?.status === 200 && milestoneRes?.data.outcome) {
        setMilestoneDropdown(milestoneRes?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleInput = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [projectOverView, setProjectOverView] = useState({});
  const getAllMappedRows = async () => {
    try {
      const payload = encryptPayload({
        projectId: formData.projectId,
        milestoneId: formData.milestoneId,
      });
      const res = await getProjectAgencyMilestoneMapDetailsService(payload);
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setProjectOverView(res?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);

  const [tableData, setTableData] = useState([]);
  const getTableFormData = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getBeneficaryDetailsServiceInProject(payload);
      // console.log(res);
      setTableData(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  const handleCheckboxChange = (beneficiaryId) => {
    setActiveArr((prev) =>
      prev.includes(beneficiaryId)
        ? prev.filter((id) => id !== beneficiaryId)
        : [...prev, beneficiaryId]
    );

    setSelectedBeneficiaries((prev) =>
      prev.includes(beneficiaryId)
        ? prev.filter((id) => id !== beneficiaryId)
        : [...prev, beneficiaryId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sendData = {
        projAgnMlstId: projectOverView?.projectAgencyMilestoneMapId,
        beneficiaryIds: activeArr,
      };
      const payload = encryptPayload(sendData);
      const res = await saveUpdateAgencyMilestoneService(payload);

      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);

        // reset states
        setUploadType("");
        setActiveArr([]);
      }
    } catch (error) {
      throw error;
    }
  };

  const [activeArr, setActiveArr] = useState([]);
  const activeBeneficiaryArray = async () => {
    try {
      const payload = encryptPayload({
        projectAgencyMilestoneMapId:
          projectOverView?.projectAgencyMilestoneMapId,
      });

      const res = await getBeneficiaryByIdsService(payload);
      console.log(res);
      setActiveArr(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllDropdowns();
  }, []);

  useEffect(() => {
    if (formData.projectId) {
      getMilestoneOpts();
    }
  }, [formData.projectId]);

  useEffect(() => {
    if (uploadType === "ADD_BENEFICIARY") {
      activeBeneficiaryArray();
      getTableFormData();
    }
  }, [uploadType]);

  useEffect(() => {
    if (formData.projectId && formData.milestoneId) {
      getAllMappedRows();
    }
  }, [formData.milestoneId, formData.projectId]);

  return (
    <form action="" onSubmit={handleSubmit}>
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
                disabled={formData.projectId ? false : true}
                placeholder="Select"
                options={milestoneDropdown?.map((opt) => ({
                  value: opt.milestoneId,
                  label: opt.milestoneName,
                }))}
              />
            </div>
            <div className="col-span-2">
              <label className="text-[13px] font-medium text-gray-700">
                Select Upload Type <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-5 items-center mt-2">
                <div className="flex gap-1">
                  <input
                    type="radio"
                    value="EXCEL"
                    name="uploadType"
                    id="radio1"
                    onChange={handleInp}
                    disabled={!formData.milestoneId || !formData.projectId}
                  />
                  <label htmlFor="radio1" className="text-sm text-slate-800">
                    By Excel
                  </label>
                </div>

                <div className="flex gap-1">
                  <input
                    type="radio"
                    value="ADD_BENEFICIARY"
                    name="uploadType"
                    id="radio2"
                    onChange={handleInp}
                    disabled={!formData.milestoneId || !formData.projectId}
                  />
                  <label htmlFor="radio2" className="text-sm text-slate-800">
                    Manually
                  </label>
                </div>
              </div>
            </div>
            {uploadType === "EXCEL" && (
              <div className="col-span-2 pt-5">
                <div className="flex items-center">
                  <button className="me-3 text-sm flex items-center gap-1 px-3 py-1 rounded-sm bg-green-600/25 text-green-700">
                    <GrDocumentExcel />
                    Excel
                  </button>
                  <button
                    type="button"
                    className="me-3 text-sm flex items-center gap-1 px-3 py-1 rounded-sm bg-blue-600/25 text-blue-700"
                    onClick={() =>
                      document.getElementById("fileUpload").click()
                    }
                  >
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
            )}
            {uploadType === "ADD_BENEFICIARY" && (
              <div className="col-span-12">
                <table className="table-fixed w-full border border-slate-300">
                  <thead className="bg-slate-100">
                    <tr>
                      <td className="w-[60px] text-center text-sm font-semibold px-2 py-2 border-r border-slate-200">
                        SL No
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-2 border-r border-slate-200">
                        Beneficiary Name
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-2 border-r border-slate-200">
                        Beneficiary Code
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-2 border-r border-slate-200">
                        Contact No
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-2 border-r border-slate-200">
                        Email
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-2 border-r border-slate-200">
                        Aadhaar No
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-2 border-r border-slate-200">
                        Select/Unselect
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((i, index) => {
                      return (
                        <tr className="border-b border-slate-200" key={index}>
                          <td className="w-[60px] border-r text-sm border-slate-200 px-2 py-2 text-center">
                            {index + 1}
                          </td>
                          <td className="border-r text-sm border-slate-200 px-2 py-2">
                            {i.beneficiaryName}
                          </td>
                          <td className="border-r text-sm border-slate-200 px-2 py-2">
                            {i.beneficiaryCode}
                          </td>
                          <td className="border-r text-sm border-slate-200 px-2 py-2">
                            {i.contactNo}
                          </td>
                          <td className="border-r text-sm border-slate-200 px-2 py-2">
                            {i.email}
                          </td>
                          <td className="border-r text-center text-sm border-slate-200 px-2 py-2">
                            {i.aadhaarNo}
                          </td>
                          <td className=" text-sm  px-2 py-1 flex justify-center pt-3">
                            <input
                              type="checkbox"
                              // checked={selectedBeneficiaries.includes(
                              //   i.beneficiaryId
                              // )}
                              checked={activeArr.includes(i.beneficiaryId)}
                              onChange={() =>
                                handleCheckboxChange(i.beneficiaryId)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {formData.projectId && formData.milestoneId && (
              <div className="col-span-12">
                <div className="">
                  {/* Header Section (Minimal) */}
                  <div className="flex items-center mb-5 gap-5">
                    <div className="flex items-center">
                      <h3 className="text-xl font-semibold text-light-dark">
                        Project Overview
                      </h3>
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-12  gap-4">
                    {/* Project Name (Blue - Primary Identity) */}
                    <div className="flex flex-col col-span-3 p-4 bg-blue-100 rounded-lg shadow-sm">
                      <span className="text-xs font-medium uppercase text-blue-700 mb-1">
                        Project Name
                      </span>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {projectOverView?.projectName}
                      </p>
                    </div>

                    {/* Agency Name (Violet - Secondary Identity) */}
                    <div className="flex flex-col p-4 bg-violet-100 rounded-lg shadow-sm col-span-3">
                      <span className="text-xs font-medium uppercase text-violet-700 mb-1">
                        Agency Name
                      </span>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {projectOverView?.agencyName}
                      </p>
                    </div>

                    {/* Milestone (Green - Status/Progress) */}
                    <div className="flex flex-col p-4 bg-green-100 rounded-lg shadow-sm col-span-3">
                      <span className="text-xs font-medium uppercase text-green-700 mb-1">
                        Milestone
                      </span>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {projectOverView?.milestoneName}
                      </p>
                    </div>

                    {/* Amount (Pink - Financial) */}
                    <div className="flex flex-col p-4 bg-pink-100 rounded-lg shadow-sm col-span-3">
                      <span className="text-xs font-medium uppercase text-pink-700 mb-1">
                        Amount
                      </span>
                      <p className="text-sm font-semibold text-gray-900">
                        <span className="text-xs font-normal">₹</span>{" "}
                        {Number(projectOverView?.amount).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    {/* Start Date (Teal - Planned Timeline) */}
                    <div className="flex flex-col p-4 bg-teal-100 rounded-lg shadow-sm col-span-3">
                      <span className="text-xs font-medium uppercase text-teal-700 mb-1">
                        Start Date
                      </span>
                      <p className="text-sm font-medium text-gray-800">
                        {projectOverView?.startDate}
                      </p>
                    </div>

                    {/* End Date (Orange - Planned Deadline) */}
                    <div className="flex flex-col p-4 bg-orange-100 rounded-lg shadow-sm col-span-3">
                      <span className="text-xs font-medium uppercase text-orange-700 mb-1">
                        End Date
                      </span>
                      <p className="text-sm font-medium text-gray-800">
                        {projectOverView?.endDate}
                      </p>
                    </div>

                    {/* Actual Start Date (Sky Blue - Actual Timeline) */}
                    <div className="flex flex-col p-4 bg-sky-100 rounded-lg shadow-sm col-span-3">
                      <span className="text-xs font-medium uppercase text-sky-700 mb-1">
                        Actual Start
                      </span>
                      <p className="text-sm font-medium text-gray-800">
                        {projectOverView?.actualStartDate}
                      </p>
                    </div>

                    {/* Actual End Date (Lime - Actual Completion) */}
                    <div className="flex flex-col p-4 bg-lime-100 rounded-lg shadow-sm col-span-3">
                      <span className="text-xs font-medium uppercase text-lime-700 mb-1">
                        Actual End
                      </span>
                      <p className="text-sm font-medium text-gray-800">
                        {projectOverView?.actualEndDate}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            )}
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
