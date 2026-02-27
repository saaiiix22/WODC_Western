import React, { useEffect, useState } from "react";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { FiFileText } from "react-icons/fi";
import { getProjectByFinYearService } from "../../services/projectService";
import { getFinancialYearService } from "../../services/budgetService";
import { getCompleteMilestoneService } from "../../services/workOrderGenerationService";
import SelectField from "../../components/common/SelectField";
import { encryptPayload } from "../../crypto.js/encryption";
import {
  getUCdetailsService,
  saveUCdetailsService,
} from "../../services/ucSubmissionService";
import InputField from "../../components/common/InputField";
import { FaSquarePlus } from "react-icons/fa6";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ReusableDialog from "../../components/common/ReusableDialog";
import { GrSave } from "react-icons/gr";
import { useLocation } from "react-router-dom";
import { forwardListByMenuService, getWorkflowTabService } from "../../services/workflowService";
import PillTabs from "../../components/common/Styletab";
import TabPanel from "@mui/lab/TabPanel";
import { TabContext } from "@mui/lab";


const UCsubmission = () => {
  const userSelect = useSelector((state) => state);

  const [button, setButtons] = useState([])


  const location = useLocation()
  // console.log(location.pathname);

  const getWorkFlow = async () => {
    try {
      const payload = encryptPayload({ appModuleUrl: location.pathname, forwardedId })
      const res = await forwardListByMenuService(payload)
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setButtons(res?.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [forwardedId, setForwardedId] = useState('')
  const [formData, setFormData] = useState({
    finYear: "",
    projectId: "",
    milestoneId: "",

    utilizationDesc: "",
    utilizationFromDate: "",
    utilizationToDate: "",
    ucSubmissionDate: "",
  });
  const {
    finYear,
    projectId,
    milestoneId,
    utilizationDesc,
    utilizationFromDate,
    utilizationToDate,
    ucSubmissionDate,
  } = formData;

  const [finOpts, setFinOpts] = useState([]);
  const [projectOpts, setProjectOpts] = useState([]);
  const [milestoneOpts, setMilestoneOpts] = useState([]);

  const [workOrderDTO, setWorkOrderDTO] = useState({});
  const [value, setValue] = useState("");
  const [tabs, setTabs] = useState([])
  const [tabCodePro, setTabCodePro] = useState("");


  const [ucDetailsDTO, setUCdetailsDTO] = useState({});
  // console.log(ucDetailsDTO);
  const generateId = () =>
    crypto?.randomUUID?.() || Math.random().toString(36).substring(2, 15);
  const [refDocList, setRefDocList] = useState([
    { id: generateId(), file: null, amount: "" },
  ]);
  const validateFileSize = (file) => {
    if (!file) return false;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should not exceed 2 MB");
      return false;
    }
    return true;
  };
  const addRefDoc = () => {

    setRefDocList((prev) => [...prev, { id: generateId(), file: null }]);
  };

  const removeRefDoc = (id) => {
    setRefDocList((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleRefDocChange = (id, key, value) => {
    setRefDocList((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, [key]: value } : doc
      )
    );
  };


  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    // build next form state
    const updatedForm = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedForm);

    let newErrors = {};

    const sanctionOrderDate = parseDDMMYYYY(
      workOrderDTO?.fundReleaseDto?.sanctionOrderDate
    );

    const utilizationFrom = updatedForm.utilizationFromDate
      ? new Date(updatedForm.utilizationFromDate)
      : null;

    const utilizationTo = updatedForm.utilizationToDate
      ? new Date(updatedForm.utilizationToDate)
      : null;

    // Rule 1: Utilization From Date >= Sanction Order Date
    if (
      name === "utilizationFromDate" &&
      sanctionOrderDate &&
      utilizationFrom &&
      utilizationFrom < sanctionOrderDate
    ) {
      newErrors.utilizationFromDate =
        "Utilization From Date cannot be before Sanction Order Date";
    }

    // Rule 2: Utilization To Date >= Utilization From Date
    if (
      name === "utilizationToDate" &&
      utilizationFrom &&
      utilizationTo &&
      utilizationTo < utilizationFrom
    ) {
      newErrors.utilizationToDate =
        "Utilization To Date cannot be before Utilization From Date";
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
      [name]: newErrors[name] ? newErrors[name] : "",
    }));
  };

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
          projectId: projectId,
        });
        const res = await getCompleteMilestoneService(payload);
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
  const [flag, setFlag] = useState(false)
  const getAllUCdetails = async () => {
    try {
      if (milestoneId && projectId) {
        const payload = encryptPayload({
          projectId: projectId,
          milestoneId: milestoneId,
          TABCODE: tabCodePro
        });
        const res = await getUCdetailsService(payload);
        if (res?.status === 200 && res?.data.outcome) {
          // console.log(res);
          setFlag(true)
          setWorkOrderDTO(res?.data.data.workOrderDto);
          setButtons(res?.data.data.stageForwardedRuleDtos)
          setUCdetailsDTO(
            res?.data?.data?.workOrderDto?.fundReleaseDto?.ucDetailsDto || {}
          );
        }
        else {
          setFlag(false)
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleChange = (event, newValue) => {
    const selectedTab = tabs?.find(
      (tab) => String(tab.tabId) === String(newValue)
    );

    setValue(newValue);
    setTabCodePro(selectedTab?.tabCode || "");
  };
  const parseDDMMYYYY = (dateStr) => {
    if (!dateStr) return null;
    const [dd, mm, yyyy] = dateStr.split("/");
    return new Date(`${yyyy}-${mm}-${dd}`);
  };
  const pillTabData = [...tabs]
    .sort((a, b) => a.tabId - b.tabId)
    .map((tab) => ({
      value: String(tab.tabId),
      label: tab.tabName,
      tabCode: tab.tabCode,
      tabId: tab.tabId,
      disabled: false,
    }));

  const [ucDoc, setUcDoc] = useState(null);


  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false)
  const handleConfirmModal = (e) => {
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
      if (!utilizationDesc) {
        newErrors.utilizationDesc = "Utilization Description is required";
        setErrors(newErrors);
        return;
      }
      if (!utilizationFromDate) {
        newErrors.utilizationFromDate = "Utilization from date is required";
        setErrors(newErrors);
        return;
      }
      if (!utilizationToDate) {
        newErrors.utilizationToDate = "Utilization to date is required";
        setErrors(newErrors);
        return;
      }
      if (!ucSubmissionDate) {
        newErrors.ucSubmissionDate = "Submission date is required";
        setErrors(newErrors);
        return;
      }
    }



    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setOpen(true)
    }
    else {
      setOpen(false)
    }
  }
  const hasInvalidAmount = refDocList.some(
    (i) => !i.amount || Number(i.amount) <= 0
  );

  const getForwaredTabs = async () => {
    try {
      const payload = encryptPayload({ appModuleUrl: location.pathname })
      const res = await getWorkflowTabService(payload)
      // console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        setTabs(res?.data.data)
      }

    } catch (error) {
      console.log(error);
    }
  }

  // console.log(tabs);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (hasInvalidAmount) {
    //   setOpen(false)
    //   toast.error("Please enter valid amount for all reference documents");
    //   return;
    // }

    try {
      const payloadObj = {
        forwardedId,
        ucId: ucDetailsDTO?.ucId,
        utilizationDesc,
        utilizationFromDate: utilizationFromDate.split("-").reverse().join("/"),
        utilizationToDate: utilizationToDate.split("-").reverse().join("/"),
        ucSubmissionDate: ucSubmissionDate.split("-").reverse().join("/"),
        fundReleaseId: workOrderDTO?.fundReleaseDto?.fundReleaseId,
        extraExpenditure: extraExpenditure,

        refDocuments: refDocList?.map((i) => ({
          ucDocId: i.ucDocId || null,
          refDocName: i.refDocName || null,
          refDocPath: i.refDocPath || null,
          refAmount: i.amount || 0
        }))
      };
      const payload = encryptPayload(payloadObj);

      const formDataObj = new FormData();
      formDataObj.append("cipherText", payload);

      if (ucDoc) {
        formDataObj.append("ucDocument", ucDoc);
      }

      refDocList.forEach((doc) => {
        if (doc.file) {
          formDataObj.append("refDocument", doc.file);
        } else {
          formDataObj.append("refDocument", new Blob([]));
        }
      });



      const res = await saveUCdetailsService(formDataObj);
      // console.log(res);

      if (res?.status === 200 && res?.data?.outcome) {
        toast.success(res?.data.message);
        resetForm();
        setFlag(false)
        setOpen(false)
      } else {
        toast.error(res?.data?.message);
        resetForm();
        setOpen(false)
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }

  };
  // console.log(errors);

  const resetForm = () => {
    setFormData({
      finYear: "",
      projectId: "",
      milestoneId: "",
      utilizationDesc: "",
      utilizationFromDate: "",
      utilizationToDate: "",
      ucSubmissionDate: "",
    });

    setProjectOpts([]);
    setMilestoneOpts([]);

    setWorkOrderDTO({});

    setUcDoc(null);

    setRefDocList([{ id: Date.now(), file: null }]);
  };
  useEffect(() => {
    getWorkFlow()
    getAllFinOpts();
    getForwaredTabs();
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
    if (projectId && milestoneId && tabCodePro) {
      getAllUCdetails();
    }
  }, [projectId, milestoneId, tabCodePro]);
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
  const [existingUcDocName, setExistingUcDocName] = useState("");
  useEffect(() => {
    if (Object.keys(ucDetailsDTO).length > 0) {
      setFormData((prev) => ({
        ...prev,
        utilizationDesc: ucDetailsDTO?.utilizationDesc || "",
        utilizationFromDate:
          ucDetailsDTO?.utilizationFromDate?.split("/").reverse().join("-") ||
          "",
        utilizationToDate:
          ucDetailsDTO?.utilizationToDate?.split("/").reverse().join("-") || "",
        ucSubmissionDate:
          ucDetailsDTO?.ucSubmissionDate?.split("/").reverse().join("-") || "",
      }));
      setExistingUcDocName(ucDetailsDTO?.ucDocName || null);
      // setRefDocList(ucDetailsDTO?.refDocuments || [])

      setRefDocList(
        (ucDetailsDTO?.refDocuments || []).map((doc) => ({
          ...doc,
          id: doc.refDocId ?? generateId(),
          file: null,
          ucDocId: doc.ucDocId,
          refDocPath: doc.refDocPath,
          refDocName: doc.refDocName,
          refDocBase64: doc.refDocBase64,
          amount: doc?.refAmount
        }))
      );
    }
  }, [ucDetailsDTO]);

  // console.log(ucDetailsDTO?.refDocuments);

  const totalAmount = refDocList.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );

  useEffect(() => {
    if (pillTabData.length > 0 && !value) {
      setValue(pillTabData[0].value);
      setTabCodePro(pillTabData[0].tabCode);
    }
  }, [pillTabData]);


  const releaseAmount =
    Number(workOrderDTO?.fundReleaseDto?.milestoneAllocationAmount || 0);

  const extraExpenditure =
    totalAmount > releaseAmount
      ? totalAmount - releaseAmount
      : 0;






  return (
    <form action="" onSubmit={handleConfirmModal}>
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
            UC Submission
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
            <div className="col-span-12">


              <TabContext value={value}>

                {pillTabData.length > 0 && (
                  <div className="col-span-12 mb-3">
                    <PillTabs
                      value={value}
                      tabs={pillTabData}
                      onChange={handleChange}
                      align="flex-start"
                    />
                  </div>
                )}
                {
                  flag ?
                    <>
                      {pillTabData?.map((i) => (
                        <TabPanel key={i.value} value={i.value} sx={{ p: 0, mt: 1 }}>
                          <div className="grid grid-cols-12 gap-6 mt-7">
                            <div className="col-span-12">
                              <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                                {/* Floating Title */}
                                <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                                  Work Order Details
                                </span>

                                {/* GRID */}
                                <div className="grid grid-cols-12 gap-y-3 gap-x-6 text-sm">
                                  {/* ---------- MILESTONE DETAILS ---------- */}
                                  <div className="col-span-3 flex gap-1">
                                    <span className="font-normal text-gray-700">
                                      Work Order Number
                                    </span>
                                    :
                                    <span className="text-slate-900 font-semibold uppercase">
                                      {workOrderDTO?.workOrderNo || "N/A"}
                                    </span>
                                  </div>

                                  <div className="col-span-3 flex gap-1">
                                    <span className="font-normal text-gray-700">
                                      Work Order Date
                                    </span>
                                    :
                                    <span className="text-slate-900 font-semibold uppercase">
                                      {workOrderDTO?.workOrderDate || "N/A"}
                                    </span>
                                  </div>

                                  <div className="col-span-3 flex gap-1">
                                    <span className="font-normal text-gray-700">
                                      Sanction Order Number
                                    </span>
                                    :
                                    <span className="text-slate-900 font-semibold uppercase">
                                      {workOrderDTO?.fundReleaseDto?.sanctionOrderNo ||
                                        "N/A"}
                                    </span>
                                  </div>

                                  <div className="col-span-3 flex gap-1">
                                    <span className="font-normal text-gray-700">
                                      Sanction Order Date
                                    </span>
                                    :
                                    <span className="text-slate-900 font-semibold uppercase">
                                      {workOrderDTO?.fundReleaseDto?.sanctionOrderDate ||
                                        "N/A"}
                                    </span>
                                  </div>

                                  <div className="col-span-3 flex gap-1">
                                    <span className="font-normal text-gray-700">
                                      Release Letter Number
                                    </span>
                                    :
                                    <span className="text-slate-900 font-semibold uppercase">
                                      {workOrderDTO?.fundReleaseDto?.releaseLetterNo ||
                                        "N/A"}
                                    </span>
                                  </div>

                                  <div className="col-span-3 flex gap-1">
                                    <span className="font-normal text-gray-700">
                                      Release Letter Date
                                    </span>
                                    :
                                    <span className="text-slate-900 font-semibold uppercase">
                                      {workOrderDTO?.fundReleaseDto?.releaseLetterDate ||
                                        "N/A"}
                                    </span>
                                  </div>

                                  <div className="col-span-3 flex gap-1">
                                    <span className="font-normal text-gray-700">
                                      Release Amount
                                    </span>
                                    :
                                    <span className="text-slate-900 font-semibold uppercase">
                                      {workOrderDTO?.fundReleaseDto?.milestoneAllocationAmount ||
                                        "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-12">
                              <div className="relative border border-dashed border-orange-300 bg-[#fffaf6] p-4 rounded-md mb-3">
                                <span className="absolute -top-3 left-4 bg-[#fffaf6] px-3 text-sm font-semibold text-orange-600">
                                  UC Details
                                </span>
                                <div className="grid grid-cols-12 gap-6 text-sm">
                                  <div className="col-span-4">
                                    <InputField
                                      label="Utilization Description"
                                      required={true}
                                      name="utilizationDesc"
                                      textarea={true}
                                      // disabled={utilizationDesc ? true : false}
                                      value={utilizationDesc}
                                      onChange={handleChangeInput}
                                      error={errors.utilizationDesc}
                                    />
                                  </div>
                                  <div className="col-span-2 ">


                                    <InputField
                                      label="Utilization From Date"
                                      name="utilizationFromDate"
                                      type="date"
                                      required={true}
                                      value={utilizationFromDate}
                                      // disabled={utilizationFromDate ? true : false}
                                      onChange={handleChangeInput}
                                      error={errors.utilizationFromDate}
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <InputField
                                      label="Utilization To Date"
                                      name="utilizationToDate"
                                      type="date"
                                      required={true}
                                      value={utilizationToDate}
                                      // disabled={utilizationToDate ? true : false}
                                      onChange={handleChangeInput}
                                      error={errors.utilizationToDate}

                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <InputField
                                      label="Submission Date"
                                      required={true}
                                      value={ucSubmissionDate}
                                      // disabled={ucSubmissionDate ? true : false}
                                      name="ucSubmissionDate"
                                      type="date"
                                      onChange={handleChangeInput}
                                      error={errors.ucSubmissionDate}
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <div className="col-span-2">
                                      <InputField
                                        label="UC Document"
                                        required={true}
                                        name="blockNameEN"
                                        type="file"
                                        onChange={(e) => {
                                          const file = e.target.files[0];
                                          if (!file) return;

                                          if (validateFileSize(file)) {
                                            setUcDoc(file);
                                          } else {
                                            e.target.value = "";
                                            setUcDoc(null);
                                          }
                                        }}
                                      // disabled={existingUcDocName ? true : false}
                                      />
                                      <span
                                        className="text-[11px] text-blue-600"
                                        onClick={() =>
                                          openDocument(
                                            ucDetailsDTO?.ucDocBase64,
                                            "application/pdf"
                                          )
                                        }
                                      >
                                        {existingUcDocName}
                                        {/* hello */}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-span-12">
                                    <div className="grid grid-cols-12 gap-4">
                                      {refDocList.map((item, index) => (
                                        <div key={item.id} className="col-span-4 flex gap-2 relative">
                                          {/* Remove Button */}
                                          {refDocList.length > 1 && (
                                            <button
                                              type="button"
                                              className="absolute right-1 top-1 text-red-600 z-10"
                                              onClick={() => removeRefDoc(item.id)}
                                            >
                                              <IoIosRemoveCircleOutline />
                                            </button>
                                          )}

                                          <div className="flex flex-col justify-items-start">
                                            <InputField
                                              label={`Reference Document ${index + 1}`}
                                              type="file"
                                              onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;

                                                if (validateFileSize(file)) {
                                                  handleRefDocChange(item.id, "file", file);
                                                } else {
                                                  e.target.value = "";
                                                  handleRefDocChange(item.id, "file", null);
                                                }
                                              }}
                                            />

                                            {item.refDocName && (
                                              <span
                                                className="block mt-1 text-sm text-blue-600 cursor-pointer text-[11px]"
                                                onClick={() =>
                                                  openDocument(
                                                    item.refDocBase64,
                                                    "application/pdf"
                                                  )
                                                }
                                              >
                                                {item.refDocName}
                                              </span>
                                            )}
                                          </div>
                                          <InputField
                                            label={`Amount ${index + 1}`}
                                            type="number"
                                            min="0"
                                            value={item.amount}
                                            onChange={(e) =>
                                              handleRefDocChange(item.id, "amount", e.target.value)
                                            }
                                          />


                                          {/* Existing document */}


                                          {/* Add Button */}
                                          {index === refDocList.length - 1 && (
                                            <button
                                              type="button"
                                              onClick={addRefDoc}
                                              style={{ top: "25px" }}
                                              // disabled={item}
                                              className="absolute  right-0.5 bg-green-700 px-2 py-2 text-white rounded-r-md"
                                            >
                                              <FaSquarePlus />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="w-max flex justify-start mt-3 gap-2.5">
                              <div className="px-4 py-2 bg-gray-100 rounded-md text-sm font-semibold text-gray-700">
                                Total Amount :{" "}
                                <span className="text-gray-900">
                                  ₹{totalAmount.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <div className="px-4 py-2 bg-gray-100 rounded-md text-sm font-semibold text-gray-700">
                                Extra Expenditure :{" "}
                                <span className="text-gray-900">
                                  ₹{extraExpenditure.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TabPanel>
                      ))}
                    </>
                    :
                    <div className="flex items-center justify-center py-6 text-sm text-gray-500 border border-slate-200">
                      <p>No records available</p>
                    </div>

                }

              </TabContext>

            </div>
          </div>


        </div>



        {/* Footer (Optional) */}
        <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
          <ResetBackBtn />
          {/* {userSelect?.menu.userDetails.roleCode === "ROLE_AGENCY" && (
            <SubmitBtn type="submit" />
          )} */}
          {
            flag && button?.map((i, index) => {
              return (
                <button
                  type={'submit'}
                  key={index}
                  className={i?.actionType.color}
                  onClick={() => setForwardedId(i.forwardedId)}
                >
                  <GrSave /> {i?.actionType.actionNameEn}
                </button>
              )
            })
          }
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

export default UCsubmission;
