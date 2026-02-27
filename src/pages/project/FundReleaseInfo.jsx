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
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Magnifier from "../../components/common/Magnifier";
import ReusableDialog from "../../components/common/ReusableDialog";
import { openDocument } from "../../utils/openDocument";
import { forwardListByMenuService } from "../../services/workflowService";
import { GrSave } from "react-icons/gr";
import { addAllowedPath } from "../../redux/slices/menuSlice";
import { avoidSpecialCharUtil } from "../../utils/validationUtils";

const FundReleaseInfo = () => {
  const userSelect = useSelector((state) => state);
  const dispatch = useDispatch()

  const [button, setButtons] = useState([])


  const location = useLocation()

  const getWorkFlow = async () => {
    try {
      const payload = encryptPayload({ appModuleUrl: location.pathname })
      const res = await forwardListByMenuService(payload)
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setButtons(res?.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

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
    agencyBankId,
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

  const [workOrderIdDetails, setWorkOrderIdDetails] = useState(null);

  const navigate = useNavigate();

  const getAllFinOpts = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getFinancialYearService(payload);
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
        if (res?.status === 200 && res?.data.outcome) {
          setProjectOpts(res?.data.data);
        } else {
          toast.error(res?.data.message);
          setProjectOpts([]);
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
        if (res?.status === 200 && res?.data.outcome) {
          setMilestoneOpts(res?.data.data);
        } else {
          toast.error(res?.data.message);
          setMilestoneOpts([]);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const getDateDiff = (date1, date2) => {
    if (!date1 || !date2) return 0;

    const d1 = new Date(date1.split("/").reverse().join("-"));
    const d2 = new Date(date2.split("/").reverse().join("-"));

    const diff = Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
    return isNaN(diff) ? 0 : diff;
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
        if (res?.status === 200 && res?.data.outcome) {
          setWorkOrderDetails(res?.data.data.workOrderDto);
          setWorkOrderIdDetails(res?.data.data.workOrderDto?.fundReleaseDto);
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

    let updatedForm = { ...formData };
    let updatedVal = value;

    const milestoneAmount = Number(milestoneDetails?.amount) || 0;
    const workOrderDate = wordOrderDetails?.workOrderDate;

    // 🔒 Prevent bank change if already saved
    if (name === "agencyBankId" && workOrderIdDetails?.agencyBankId) {
      return;
    }

    // ✂️ Remove special characters where required
    if (name === "releaseLetterNo" || name === "sanctionOrderNo") {
      updatedVal = avoidSpecialCharUtil(value);
    }

    if (name === "releaseLetterDate") {
      if (updatedVal && workOrderDate) {
        const [dd, mm, yyyy] = workOrderDate.split("/");
        const woDate = new Date(`${yyyy}-${mm}-${dd}`);

        const releaseDate = new Date(updatedVal);

        if (
          !isNaN(woDate.getTime()) &&
          !isNaN(releaseDate.getTime()) &&
          releaseDate.getTime() <= woDate.getTime()
        ) {
          setErrors((prev) => ({
            ...prev,
            releaseLetterDate: `Release Letter Date must be after Work Order Date i.e. ${workOrderDate}`,
          }));
          return;
        }
      }

      updatedForm.releaseLetterDate = updatedVal;
    }

    else if (name === "penaltyPercentage") {
      if (updatedVal === "") {
        updatedForm.penaltyPercentage = "";
        updatedForm.penaltyAmount = "";
      } else {
        let percent = Number(updatedVal);
        if (isNaN(percent) || percent < 0) percent = 0;
        if (percent > 100) percent = 100;

        const amount =
          milestoneAmount > 0
            ? (milestoneAmount * percent) / 100
            : 0;

        updatedForm.penaltyPercentage = percent;
        updatedForm.penaltyAmount = amount;
      }
    }

    else if (name === "penaltyAmount") {
      if (updatedVal === "") {
        updatedForm.penaltyAmount = "";
        updatedForm.penaltyPercentage = "";
      } else {
        let amount = Number(updatedVal);
        if (isNaN(amount) || amount < 0) amount = 0;
        if (amount > milestoneAmount) amount = milestoneAmount;

        const percent =
          milestoneAmount > 0
            ? (amount / milestoneAmount) * 100
            : 0;

        updatedForm.penaltyAmount = amount;
        updatedForm.penaltyPercentage = Math.min(percent, 100);
      }
    }

    else {
      updatedForm[name] = updatedVal;
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData(updatedForm);
  };

  const [open, setOpen] = useState(false)

  const confirmSubmit = (e) => {
    e.preventDefault()
    let newErrors = {};

    if (!finYear) {
      newErrors.finYear = "Financial Year is required";
      setErrors(newErrors);
      return;
    }

    if (!projectId) {
      newErrors.projectId = "Project Name is required";
      setErrors(newErrors);
      return;
    }
    if (!milestoneId) {
      newErrors.milestoneId = "Milestone Name is required";
      setErrors(newErrors);
      return;
    }
    if (finYear && projectId && milestoneId) {
      if (!agencyBankId || agencyBankId === "") {
        toast.error("Kindly select the bank for fund release");
        return;
      }
      if (!sanctionOrderNo) {
        newErrors.sanctionOrderNo = "Sanction Order Number is required";
        setErrors(newErrors);
        return;
      }
      if (!sanctionOrderDate) {
        newErrors.sanctionOrderDate = "Sanction Order Date is required";
        setErrors(newErrors);
        return;
      }
      if (!releaseLetterNo) {
        newErrors.releaseLetterNo = "Release Letter Number is required";
        setErrors(newErrors);
        return;
      }
      if (!releaseLetterDate) {
        newErrors.releaseLetterDate = "Release Letter Date is required";
        setErrors(newErrors);
        return;
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setOpen(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);

    try {
      // Convert empty strings to null for numeric fields
      const sendData = {
        fundReleaseId: workOrderIdDetails?.fundReleaseId || null,
        sanctionOrderNo,
        sanctionOrderDate: sanctionOrderDate ? sanctionOrderDate.split("-").reverse().join("/") : null,
        releaseLetterDate: releaseLetterDate ? releaseLetterDate.split("-").reverse().join("/") : null,
        releaseLetterNo,
        workOrderId: wordOrderDetails?.workOrderId,
        projectAgencyMilestoneMapId: milestoneDetails?.projectAgencyMilestoneMapId,
        penaltyAmount: penaltyAmount === "" || penaltyAmount === null ? null : parseFloat(penaltyAmount),
        penaltyPercentage: penaltyPercentage === "" || penaltyPercentage === null ? null : parseInt(penaltyPercentage, 10),
        agencyBankId: agencyBankId === "" || agencyBankId === null ? null : parseInt(agencyBankId, 10),
      };

      console.log("Sending data:", sendData);

      const payload = encryptPayload(sendData);
      const res = await saveFundReleasInfoServicePrimary(payload);
      console.log("Response:", res);

      if (res?.status === 200 && res?.data?.outcome) {
        toast.success("Fund release information saved successfully");
        // Refresh data after save
        if (projectId && milestoneId) {
          getDeatilsByProjectMilestone();
        }
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving fund release:", error);
      toast.error("Failed to save fund release information");
    }
  };

  useEffect(() => {
    getWorkFlow();
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

  useEffect(() => {
    if (workOrderIdDetails) {
      setFormData((prev) => ({
        ...prev,
        agencyBankId: workOrderIdDetails?.agencyBankId,
        penaltyPercentage: workOrderIdDetails?.penaltyPercentage,
        penaltyAmount: workOrderIdDetails?.penaltyAmount,
        sanctionOrderNo: workOrderIdDetails?.sanctionOrderNo,
        sanctionOrderDate: workOrderIdDetails?.sanctionOrderDate
          ?.split("/")
          ?.reverse()
          ?.join("-") || "",
        releaseLetterNo: workOrderIdDetails?.releaseLetterNo,
        releaseLetterDate: workOrderIdDetails?.releaseLetterDate
          ?.split("/")
          ?.reverse()
          ?.join("-") || "",
      }));
    }
  }, [workOrderIdDetails]);

  return (
    <form onSubmit={confirmSubmit}>
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
                error={errors.finYear}
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
                error={errors.projectId}
              />
            </div>
            <div className="col-span-2">
              <SelectField
                label={"Milestone Name"}
                required={true}
                name="milestoneId"
                value={milestoneId}
                placeholder="Select"
                disabled={projectId ? false : true}
                options={milestoneOpts?.map((i) => ({
                  value: i.milestoneId,
                  label: i.milestoneName,
                }))}
                onChange={handleChangeInput}
                error={errors.milestoneId}
              />
            </div>

            {milestoneId && projectId && (
              <>
                <div className="col-span-12">
                  <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                    {/* Floating Title */}
                    <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                      Milestone Details
                    </span>

                    {/* GRID */}
                    <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                      <div className="col-span-3 flex gap-1">
                        <span className="font-normal text-gray-700">
                          Milestone Name
                        </span>
                        :
                        <span className="text-slate-900 font-semibold uppercase">
                          {milestoneDetails?.milestoneName || "N/A"}
                        </span>
                      </div>

                      <div className="col-span-3 flex gap-1">
                        <span className="font-normal text-gray-700">
                          Start Date
                        </span>
                        :
                        <span className="text-slate-900 font-semibold">
                          {milestoneDetails?.startDate || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-3 flex gap-1">
                        <span className="font-normal text-gray-700">
                          End Date
                        </span>
                        :
                        <span className="text-slate-900 font-semibold">
                          {milestoneDetails?.endDate || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-3 flex gap-1">
                        <span className="font-normal text-gray-700">
                          Actual Start Date
                        </span>
                        :
                        <span className="text-slate-900 font-semibold">
                          {milestoneDetails?.actualStartDate || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-3 flex gap-1">
                        <span className="font-normal text-gray-700">
                          Actual End Date
                        </span>
                        :
                        <span className="text-slate-900 font-semibold">
                          {milestoneDetails?.actualEndDate || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-3 flex gap-1">
                        <span className="font-normal text-gray-700">Delay</span>
                        :
                        <span className="text-slate-900 font-semibold">
                          {
                            Math.max(
                              0,
                              getDateDiff(milestoneDetails?.actualEndDate, milestoneDetails?.actualStartDate) -
                              getDateDiff(milestoneDetails?.endDate, milestoneDetails?.startDate)
                            )
                          }{" "}
                          days
                        </span>
                      </div>
                      <div className="col-span-3 flex gap-1">
                        <span className="font-normal text-gray-700">
                          Milestone Amount
                        </span>
                        :
                        <span className="text-slate-900 font-semibold uppercase">
                          ₹{" "}
                          {Number(milestoneDetails?.amount).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          ) || 0}
                        </span>
                      </div>
                      <div
                        className="col-span-3 flex gap-1 cursor-pointer"
                        onClick={() => {
                          dispatch(addAllowedPath("/beneficiaryList"))
                          navigate("/beneficiaryList", {
                            state: { projectId, milestoneId },
                          })
                        }}
                      >
                        <span className="font-normal text-gray-700">
                          Beneficary Count
                        </span>
                        :
                        <span className="text-slate-900 font-semibold uppercase">
                          {beneficiaryDetails.length}
                        </span>
                      </div>

                      <div className="col-span-12">
                        <div className="grid grid-cols-12 gap-6">
                          <div className="col-span-3 flex gap-1 items-center">
                            <label
                              htmlFor=""
                              className="text-[13px] font-normal text-gray-700"
                            >
                              Penalty Percent
                            </label>
                            :
                            <input
                              className="w-1/2 border border-dashed border-orange-300 
            px-2.5 py-1.5 text-sm text-slate-900 font-semibold
            outline-none transition-all duration-200"
                              name="penaltyPercentage"
                              value={penaltyPercentage}
                              disabled={!!wordOrderDetails?.fundReleaseDto?.fundReleaseId}
                              max={100}
                              onChange={handleChangeInput}
                            />
                          </div>
                          <div className="col-span-3 flex gap-1 items-center">
                            <label
                              htmlFor=""
                              className="text-[13px] font-normal text-gray-700"
                            >
                              Penalty Amount
                            </label>
                            :
                            <input
                              className="w-1/2 border border-dashed border-orange-300 
            px-2.5 py-1.5 text-sm text-slate-900 font-semibold
            outline-none transition-all duration-200"
                              name="penaltyAmount"
                              disabled={!!wordOrderDetails?.fundReleaseDto?.fundReleaseId}
                              value={penaltyAmount}
                              onChange={handleChangeInput}
                            />
                          </div>

                          <div className="col-span-3 flex gap-1 mt-2">
                            <span className="font-normal text-gray-700">
                              Total Amount
                            </span>
                            :
                            <span className="text-slate-900 font-semibold">
                              ₹{" "}
                              {(
                                (milestoneDetails?.amount || 0) -
                                (parseFloat(penaltyAmount) || 0)
                              ).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
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
                        <div className="col-span-3 flex gap-1">
                          <span className="font-normal text-gray-700">
                            Agency Name
                          </span>
                          :
                          <span className="text-slate-900 font-semibold uppercase">
                            {agencyDetails?.agencyName || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-normal text-gray-700">
                            Contact Number
                          </span>
                          :
                          <span className="text-slate-900 font-semibold">
                            {agencyDetails?.contactNo || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-normal text-gray-700">
                            Email
                          </span>
                          :
                          <span className="text-slate-900 font-semibold">
                            {agencyDetails?.email || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-12 flex gap-1">
                          <div className="grid grid-cols-12 gap-x-6">
                            <div className="col-span-12 mb-2 mt-1 font-medium text-gray-700">
                              Fund Release To
                            </div>
                            <div className="col-span-12">
                              <table className="table-fixed w-full border border-orange-300">
                                <thead className="border-b border-orange-300 bg-orange-300">
                                  <tr>
                                    <td className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-orange-300">
                                      SL No
                                    </td>
                                    <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                                      Bank Name
                                    </td>
                                    <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                                      Branch Name
                                    </td>
                                    <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                                      Account Number
                                    </td>
                                    <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                                      IFSC
                                    </td>
                                    <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                                      Selection
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {agencyDetails?.agencyBankDetailsDtoList?.map(
                                    (i, index) => {
                                      return (
                                        <tr
                                          key={index}
                                          className="border-b border-orange-300"
                                        >
                                          <td className="border-r py-2 text-sm border-orange-300 text-center">
                                            {index + 1}
                                          </td>
                                          <td className="border-r py-2 text-sm border-orange-300 text-center">
                                            {i.bankName}
                                          </td>
                                          <td className="border-r py-2 text-sm border-orange-300 text-center">
                                            {i.branchName}
                                          </td>
                                          <td className="border-r py-2 text-sm border-orange-300 text-center">
                                            {i.accountNo}
                                          </td>
                                          <td className="border-r py-2 text-sm border-orange-300 text-center">
                                            {i.ifscCode}
                                          </td>
                                          <td className="border-r py-2 text-sm border-orange-300 text-center">
                                            <input
                                              type="radio"
                                              name="agencyBankId"
                                              id={i.bankName}
                                              value={i.agencyBankId}
                                              checked={String(agencyBankId) === String(i.agencyBankId)}
                                              onChange={handleChangeInput}
                                              disabled={!!wordOrderDetails?.fundReleaseDto?.fundReleaseId}
                                            />
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
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
                        <div className="col-span-3 flex gap-1">
                          <span className="font-normal text-gray-700">
                            Vendor Name
                          </span>
                          :
                          <span className="text-slate-900 font-semibold uppercase">
                            {vendorDetails?.vendorName || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-normal text-gray-700">
                            Contact Number
                          </span>
                          :
                          <span className="text-slate-900 font-semibold">
                            {vendorDetails?.contactNo || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-normal text-gray-700">
                            Email
                          </span>
                          :
                          <span className="text-slate-900 font-semibold break-all">
                            {vendorDetails?.email || "N/A"}
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-1">
                          <span className="font-normal text-gray-700">
                            Address
                          </span>
                          :
                          <span className="text-slate-900 font-semibold">
                            {vendorDetails?.address || "N/A"}
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
                      Work Order Generation Details
                    </span>
                    <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                      <div className="col-span-3 flex gap-1">
                        <span className="font-normal text-gray-700">
                          Work Order No
                        </span>
                        :
                        <span className="text-slate-900 font-semibold uppercase">
                          {wordOrderDetails?.workOrderNo || "N/A"}
                        </span>
                      </div>

                      <div className="col-span-3 flex gap-1">
                        <span className="font-normal text-gray-700">
                          Work Order Date
                        </span>
                        :
                        <span className="text-slate-900 font-semibold">
                          {wordOrderDetails?.workOrderDate || "N/A"}
                        </span>
                      </div>

                      <div className="col-span-4 flex gap-1">
                        <span className="font-normal text-gray-700">
                          Work Order Document
                        </span>
                        :
                        <span
                          className="text-slate-900 font-semibold cursor-pointer"
                          onClick={() =>
                            openDocument(
                              wordOrderDetails?.docPathBase64,
                              "application/pdf"
                            )
                          }
                        >
                          {wordOrderDetails?.fileName || "N/A"}
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
                            <Magnifier
                              src={`data:image/png;base64,${i.documentBase64}`}
                            />
                          </div>
                        );
                      })}
                      {geoTagImg?.length === 0 && (
                        <div className="col-span-12 text-center text-gray-500">
                          No geotag images available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-12">
                  <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                    {/* Floating Title */}
                    <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                      Fund Release Details
                    </span>
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-2">
                        <InputField
                          label={"Sanction Order Number"}
                          required={true}
                          name="sanctionOrderNo"
                          value={sanctionOrderNo}
                          maxLength={30}
                          placeholder="Enter sanction order number"
                          onChange={handleChangeInput}
                          disabled={
                            workOrderIdDetails?.fundReleaseId ? true : false
                          }
                          error={errors.sanctionOrderNo}
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
                          disabled={
                            workOrderIdDetails?.fundReleaseId ? true : false
                          }
                          error={errors.sanctionOrderDate}
                        />
                      </div>
                      <div className="col-span-2">
                        <InputField
                          label={"Release Letter Number"}
                          required={true}
                          name="releaseLetterNo"
                          value={releaseLetterNo}
                          maxLength={30}
                          placeholder="Enter release letter number"
                          onChange={handleChangeInput}
                          disabled={
                            workOrderIdDetails?.fundReleaseId ? true : false
                          }
                          error={errors.releaseLetterNo}
                        />
                      </div>

                      <div className="col-span-2">
                        <InputField
                          label={"Release Letter Date"}
                          required={true}
                          name="releaseLetterDate"
                          value={releaseLetterDate}
                          type="date"
                          placeholder="Enter release letter date"
                          onChange={handleChangeInput}
                          disabled={workOrderIdDetails?.fundReleaseId ? true : false}
                          error={errors.releaseLetterDate}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          {!workOrderIdDetails?.fundReleaseId && <SubmitBtn type={"submit"} />}
        </div>
      </div>

      <ReusableDialog
        open={open}
        description="Are you sure you want to submit?"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
      />
    </form>
  );
};

export default FundReleaseInfo;