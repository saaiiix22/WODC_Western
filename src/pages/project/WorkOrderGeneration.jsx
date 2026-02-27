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
  getDetailsByProjectAndMilestoneIdService,
  saveWorOrderGenerationService,
} from "../../services/workOrderGenerationService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReusableDialog from "../../components/common/ReusableDialog";
import { addAllowedPath } from "../../redux/slices/menuSlice";

const WorkOrderGeneration = () => {
  const userSelect = useSelector((state) => state);
  // console.log(userSelect?.menu.userDetails);
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    finYear: "",
    projectId: "",
    milestoneId: "",
    workOrderNo: "",
    workOrderDate: "",
  });
  const { finYear, projectId, milestoneId, workOrderNo, workOrderDate } =
    formData;

  const [finOpts, setFinOpts] = useState([]);
  const [projectOpts, setProjectOpts] = useState([]);
  const [milestoneOpts, setMilestoneOpts] = useState([]);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState([]);

  const [milestoneDetails, setMilestoneDetails] = useState({});
  const [vendorDetails, setVendorDetails] = useState({});
  const [agencyDetails, setAgencyDetails] = useState({});

  const [orderDocument, setOrderDocument] = useState(null);





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
          isActive: true,
          projectId: projectId,
        });
        const res = await getMilestoneByProjectIdService(payload);
        // console.log(res);
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
        } else {
          toast.error(res?.data.message);
          setFormData({
            finYear: "",
            projectId: "",
            milestoneId: "",
            workOrderNo: "",
            workOrderDate: "",
          });
          setWorkOrderDetails({});
          setAgencyDetails({});
          setMilestoneDetails({});
          setBeneficiaryDetails([]);
          setVendorDetails({});
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleChangeInput = async (e) => {
    const { name, files, value } = e.target;
    let newErrors = {}
    if (name === "orderDocument") {
      setOrderDocument(files[0]);
    }

    if (name === "workOrderDate") {
      if (value < milestoneDetails?.startDate.split("/").reverse().join("-")) {
        newErrors.workOrderDate = "Work order shall be after the start date";
        setErrors(newErrors);
        return;
      }
    }

    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

  };

  const toDDMMYYYY = (str = "") => {
    if (!str) return;
    return str.split("-").reverse().join("/");
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

  const [errors, setErrors] = useState({});
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
      newErrors.milestoneId = "MilestoneId Name is required";
      setErrors(newErrors);
      return;
    }
    if (finYear && projectId && milestoneId) {
      if (!workOrderNo) {
        newErrors.workOrderNo = "Work Order Number is required";
        setErrors(newErrors);
        return;
      }
      if (!workOrderDate) {
        newErrors.workOrderDate = "Work Order Date is required";
        setErrors(newErrors);
        return;
      }
      if (!orderDocument) {
        newErrors.orderDocument = "Work Order Document is required";
        setErrors(newErrors);
        return;
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setOpen(true)
    }
    else {
      setOpen(true)
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const sendData = {
        projectId,
        milestoneId,
        workOrderNo,
        workOrderDate: toDDMMYYYY(workOrderDate),
        vendorId: vendorDetails?.vendorId,
      };
      const fmData = new FormData();
      fmData.append("cipherText", encryptPayload(sendData));
      fmData.append("orderDocument", orderDocument);

      const res = await saveWorOrderGenerationService(fmData);
      console.log(res);
      if (res?.status === 200 && res?.data.data) {
        toast.success(res?.data.message);
        setFormData({
          finYear: "",
          projectId: "",
          milestoneId: "",
          workOrderNo: "",
          workOrderDate: "",
        });
        setMilestoneOpts([]);
        setOpen(false)
      }
    } catch (error) {
      setOpen(false)
      throw error;
    }
  }

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
  useEffect(() => {
    if (wordOrderDetails) {
      setFormData((prev) => ({
        ...prev,
        workOrderNo: wordOrderDetails?.workOrderNo,
        workOrderDate: wordOrderDetails?.workOrderDate
          ?.split("/")
          ?.reverse()
          .join("-"),
      }));
    }
  }, [wordOrderDetails]);

  const navigate = useNavigate();

  return (
    <form action="" onSubmit={confirmSubmit}>
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
            Work Order Generation
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

            {finYear && projectId && milestoneId && (
              <>
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
                          ) || "0"}
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
                      <div
                        className="col-span-3 flex gap-1 cursor-pointer"
                        onClick={() => {
                          dispatch(addAllowedPath("/beneficiaryList"));

                          navigate("/beneficiaryList", {
                            state: { projectId, milestoneId },
                          })
                        }
                        }
                      >
                        <span className="font-normal text-gray-700">
                          Beneficiary Count
                        </span>
                        :
                        <span className="text-slate-900 font-semibold">
                          {beneficiaryDetails?.length || "0"}
                        </span>
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
                        {/* ---------- MILESTONE DETAILS ---------- */}
                        <div className="col-span-3 flex gap-1">
                          <span className="font-normal text-gray-700">
                            Agency Name
                          </span>
                          :
                          <span className="text-slate-900 font-semibold uppercase">
                            {agencyDetails?.agencyName || "N/A"}
                          </span>
                        </div>

                        {/* <div className="col-span-3 flex gap-1">
                        <span className="font-medium text-gray-700">
                          Agency Code
                        </span>
                        :
                        <span className="text-red-600 font-semibold">
                          {agencyDetails?.agencyCode || "N/A"}
                        </span>
                      </div> */}

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
                  <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3 mt-0">
                    {/* Floating Title */}
                    <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                      Work Order Details
                    </span>

                    {/* GRID */}
                    <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                      <div className="col-span-3">
                        <InputField
                          label={"Work Order Number"}
                          required={true}
                          name="workOrderNo"
                          value={workOrderNo}
                          type="text"
                          onChange={handleChangeInput}
                          disabled
                          error={errors.workOrderNo}
                        />
                      </div>
                      <div className="col-span-3">
                        <InputField
                          label={"Work Order Date"}
                          required={true}
                          name="workOrderDate"
                          value={workOrderDate}
                          type="date"
                          onChange={handleChangeInput}
                          error={errors.workOrderDate}
                        />
                      </div>
                      <div className="col-span-3">
                        <InputField
                          label={"Upload Document"}
                          required={true}
                          name="orderDocument"
                          type="file"
                          onChange={handleChangeInput}
                          error={errors.orderDocument}
                        />
                        <span
                          className="text-[11px] text-blue-600 cursor-pointer"
                          onClick={() =>
                            openDocument(
                              wordOrderDetails?.docPathBase64,
                              "application/pdf"
                            )
                          }
                        >
                          {wordOrderDetails?.fileName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer (Optional) */}
        <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          {/* <SubmitBtn type={'submit'} /> */}
          {/* {userSelect?.menu.userDetails.roleCode !== "ROLE_WODC_ADMIN" &&
            !wordOrderDetails?.workOrderDate && (
              <SubmitBtn type="submit" />
            )} */}
          {!wordOrderDetails?.workOrderId && (
            <SubmitBtn type={'submit'} />
          )}

        </div>
      </div>
      <ReusableDialog
        open={open}
        // title="Submit"
        description="Are you sure you want to submit?"
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
      />
    </form >
  );
};

export default WorkOrderGeneration;
