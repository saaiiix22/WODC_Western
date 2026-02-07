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
  getTemplateFileService,
  saveBeneficaryByExcelService,
  saveTempBenListService,
} from "../../services/projectService";
import { GrDocumentExcel, GrSave } from "react-icons/gr";
import { GrDocumentUpload } from "react-icons/gr";
import { toast } from "react-toastify";
import { getBlockThroughDistrictService } from "../../services/gpService";
import { getGpByBlockService } from "../../services/villageService";
import {
  getVillageThroughGpService,
  getWardByMunicipalityService,
} from "../../services/projectService";
import { getMunicipalityViaDistrictsService } from "../../services/wardService";
import { getAllDists } from "../../services/blockService";
import { Modal, Box, Typography, IconButton, Divider, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MdOutlineAddCircle } from "react-icons/md";
import InputField from "../../components/common/InputField";
import { getUpdatedBankListService } from "../../services/budgetService";
import { useLocation } from "react-router-dom";
import { forwardListByMenuService } from "../../services/workflowService";


const modalStyle = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -20%)",
  width: "80%",
  bgcolor: "background.paper",
  borderRadius: "3px",
  boxShadow: 24,
  p: 0,
};


const AddBeneficiary = () => {

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [button, setButtons] = useState([])


  const location = useLocation()
  console.log(button);

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
    projectId: "",
    milestoneId: "",
    districtId: "",
    blockId: "",
    gpId: "",
    municipalityId: "",
    areaType: "BLOCK",
    objectId: "",
  });
  const {
    projectId,
    milestoneId,
    districtId,
    blockId,
    gpId,
    municipalityId,
    areaType,
    objectId,
  } = formData;
  const [uploadType, setUploadType] = useState("");
  const [distListOpts, setDistListOpts] = useState([]);
  const [blockOpts, setBlockOpts] = useState([]);
  const [gpOpts, setGpOptions] = useState([]);
  const [villageOpts, setVillageOpts] = useState([]);
  const [municipalityOpts, setMunicipalityOpts] = useState([]);
  const [wardOpts, setWardOpts] = useState([]);

  const load = async (serviceFn, payload, setter) => {
    try {
      const res = await serviceFn(encryptPayload(payload));
      setter(res?.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getAllDistOpts = () =>
    load(getAllDists, { isActive: true }, setDistListOpts);

  const getAllBlockOpts = () =>
    load(
      getBlockThroughDistrictService,
      { isActive: true, districtId },
      setBlockOpts
    );

  const getAllGPoptions = () =>
    load(getGpByBlockService, { isActive: true, blockId }, setGpOptions);

  const getVillageList = () =>
    load(getVillageThroughGpService, { isActive: true, gpId }, setVillageOpts);

  const getAllMunicipalityList = () =>
    load(
      getMunicipalityViaDistrictsService,
      { isActive: true, districtId },
      setMunicipalityOpts
    );

  const getAllWardOptions = () =>
    load(
      getWardByMunicipalityService,
      { isActive: true, municipalityId },
      setWardOpts
    );

  useEffect(() => {
    getWorkFlow();
    getAllDistOpts();
  }, []);

  useEffect(() => {
    if (districtId) {
      getAllBlockOpts();
      getAllMunicipalityList();
    }

    if (blockId) {
      getAllGPoptions();
    }

    if (gpId) {
      getVillageList();
    }

    if (municipalityId) {
      getAllWardOptions();
    }
  }, [districtId, blockId, gpId, municipalityId]);
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

  const [beneficiaryDoc, setBeneficiaryDoc] = useState(null);

  const handleInput = async (e) => {
    const { name, files, value } = e.target;
    if (name === "beneficiaryDoc") {
      setBeneficiaryDoc(files[0]);
    }
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
      prev?.includes(beneficiaryId)
        ? prev.filter((id) => id !== beneficiaryId)
        : [...prev, beneficiaryId]
    );

    setSelectedBeneficiaries((prev) =>
      prev?.includes(beneficiaryId)
        ? prev.filter((id) => id !== beneficiaryId)
        : [...prev, beneficiaryId]
    );
  };

  const [bankOptions, setBankOptions] = useState([]);
  const getAllBankOptions = async () => {
    try {
      const res = await getUpdatedBankListService();
      // console.log(res);
      setBankOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  const handleRowInput = (index, name, value) => {
    const updated = [...tableFormData];
    updated[index][name] = value;
    setTableFormData(updated);
  };

  const [tableFormData, setTableFormData] = useState([{
    beneficiaryName: "",
    contactNo: "",
    email: "",
    address: "",
    aadhaarNo: "",
    dob: "",

    bankId: "",
    branchName: "",
    accountNo: "",
    ifscCode: ""
  }]);
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    return dateStr?.split("/").reverse().join("-");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (uploadType === "ADD_BENEFICIARY") {
        if (!activeArr || activeArr.length === 0) {
          toast.error("Please select at least one beneficiary");
          return;
        }

        const sendData = {
          projAgnMlstId: projectOverView?.projectAgencyMilestoneMapId,
          beneficiaryIds: activeArr,
        };

        const payload = encryptPayload(sendData);
        const res = await saveUpdateAgencyMilestoneService(payload);

        if (res?.status === 200 && res?.data.outcome) {
          toast.success(res?.data.message);

          setUploadType("");
          setActiveArr([]);
        } else {
          toast.error(res?.data?.message);

        }
      }

      if (uploadType === "EXCEL") {
        // toast.info("Excel upload will be handled separately");
        if (!beneficiaryDoc) {
          toast.error("Please upload an Excel file");
          toast
          return;
        }
        const dataTobeSent = {
          areaType,
          objectType: areaType === "BLOCK" ? "VILLAGE" : "WARD",
          objectId: objectId,
        };
        // console.log(dataTobeSent)
        const payload = encryptPayload(dataTobeSent);
        const fmData = new FormData();
        fmData.append("beneficiaryExcel", beneficiaryDoc);
        fmData.append("cipherText", payload)

        const res = await saveBeneficaryByExcelService(fmData);
        console.log(res)
        if (res?.data.outcome && res?.status === 200) {
          toast.success(res?.data.message)
          const formattedData = res?.data.data.map((row) => ({
            ...row,
            dob: formatDateForInput(row.tempDob),
            bankId: row?.bankId?.bankId

          }));
          setTableFormData(formattedData)
          handleOpen()
        } else {
          toast.error(res?.data.message)
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault()
    try {
      const payload = encryptPayload({
        tempList: tableFormData,
        projAgnMlstId: projectOverView?.projectAgencyMilestoneMapId
      })
      const res = await saveTempBenListService(payload)
      console.log(res);
      if (res?.data.outcome && res?.status === 200) {
        handleClose()
        toast.success(res?.data.message)
      }
      else {
        handleClose()
        toast.error(res?.data.message)
      }
    } catch (error) {
      throw error
    }
  }

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

  const downloadExcel = (blob, fileName = "template.xlsx") => {
    const url = window.URL.createObjectURL(
      new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const getTemplateFile = async () => {
    try {
      const res = await getTemplateFileService();
      console.log(res);
      downloadExcel(res.data, "Template.xlsx");
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllDropdowns();
    getAllBankOptions()
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
    <>
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


              {formData.projectId && formData.milestoneId && (
                <div className="col-span-12">
                  <div className="">
                    {/* Header Section (Minimal) */}
                    <div className="flex items-center mb-5 gap-5">
                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold text-light-dark">
                          Milestone Detail
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

              {
                <div className="col-span-12">
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">
                    Select Upload Type <span className="text-red-500">*</span>
                  </label>

                  <div className="flex gap-4">
                    <label
                      htmlFor="radio1"
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm
        ${!formData.milestoneId || !formData.projectId
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 hover:border-blue-500 cursor-pointer"
                        }`}
                    >
                      <input
                        type="radio"
                        id="radio1"
                        name="uploadType"
                        value="EXCEL"
                        onChange={handleInp}
                        disabled={!formData.milestoneId || !formData.projectId}
                        className="accent-blue-600"
                      />
                      By Excel
                    </label>

                    <label
                      htmlFor="radio3"
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm
        ${!formData.milestoneId || !formData.projectId
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 hover:border-blue-500 cursor-pointer"
                        }`}
                    >
                      <input
                        type="radio"
                        id="radio3"
                        name="uploadType"
                        value="ADD_BENEFICIARY"
                        onChange={handleInp}
                        disabled={!formData.milestoneId || !formData.projectId}
                        className="accent-blue-600"
                      />
                      Manually
                    </label>
                  </div>
                </div>


              }
              {uploadType === "EXCEL" && (
                <>
                  {/* <div className="col-span-2 pt-5">
                    <div className="flex items-center">
                      <button
                        className="me-3 text-sm flex items-center gap-1 px-3 py-1 rounded-sm bg-green-600/25 text-green-700"
                        onClick={getTemplateFile}
                        type="button"
                      >
                        <GrDocumentExcel />
                        Excel
                      </button>

                    </div>

                  </div> */}


                  <div className="col-span-2">
                    <SelectField
                      label="District"
                      required={true}
                      name="districtId"
                      value={districtId}
                      onChange={handleInput}
                      options={distListOpts?.map((d) => ({
                        value: d.districtId,
                        label: d.districtName,
                      }))}
                      // error={errors.districtId}
                      placeholder="Select"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[13px] font-medium text-gray-700">
                      Select Area Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-5 items-center">
                      <div className="flex gap-1">
                        <input
                          type="radio"
                          value={"BLOCK"}
                          name="areaType"
                          // checked={
                          //   stateSelect?.areaType === "BLOCK" ? true : false
                          // }
                          checked={formData.areaType === "BLOCK"}
                          id="radio1"
                          onChange={handleInput}
                        />
                        <label
                          htmlFor="radio1"
                          className="text-sm text-slate-800"
                        >
                          Block
                        </label>
                      </div>
                      <div className="flex gap-1">
                        <input
                          type="radio"
                          value={"MUNICIPALITY"}
                          name="areaType"
                          // checked={
                          //   stateSelect?.areaType === "MUNICIPALITY"
                          //     ? true
                          //     : false
                          // }
                          checked={formData.areaType === "MUNICIPALITY"}
                          id="radio2"
                          onChange={handleInput}
                        />
                        <label
                          htmlFor="radio2"
                          className="text-sm text-slate-800"
                        >
                          Municipality
                        </label>
                      </div>
                    </div>
                  </div>
                  {areaType === "BLOCK" && (
                    <>
                      <div className="col-span-2">
                        <SelectField
                          label="Block Name"
                          required={true}
                          name="blockId"
                          value={blockId}
                          onChange={handleInput}
                          options={blockOpts?.map((d) => ({
                            value: d.blockId,
                            label: d.blockNameEN,
                          }))}
                          disabled={districtId ? false : true}
                          //   error={errors.districtId}
                          placeholder="Select "
                        />
                      </div>
                      <div className="col-span-2">
                        <SelectField
                          label="GP Name"
                          required={true}
                          name="gpId"
                          value={gpId}
                          onChange={handleInput}
                          options={gpOpts?.map((d) => ({
                            value: d.gpId,
                            label: d.gpNameEN,
                          }))}
                          disabled={blockId ? false : true}
                          //   error={errors.districtId}
                          placeholder="Select "
                        />
                      </div>
                      <div className="col-span-2">
                        <SelectField
                          label="Village Name"
                          required={true}
                          name="objectId"
                          value={objectId}
                          onChange={handleInput}
                          options={villageOpts?.map((d) => ({
                            value: d.villageId,
                            label: d.villageNameEn,
                          }))}
                          disabled={gpId ? false : true}
                          // error={errors.objectId}
                          placeholder="Select"
                        />
                      </div>
                      {/* <div className="col-span-2 pt-7">
                        <div className="flex items-center">
                          <button
                        className="me-3 text-sm flex items-center gap-1 px-3 py-1 rounded-sm bg-green-600/25 text-green-700"
                        onClick={getTemplateFile}
                        type="button"
                      >
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
                          name="beneficiaryDoc"
                          onChange={handleInput}
                        />
                      </div> */}
                    </>
                  )}
                  {areaType === "MUNICIPALITY" && (
                    <>
                      <div className="col-span-2">
                        <SelectField
                          label="Municipality Name"
                          required={true}
                          name="municipalityId"
                          value={municipalityId}
                          onChange={handleInput}
                          options={municipalityOpts?.map((d) => ({
                            value: d.municipalityId,
                            label: d.municipalityName,
                          }))}
                          disabled={districtId ? false : true}
                          //   error={errors.districtId}
                          placeholder="Select"
                        />
                      </div>
                      <div className="col-span-2">
                        <SelectField
                          label="Ward Name"
                          required={true}
                          name="objectId"
                          value={objectId}
                          onChange={handleInput}
                          options={wardOpts?.map((d) => ({
                            value: d.wardId,
                            label: d.wardName,
                          }))}
                          disabled={municipalityId ? false : true}
                          // error={errors.objectId}
                          placeholder="Select "
                        />
                      </div>
                    </>
                  )}

                  <div className="col-span-2 pt-7">
                    <div className="flex items-center">
                      <button
                        className="me-3 text-sm flex items-center gap-1 px-3 py-1 rounded-sm bg-green-600/25 text-green-700"
                        onClick={getTemplateFile}
                        type="button"
                      >
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
                      name="beneficiaryDoc"
                      onChange={handleInput}
                    />
                  </div>
                </>
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
                                checked={activeArr?.includes(i.beneficiaryId)}
                                onChange={() =>
                                  handleCheckboxChange(i.beneficiaryId)
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {tableData?.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-sm p-2 text-center">
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer (Optional) */}
          <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
            <ResetBackBtn />
            {/* <SubmitBtn type={"submit"} /> */}
            {
              button?.map((i, index) => {
                return (
                  <button
                    type={'submit'}
                    key={index}
                    className={i?.actionType.color}
                  >
                    <GrSave /> {i?.actionType.actionNameEn}
                  </button>
                )
              })
            }
          </div>
        </div>
      </form>
      <div>
        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                py: 1,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Add Beneficiary
              </Typography>

              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider />

            {/* Content */}
            <Box sx={{ px: 3, py: 2 }}>
              <form action="" onSubmit={handleSubmitModal}>
                <table className="table-fixed w-full border border-orange-300">
                  <thead className="bg-orange-200">
                    <tr>
                      <td className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-orange-300">
                        SL No
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                        Beneficiary Name
                      </td>

                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                        DOB
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                        Aadhar Number
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                        Contact Number
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                        Email
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-orange-300">
                        Address
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
                        IFSC Code
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {tableFormData?.map((row, index) => (
                      <tr key={index} className="border-b border-orange-300">
                        <td className="border-r border-orange-300 text-center">
                          {index + 1}
                        </td>
                        <td className="border-r border-orange-300 text-center p-2">
                          <InputField
                            name="beneficiaryName"
                            value={row.beneficiaryName}
                            onChange={(e) => handleRowInput(index, "beneficiaryName", e.target.value)}
                          />
                        </td>
                        <td className="border-r border-orange-300 text-center p-2">
                          <InputField
                            type="date"
                            name="dob"
                            value={row.dob}
                            onChange={(e) => handleRowInput(index, "dob", e.target.value)}

                          />
                        </td>
                        <td className="border-r border-orange-300 text-center p-2">
                          <InputField
                            name="aadhaarNo"
                            value={row.aadhaarNo}
                            onChange={(e) => handleRowInput(index, "aadhaarNo", e.target.value)}

                          />
                        </td>
                        <td className="border-r border-orange-300 text-center p-2">
                          <InputField
                            name="contactNo"
                            value={row.contactNo}
                            onChange={(e) => handleRowInput(index, "contactNo", e.target.value)}

                          />
                        </td>
                        <td className="border-r border-orange-300 text-center p-2">
                          <InputField
                            name="email"
                            value={row.email}
                            onChange={(e) => handleRowInput(index, "email", e.target.value)}

                          />
                        </td>
                        <td className="border-r border-orange-300 text-center p-2">
                          <InputField
                            name="address"
                            value={row.address}
                            onChange={(e) => handleRowInput(index, "address", e.target.value)}

                          />
                        </td>
                        <td className="border-r border-orange-300 text-center p-2">
                          <SelectField
                            name="bankId"
                            value={row.bankId}
                            options={bankOptions?.map((d) => ({
                              value: d.bankId,
                              label: d.bankName,
                            }))}
                            placeholder="Select"
                            onChange={(e) => handleRowInput(index, "bankId", e.target.value)}

                          />
                        </td>
                        <td className="border-r border-orange-300 text-center p-2">
                          <InputField
                            name="branchName"
                            value={row.branchName}
                            onChange={(e) => handleRowInput(index, "branchName", e.target.value)}

                          />
                        </td>
                        <td className="border-r border-orange-300 text-center p-2">
                          <InputField
                            name="accountNo"
                            value={row.accountNo}
                            onChange={(e) => handleRowInput(index, "accountNo", e.target.value)}

                          />
                        </td>
                        <td className="border-r border-orange-300 text-center p-2">
                          <InputField
                            name="ifscCode"
                            value={row.ifscCode}
                            onChange={(e) => handleRowInput(index, "ifscCode", e.target.value)}

                          />
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
                <div className="flex justify-center gap-2 text-[13px]  px-4 pt-3 rounded-b-md">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} />

                </div>
              </form>

            </Box>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default AddBeneficiary;
