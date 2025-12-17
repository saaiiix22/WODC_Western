import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { getFinancialYearService } from "../../services/budgetService";
import {
  getMilestoneByProjectIdService,
  getProjectByFinYearService,
} from "../../services/projectService";
import {
  getCompleteMilestoneService,
  getDetailsByProjectAndMilestoneIdService,
  
  saveFundReleasInfoServicePrimary,
  
} from "../../services/workOrderGenerationService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FundReleaseInfo = () => {
  const userSelect = useSelector((state) => state);
  console.log(userSelect?.menu.userDetails);

  const [formData, setFormData] = useState({
    finYear: "",
    projectId: "",
    milestoneId: "",
    workOrderNo: "",
    workOrderDate: "",
    penaltyPercentage: "",
    penaltyAmount: "",
    sanctionOrderNo: "",
    sanctionOrderDate: "",
    releaseLetterNo: "",
    releaseLetterDate: "",
    agencyBankId: "",
  });
  const {
    finYear,
    projectId,
    milestoneId,
    penaltyAmount,
    penaltyPercentage,
    sanctionOrderDate,
    sanctionOrderNo,
    releaseLetterDate,
    releaseLetterNo,
    agencyBankId
  } = formData;
  const [errors, setErrors] = useState({});

  const [finOpts, setFinOpts] = useState([]);
  const [projectOpts, setProjectOpts] = useState([]);
  const [milestoneOpts, setMilestoneOpts] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState([]);

  const [milestoneDetails, setMilestoneDetails] = useState({});
  const [vendorDetails, setVendorDetails] = useState({});
  const [agencyDetails, setAgencyDetails] = useState({});
  const [geoTagImg, setGeoTagImgs] = useState([]);

  const [orderDocument, setOrderDocument] = useState(null);

  const navigate = useNavigate();

  const getAllFinOpts = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getFinancialYearService(payload);
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setFinOpts(res?.data.data);
      }
    } catch (error) {
      throw error;
    }
  };
  const getProjectOptsByFinYear = async () => {
    try {
      if (finYear) {
        const payload = encryptPayload({
          isActive: true,
          finyearId: parseInt(finYear),
        });
        const res = await getProjectByFinYearService(payload);
        // console.log(res);
        if (res?.status === 200 && res?.data.outcome) {
          setProjectOpts(res?.data.data);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const getAllMistoneOpts = async () => {
    try {
      if (projectId) {
        const payload = encryptPayload({
          projectId: projectId,
        });
        const res = await getCompleteMilestoneService(payload);
        // console.log(res);
        if (res?.status === 200 && res?.data.outcome) {
          setMilestoneOpts(res?.data.data);
        }
      }
    } catch (error) {
      throw error;
    }
  };
  const getDateDiff = (date1, date2) => {
    if (!date1 || !date2) return "N/A";

    const d1 = new Date(date1.split("/").reverse().join("-"));
    const d2 = new Date(date2.split("/").reverse().join("-"));

    return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
  };

  const [wordOrderDetails, setWorkOrderDetails] = useState({});
  const getDeatilsByProjectMilestone = async () => {
    try {
      if (milestoneId && projectId) {
        const payload = encryptPayload({
          projectId: projectId,
          milestoneId: milestoneId,
        });
        const res = await getDetailsByProjectAndMilestoneIdService(payload);
        // console.log(res);
        if (res?.status === 200 && res?.data.outcome) {
          setWorkOrderDetails(res?.data.data.workOrderDto);
          setAgencyDetails(res?.data.data.agencyDto);
          setMilestoneDetails(res?.data.data.projectAgencyMilestoneMapDto);
          setBeneficiaryDetails(res?.data.data.beneficiaryDto);
          setVendorDetails(res?.data.data.vendorDto);
          setGeoTagImgs(res?.data.data.geoTagResponsDto);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    let updatedForm = { ...formData, [name]: value };

    if (name === "penaltyPercentage") {
      const percent = Number(value) || 0;
      const milestoneAmount = Number(milestoneDetails?.amount) || 0;

      updatedForm.penaltyAmount = ((milestoneAmount * percent) / 100).toFixed(
        2
      );
    }

    setFormData(updatedForm);
  };

  const openDocument = (base64Data, mimeType = "application/pdf") => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");

    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!finYear) {
      newErrors.finYear = "Financial Year is required";
      setErrors(newErrors);
      return;
    }
    try {
      const sendData = {
        fundReleaseId: null,
        sanctionOrderNo,
        sanctionOrderDate: sanctionOrderDate.split("-").reverse().join("/"),
        releaseLetterDate: releaseLetterDate.split("-").reverse().join("/"),
        releaseLetterNo,
        workOrderId: wordOrderDetails?.workOrderId,
        projectAgencyMilestoneMapId:milestoneDetails?.projectAgencyMilestoneMapId,
        penaltyAmount,
        penaltyPercentage,
        agencyBankId,
      };
      console.log(sendData);
      
      const payload = encryptPayload(sendData);
      const res = await saveFundReleasInfoServicePrimary(payload);
      console.log(res);
    } catch (error) {
      throw error;
    }
    // console.log(formData);
  };

  useEffect(() => {
    getAllFinOpts();
  }, []);
  useEffect(() => {
    if (finYear) {
      getProjectOptsByFinYear();
    }
  }, [finYear]);
  useEffect(() => {
    if (projectId) {
      getAllMistoneOpts();
    }
  }, [projectId]);
  useEffect(() => {
    if (projectId && milestoneId) {
      getDeatilsByProjectMilestone();
    }
  }, [projectId, milestoneId]);

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
            Fund Release Information
          </h3>
        </div>

        {/* Body */}
        <div className="min-h-[120px] py-5 px-4 text-[#444]">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <SelectField
                label={"Financial Year"}
                required={true}
                name="finYear"
                value={finYear}
                options={finOpts?.map((i) => ({
                  value: i.finyearId,
                  label: i.finYear,
                }))}
                placeholder="Select"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-span-2">
              <SelectField
                label={"Project Name"}
                required={true}
                name="projectId"
                value={projectId}
                placeholder="Select"
                disabled={finYear ? false : true}
                onChange={handleChangeInput}
                options={projectOpts.map((i) => ({
                  value: i.projectId,
                  label: i.projectName,
                }))}
              />
            </div>
            <div className="col-span-2">
              <SelectField
                label={"Milestone Name"}
                required={true}
                name="milestoneId"
                placeholder="Select"
                disabled={projectId ? false : true}
                options={milestoneOpts?.map((i) => ({
                  value: i.milestoneId,
                  label: i.milestoneName,
                }))}
                onChange={handleChangeInput}
              />
            </div>

            {milestoneId && projectId && milestoneId && (
              <>
                <div className="col-span-12">
                  <div className="grid grid-cols-12">
                    <div className="col-span-3">
                      <div
                        onClick={() =>
                          navigate("/beneficiaryList", {
                            state: { projectId, milestoneId },
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-sm cursor-pointer bg-[#fffaf6] border border-orange-300 px-4 py-2"
                      >
                        <span className="text-sm text-orange-600 font-medium">
                          Beneficiaries
                        </span>
                        <span className="text-lg font-bold text-slate-600">
                          {beneficiaryDetails.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3 mt-3">
                    {/* Floating Title */}
                    <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                      Milestone Details
                    </span>

                    {/* GRID */}
                    <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                      {/* ---------- MILESTONE DETAILS ---------- */}
                      <div className="col-span-3 flex gap-1">
                        <span className="font-medium text-gray-700">
                          Milestone Name
                        </span>
                        :
                        <span className="text-red-600 font-semibold uppercase">
                          {milestoneDetails?.milestoneName || "N/A"}
                        </span>
                      </div>

                      <div className="col-span-3 flex gap-1">
                        <span className="font-medium text-gray-700">
                          Milestone Amount
                        </span>
                        :
                        <span className="text-red-600 font-semibold uppercase">
                          ₹{" "}
                          {Number(milestoneDetails?.amount).toLocaleString(
                            "en-IN"
                          ) || 0}
                        </span>
                      </div>

                      <div className="col-span-3 flex gap-1">
                        <span className="font-medium text-gray-700">
                          Start Date
                        </span>
                        :
                        <span className="text-red-600 font-semibold">
                          {milestoneDetails?.startDate || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-3 flex gap-1">
                        <span className="font-medium text-gray-700">
                          End Date
                        </span>
                        :
                        <span className="text-red-600 font-semibold">
                          {milestoneDetails?.endDate || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-3 flex gap-1">
                        <span className="font-medium text-gray-700">
                          Actual Start Date
                        </span>
                        :
                        <span className="text-red-600 font-semibold">
                          {milestoneDetails?.actualStartDate || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-3 flex gap-1">
                        <span className="font-medium text-gray-700">
                          Actual End Date
                        </span>
                        :
                        <span className="text-red-600 font-semibold">
                          {milestoneDetails?.actualEndDate || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-3 flex gap-1">
                        <span className="font-medium text-gray-700">Delay</span>
                        :
                        <span className="text-red-600 font-semibold">
                          {getDateDiff(
                            milestoneDetails?.actualEndDate,
                            milestoneDetails?.endDate
                          ) || "0"}{" "}
                          days
                        </span>
                      </div>
                      {getDateDiff(
                        milestoneDetails?.actualEndDate,
                        milestoneDetails?.endDate
                      ) > 0 && (
                        <div className="col-span-12">
                          <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-3">
                              <InputField
                                label={"Penalty %"}
                                name="penaltyPercentage"
                                type="number"
                                placeholder="Enter penalty percent"
                                value={penaltyPercentage}
                                max={100}
                                onChange={handleChangeInput}
                              />
                            </div>
                            <div className="col-span-3">
                              <InputField
                                label={"Penalty Amount"}
                                name="penaltyAmount"
                                disabled={true}
                                value={penaltyAmount}
                                onChange={handleChangeInput}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {userSelect?.menu.userDetails.roleCode !== "ROLE_AGENCY" && (
                  <div className="col-span-12">
                    <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                      {/* Floating Title */}
                      <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                        Agency Details
                      </span>

                      {/* GRID */}
                      <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                        {/* ---------- MILESTONE DETAILS ---------- */}
                        <div className="col-span-3 flex gap-1">
                          <span className="font-medium text-gray-700">
                            Agency Name
                          </span>
                          :
                          <span className="text-red-600 font-semibold uppercase">
                            {agencyDetails?.agencyName || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-medium text-gray-700">
                            Contact Number
                          </span>
                          :
                          <span className="text-red-600 font-semibold">
                            {agencyDetails?.contactNo || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-medium text-gray-700">
                            Email
                          </span>
                          :
                          <span className="text-red-600 font-semibold">
                            {agencyDetails?.email || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-12 flex gap-1">
                          <div className="grid grid-cols-12 gap-x-6">
                            <div className="col-span-12 mb-2 mt-1">
                              Bank Account Selection
                            </div>
                            {agencyDetails?.agencyBankDetailsDtoList?.map(
                              (i, index) => {
                                return (
                                  <div className="col-span-2 flex items-center gap-2" key={index}>
                                    <input type="radio" name="agencyBankId" id={i.bankName} value={i.agencyBankId} onChange={handleChangeInput} />
                                    <label htmlFor={i.bankName}>{i.bankName}</label>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {userSelect?.menu.userDetails.roleCode !== "ROLE_VENDOR" && (
                  <div className="col-span-12">
                    <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                      {/* Floating Title */}
                      <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                        Vendor Details
                      </span>
                      <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                        {/* ---------- VENDOR DETAILS ---------- */}
                        <div className="col-span-3 flex gap-1">
                          <span className="font-medium text-gray-700">
                            Vendor Name
                          </span>
                          :
                          <span className="text-red-600 font-semibold uppercase">
                            {vendorDetails?.vendorName || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-medium text-gray-700">
                            Vendor Code
                          </span>
                          :
                          <span className="text-red-600 font-semibold">
                            {vendorDetails?.vendorCode || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-medium text-gray-700">
                            Contact No
                          </span>
                          :
                          <span className="text-red-600 font-semibold">
                            {vendorDetails?.contactNo || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-medium text-gray-700">
                            Email
                          </span>
                          :
                          <span className="text-red-600 font-semibold break-all">
                            {vendorDetails?.email || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-medium text-gray-700">
                            Address
                          </span>
                          :
                          <span className="text-red-600 font-semibold">
                            {vendorDetails?.address || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-medium text-gray-700">
                            Aadhaar No
                          </span>
                          :
                          <span className="text-red-600 font-semibold">
                            {vendorDetails?.aadhaarNo || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-medium text-gray-700">
                            Date of Birth
                          </span>
                          :
                          <span className="text-red-600 font-semibold">
                            {vendorDetails?.dob || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-span-12">
                  <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                    {/* Floating Title */}
                    <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                      Work Order Genaration Details
                    </span>
                    <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                      {/* ---------- VENDOR DETAILS ---------- */}
                      <div className="col-span-3 flex gap-1">
                        <span className="font-medium text-gray-700">
                          Work Order No
                        </span>
                        :
                        <span className="text-red-600 font-semibold uppercase">
                          {wordOrderDetails?.workOrderNo || "N/A"}
                        </span>
                      </div>

                      <div className="col-span-3 flex gap-1">
                        <span className="font-medium text-gray-700">
                          Work Order Date
                        </span>
                        :
                        <span className="text-red-600 font-semibold">
                          {wordOrderDetails?.workOrderDate || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                    {/* Floating Title */}
                    <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                      Geotag Details
                    </span>
                    <div className="grid grid-cols-12 gap-6 text-sm">
                      {geoTagImg?.map((i, index) => {
                        return (
                          <div className="col-span-3 flex gap-1" key={index}>
                            <img
                              src={`data:image/png;base64,${i.documentBase64}`}
                              alt=""
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <InputField
                    label={"Sanction Order Number"}
                    required={true}
                    name="sanctionOrderNo"
                    value={sanctionOrderNo}
                    type="number"
                    placeholder="Enter sanction order number"
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label={"Sanction Order Date"}
                    required={true}
                    name="sanctionOrderDate"
                    value={sanctionOrderDate}
                    type="date"
                    placeholder="Enter sanction order date"
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label={"Release Letter Number"}
                    required={true}
                    name="releaseLetterNo"
                    value={releaseLetterNo}
                    type="number"
                    placeholder="Enter release order date"
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label={"Release Letter Date"}
                    required={true}
                    name="releaseLetterDate"
                    value={releaseLetterDate}
                    type="date"
                    placeholder="Enter release order date"
                    onChange={handleChangeInput}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer (Optional) */}
        <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          <SubmitBtn type={"submit"} />
        </div>
      </div>
    </form>
  );
};

export default FundReleaseInfo;
