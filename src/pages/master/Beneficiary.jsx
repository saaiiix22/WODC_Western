import React, { Fragment, useState } from "react";
import Typography from "@mui/material/Typography";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useEffect } from "react";
import { GoPencil } from "react-icons/go";
import { MdLockOutline, MdOutlineAddCircle } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import SelectField from "../../components/common/SelectField";
import { FaMinusCircle } from "react-icons/fa";
import { getBankNamesService } from "../../services/budgetService";
import {
  editBeneficiarySerice,
  empTypeService,
  getBeneficiaryDetailsService,
  getGenderService,
  saveBeneficiarySerice,
  toggleBeneficiaryStatus,
  // NEW: Import the new services
  empSkillService,
  empEducationService,
  empIncomeService
} from "../../services/beneficiaryService";
import {
  accountNumberUtil,
  cleanAadhaarUtil,
  cleanContactNoUtil,
  cleanEmailUtil,
  ifscUtil,
  validateAadhaarUtil,
  validateAccountNoUtil,
  validateContactNoUtil,
  validateEmailUtil,
  validateIfscUtil,
} from "../../utils/validationUtils";
import { getBlockThroughDistrictService } from "../../services/gpService";
import { getGpByBlockService } from "../../services/villageService";
import {
  getVillageThroughGpService,
  getWardByMunicipalityService,
} from "../../services/projectService";
import { getMunicipalityViaDistrictsService } from "../../services/wardService";
import { getAllDists } from "../../services/blockService";
import { Tooltip } from "@mui/material";

const Beneficiary = () => {
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FORM HANDLING - Updated with new fields
  const [formData, setFormData] = useState({
    districtId: "",
    blockId: "",
    gpId: "",
    municipalityId: "",
    areaType: "BLOCK",
    objectId: "",
    beneficiaryId: null,
    beneficiaryName: "",
    contactNo: "",
    email: "",
    address: "",
    aadhaarNo: "",
    dob: "",
    age: "", // NEW
    gender: "",
    employeeType: "",
    employeeSkill: "", // NEW
    employeeIncome: "", // NEW
    employeeEdu: "" // NEW
  });

  const {
    districtId,
    blockId,
    gpId,
    municipalityId,
    areaType,
    objectId,
    beneficiaryId,
    beneficiaryName,
    contactNo,
    email,
    address,
    aadhaarNo,
    dob,
    age, // NEW
    gender,
    employeeType,
    employeeSkill, // NEW
    employeeIncome, // NEW
    employeeEdu // NEW
  } = formData;

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatDateMMDDYY = (dateStr) => {
    if (!dateStr) return "";
    const [dd, mm, yyyy] = dateStr.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  // NEW: Calculate age from date of birth
  const calculateAge = (dateString) => {
    if (!dateString) return "";
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;
    if (name === "aadhaarNo") {
      updatedValue = cleanAadhaarUtil(value);
    }
    if (name === "contactNo") {
      updatedValue = cleanContactNoUtil(updatedValue);
    }

    // CLEAR ERROR WHEN USER TYPES
    setErrors((prev) => ({ ...prev, [name]: "" }));

    setFormData({ ...formData, [name]: updatedValue });

    // NEW: Calculate age when dob changes
    if (name === "dob") {
      const calculatedAge = calculateAge(value);
      setFormData(prev => ({ ...prev, age: calculatedAge }));
    }
  };

  const [distListOpts, setDistListOpts] = useState([]);
  const [blockOpts, setBlockOpts] = useState([]);
  const [gpOpts, setGpOptions] = useState([]);
  const [villageOpts, setVillageOpts] = useState([]);
  const [municipalityOpts, setMunicipalityOpts] = useState([]);
  const [wardOpts, setWardOpts] = useState([]);
  const [genderOpts, setGenderOPts] = useState([]);
  const [empTypeOpts, setEmpTypeOpts] = useState([]);
  
  // NEW: State for new dropdown options
  const [skillOpts, setSkillOpts] = useState([]);
  const [incomeRangeOpts, setIncomeRangeOpts] = useState([]);
  const [educationOpts, setEducationOpts] = useState([]);

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

  const loadEmpType = () =>
    load(empTypeService, null, setEmpTypeOpts)

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

  const getAllGender = () =>
    load(getGenderService, null, setGenderOPts)

  // NEW: Load skill options from service
  const loadSkillOptions = () => 
    load(empSkillService, null, setSkillOpts);
    
  // NEW: Load income range options from service  
  const loadIncomeRangeOptions = () => 
    load(empIncomeService, null, setIncomeRangeOpts);
    
  // NEW: Load education options from service
  const loadEducationOptions = () => 
    load(empEducationService, null, setEducationOpts);

  const [bankNameOptions, setBankNameOptions] = useState([]);
  const getAllBankOptions = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await getBankNamesService(payload);
      setBankNameOptions(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  const [rows, setRows] = useState([
    {
      beneficiaryBankId: null,
      bankId: "",
      branchName: "",
      accountNo: "",
      ifscCode: "",
    },
  ]);

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];

    if (
      !lastRow.bankId ||
      !lastRow.branchName.trim() ||
      !lastRow.accountNo.trim() ||
      !lastRow.ifscCode.trim()
    ) {
      toast.error(
        "Please fill all fields in the previous row before adding a new one"
      );
      return;
    }

    setRows([
      ...rows,
      {
        beneficiaryBankId: null,
        bankId: "",
        branchName: "",
        accountNo: "",
        ifscCode: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleInput = (index, name, value) => {
    const updated = [...rows];

    if (name === "accountNo") {
      value = accountNumberUtil(value);
    }

    if (name === "ifscCode") {
      value = ifscUtil(value);
    }

    updated[index][name] = value;
    setRows(updated);
  };

  const resetForm = () => {
    setFormData({
      districtId: "",
      blockId: "",
      gpId: "",
      municipalityId: "",
      areaType: "BLOCK",
      objectId: "",
      beneficiaryId: null,
      beneficiaryName: "",
      contactNo: "",
      email: "",
      address: "",
      aadhaarNo: "",
      dob: "",
      age: "", // NEW
      gender: "",
      employeeType: "",
      employeeSkill: "", // NEW
      employeeIncome: "", // NEW
      employeeEdu: "" // NEW
    });
    setRows([
      {
        beneficiaryBankId: null,
        bankId: "",
        branchName: "",
        accountNo: "",
        ifscCode: "",
      },
    ]);
    setErrors({});
  };

  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);

 const handleSubmitConfirmModal = (e) => {
  e.preventDefault();
  let newErrors = {};

  // Validate district first
  if (!districtId) {
    newErrors.districtId = "District name is required";
    setErrors(newErrors);
    return;
  }

  // Validate area type specific fields
  if (areaType === "BLOCK") {
    if (!blockId) {
      newErrors.blockId = "Block is required";
      setErrors(newErrors);
      return;
    }
    if (!gpId) {
      newErrors.gpId = "GP is required";
      setErrors(newErrors);
      return;
    }
    if (!objectId) {
      newErrors.objectId = "Village is required";
      setErrors(newErrors);
      return;
    }
  }

  if (areaType === "MUNICIPALITY") {
    if (!municipalityId) {
      newErrors.municipalityId = "Municipality is required";
      setErrors(newErrors);
      return;
    }
    if (!objectId) {
      newErrors.objectId = "Ward is required";
      setErrors(newErrors);
      return;
    }
  }

  // Validate beneficiary name
  if (!beneficiaryName || !beneficiaryName.trim()) {
    newErrors.beneficiaryName = "Beneficiary name is required";
    setErrors(newErrors);
    return;
  }

  // Validate gender
  if (!gender) {
    newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return;
  }

  // Validate skill type
  if (!employeeSkill) {
    newErrors.employeeSkill = "Skill type is required";
    setErrors(newErrors);
    return;
  }

  // Validate income range
  if (!employeeIncome) {
    newErrors.employeeIncome = "Annual income range is required";
    setErrors(newErrors);
    return;
  }

  // Validate education
  if (!employeeEdu) {
    newErrors.employeeEdu = "Education level is required";
    setErrors(newErrors);
    return;
  }

  // Validate aadhaar
  if (!aadhaarNo || !aadhaarNo.trim()) {
    newErrors.aadhaarNo = "Aadhar number is required";
    setErrors(newErrors);
    return;
  } else if (!validateAadhaarUtil(aadhaarNo)) {
    newErrors.aadhaarNo = "Invalid Aadhaar number (must be 12 digits and cannot start with 0 or 1)";
    setErrors(newErrors);
    return;
  }

  // Validate DOB
  if (!dob || !dob.trim()) {
    newErrors.dob = "DOB is required";
    setErrors(newErrors);
    return;
  }

  // Validate contact
  const contactError = validateContactNoUtil(contactNo);
  if (contactError) {
    newErrors.contactNo = contactError;
    setErrors(newErrors);
    return;
  }
  if (!employeeType) {
    newErrors.employeeType = "Employee Type is required";
    setErrors(newErrors);
    return;
  }

  // Validate bank rows
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (!row.bankId) {
      toast.error(`Bank Name is required in Row ${i + 1}`);
      return;
    }

    if (!row.branchName || !row.branchName.trim()) {
      toast.error(`Row ${i + 1}: Branch Name is required`);
      return;
    }

    if (!validateAccountNoUtil(row.accountNo)) {
      toast.error(`Row ${i + 1}: Invalid Account Number (must be 8–18 digits)`);
      return;
    }

    if (!validateIfscUtil(row.ifscCode)) {
      toast.error(`Row ${i + 1}: Invalid IFSC Code format`);
      return;
    }
  }

  // If all validations pass
  setErrors({});
  setOpenSubmit(true);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = {
      districtId,
      areaType,
      objectType: areaType === "BLOCK" ? "VILLAGE" : "WARD",
      objectId: objectId,
      beneficiaryId,
      beneficiaryName,
      gender,
      contactNo,
      email,
      address,
      aadhaarNo,
      dob: formatDateToDDMMYYYY(dob),
      age, // NEW: Include age
      employeeType,
      employeeSkill, // NEW: Include skill type
      employeeIncome, // NEW: Include income range
      employeeEdu, // NEW: Include education
      beneficiaryCode: null,
      bankDetails: rows,
    };
    
    console.log(sendData);

    try {
      const payload = encryptPayload(sendData);
      const res = await saveBeneficiarySerice(payload);
      
      if (res?.data.outcome && res?.status === 200) {
        setOpenSubmit(false);
        getBeneficiaryTable();
        toast.success(res?.data.message);
        resetForm();
        setExpanded("panel2");
      } else {
        setOpenSubmit(false);
        toast.error(res?.data.message);
        resetForm();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving");
    }
  };

  const [tableData, setTableData] = useState([]);
  
  const getBeneficiaryTable = async () => {
    try {
      const payload = encryptPayload(false);
      const res = await getBeneficiaryDetailsService(payload);
      
      if (res?.status === 200 && res?.data.outcome) {
        setTableData(res?.data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBeneficiaryTable();
    getAllBankOptions();
    getAllDistOpts();
    getAllGender();
    loadEmpType();
    // NEW: Load new dropdown options from services
    loadSkillOptions();
    loadIncomeRangeOptions();
    loadEducationOptions();
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

  const [openModal, setOpenModal] = useState(false);

  const editBeneficiary = async (id) => {
    try {
      const payload = encryptPayload({ beneficiaryId: id });
      const res = await editBeneficiarySerice(payload);
      
      if (res?.status === 200 && res?.data.outcome) {
        const beneficiaryData = res?.data.data;
        
        // Format the data for the form
        setFormData({
          ...beneficiaryData,
          dob: formatDateMMDDYY(beneficiaryData.dob),
          age: beneficiaryData.age || "", // NEW: Include age
          employeeSkill: beneficiaryData.employeeSkill || "", // NEW: Include skill type
          employeeIncome: beneficiaryData.employeeIncome || "", // NEW: Include income range
          employeeEdu: beneficiaryData.employeeEdu || "", // NEW: Include education
          districtId: beneficiaryData.districtId || "",
          blockId: beneficiaryData.blockId || "",
          gpId: beneficiaryData.gpId || "",
          municipalityId: beneficiaryData.municipalityId || "",
        });
        
        setRows(beneficiaryData.bankDetails || []);
        setExpanded("panel1");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading beneficiary details");
    }
  };

  const [openMilestoneId, setMilestoneId] = useState("");

  const toggleStatus = async () => {
    try {
      const payload = encryptPayload({ beneficiaryId: openMilestoneId });
      const res = await toggleBeneficiaryStatus(payload);
      
      if (res?.status === 200 && res?.data.outcome) {
        setOpenModal(false);
        toast.success(res?.data.message);
        getBeneficiaryTable();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error changing status");
    }
  };

  // Updated columns to include new fields
  const agencyColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Beneficiary Name / Code",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p>{row.beneficiaryCode}</p> |{" "}
            <p className="text-slate-800">{row.beneficiaryName}</p>
          </div>
        ) || "N/A",
      sortable: true,
    },
     
    {
      name: "Skill Type", // NEW
      selector: (row) => {
        const skill = skillOpts?.find(s => s.lookupValueCode === row.employeeSkill);
        return skill?.lookupValueEn || row.employeeSkill || "N/A";
      },
      sortable: true,
    },
    {
      name: "Education", // NEW
      selector: (row) => {
        const edu = educationOpts?.find(e => e.lookupValueCode === row.employeeEdu);
        return edu?.lookupValueEn || row.employeeEdu || "N/A";
      },
      sortable: true,
    },
    {
      name: "Income Range", // NEW
      selector: (row) => {
        const income = incomeRangeOpts?.find(i => i.lookupValueCode === row.employeeIncome);
        return income?.lookupValueEn || row.employeeIncome || "N/A";
      },
      sortable: true,
    },
    {
      name: "Contact Number",
      selector: (row) => row.contactNo || "N/A",
      sortable: true,
    },
    {
      name: "Action",
      width: "120px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* EDIT BUTTON */}
          <Tooltip title="Edit" arrow>
            <button
              type="button"
              className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full hover:bg-blue-500/50 transition-colors"
              onClick={() => editBeneficiary(row?.beneficiaryId)}
            >
              <GoPencil className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* ACTIVE / INACTIVE BUTTON */}
          <Tooltip title={row.isActive ? "Deactivate" : "Activate"} arrow>
            <button
              className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors
                ${row.isActive
                  ? "bg-green-600/25 hover:bg-green-600/50 text-green-600"
                  : "bg-red-500/25 hover:bg-red-500/50 text-red-500"
                }`}
              onClick={() => {
                setMilestoneId(row?.beneficiaryId);
                setOpenModal(true);
              }}
            >
              {row.isActive ? (
                <MdLockOutline className="w-4 h-4" />
              ) : (
                <MdLockOpen className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="mt-3">
      {/* ---------- Accordion 1: Add/Edit Beneficiary Form ---------- */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          arrowcolor="#fff"
          sx={{
            backgroundColor: "#f4f0f2",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "14px",
              color: "#2c0014",
            }}
          >
            {beneficiaryId ? "Edit Beneficiary" : "Add Beneficiary"}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div className="p-3">
            <form
              className="grid grid-cols-12 gap-6"
              onSubmit={handleSubmitConfirmModal}
            >
              <div className="col-span-2">
                <SelectField
                  label="District"
                  required={true}
                  name="districtId"
                  value={districtId}
                  onChange={handleChangeInput}
                  options={distListOpts?.map((d) => ({
                    value: d.districtId,
                    label: d.districtName,
                  }))}
                  error={errors.districtId}
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
                      value="BLOCK"
                      name="areaType"
                      checked={formData.areaType === "BLOCK"}
                      id="radio1"
                      onChange={handleChangeInput}
                    />
                    <label htmlFor="radio1" className="text-sm text-slate-800">
                      Block
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="radio"
                      value="MUNICIPALITY"
                      name="areaType"
                      checked={formData.areaType === "MUNICIPALITY"}
                      id="radio2"
                      onChange={handleChangeInput}
                    />
                    <label htmlFor="radio2" className="text-sm text-slate-800">
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
                      onChange={handleChangeInput}
                      options={blockOpts?.map((d) => ({
                        value: d.blockId,
                        label: d.blockNameEN,
                      }))}
                      disabled={!districtId}
                      placeholder="Select"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <SelectField
                      label="GP Name"
                      required={true}
                      name="gpId"
                      value={gpId}
                      onChange={handleChangeInput}
                      options={gpOpts?.map((d) => ({
                        value: d.gpId,
                        label: d.gpNameEN,
                      }))}
                      disabled={!blockId}
                      placeholder="Select"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <SelectField
                      label="Village Name"
                      required={true}
                      name="objectId"
                      value={objectId}
                      onChange={handleChangeInput}
                      options={villageOpts?.map((d) => ({
                        value: d.villageId,
                        label: d.villageNameEn,
                      }))}
                      disabled={!gpId}
                      error={errors.objectId}
                      placeholder="Select"
                    />
                  </div>
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
                      onChange={handleChangeInput}
                      options={municipalityOpts?.map((d) => ({
                        value: d.municipalityId,
                        label: d.municipalityName,
                      }))}
                      disabled={!districtId}
                      placeholder="Select"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <SelectField
                      label="Ward Name"
                      required={true}
                      name="objectId"
                      value={objectId}
                      onChange={handleChangeInput}
                      options={wardOpts?.map((d) => ({
                        value: d.wardId,
                        label: d.wardName,
                      }))}
                      disabled={!municipalityId}
                      error={errors.objectId}
                      placeholder="Select"
                    />
                  </div>
                </>
              )}

              <div className="col-span-2">
                <InputField
                  label="Beneficiary Name"
                  required={true}
                  name="beneficiaryName"
                  placeholder="Enter beneficiary name"
                  value={beneficiaryName}
                  onChange={handleChangeInput}
                  error={errors.beneficiaryName}
                />
              </div>

              <div className="col-span-2">
                <SelectField
                  label="Gender"
                  required={true}
                  name="gender"
                  value={gender}
                  onChange={handleChangeInput}
                  options={genderOpts?.map(g => ({
                    label: g.lookupValueEn,
                    value: g.lookupValueCode
                  }))}
                  error={errors.gender}
                />
              </div>

              {/* NEW: Skill Type Field - Using same format as employeeType */}
              <div className="col-span-2">
                <SelectField
                  label="Skill Type"
                  required={true}
                  name="employeeSkill"
                  value={employeeSkill}
                  onChange={handleChangeInput}
                  options={skillOpts?.map(s => ({
                    label: s.lookupValueEn,
                    value: s.lookupValueCode
                  }))}
                  error={errors.employeeSkill}
                  placeholder="Select skill type"
                />
              </div>

              {/* NEW: Annual Income Range Field - Using same format as employeeType */}
              <div className="col-span-2">
                <SelectField
                  label="Annual Income Range"
                  required={true}
                  name="employeeIncome"
                  value={employeeIncome}
                  onChange={handleChangeInput}
                  options={incomeRangeOpts?.map(i => ({
                    label: i.lookupValueEn,
                    value: i.lookupValueCode
                  }))}
                  error={errors.employeeIncome}
                  placeholder="Select income range"
                />
              </div>

              {/* NEW: Education Field - Using same format as employeeType */}
              <div className="col-span-2">
                <SelectField
                  label="Education"
                  required={true}
                  name="employeeEdu"
                  value={employeeEdu}
                  onChange={handleChangeInput}
                  options={educationOpts?.map(e => ({
                    label: e.lookupValueEn,
                    value: e.lookupValueCode
                  }))}
                  error={errors.employeeEdu}
                  placeholder="Select education level"
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Aadhaar Number"
                  required={true}
                  name="aadhaarNo"
                  placeholder="Enter aadhaar number"
                  value={aadhaarNo}
                  onChange={handleChangeInput}
                  error={errors.aadhaarNo}
                  maxLength={12}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Date of birth"
                  required={true}
                  type="date"
                  name="dob"
                  value={dob}
                  onChange={handleChangeInput}
                  error={errors.dob}
                />
              </div>

              {/* NEW: Age Field (Auto-calculated, read-only) */}
              <div className="col-span-1">
                <InputField
                  label="Age"
                  name="age"
                  value={age}
                  readOnly={true}
                  disabled={true}
                  className="bg-gray-100"
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Contact Number"
                  required={true}
                  name="contactNo"
                  placeholder="Enter contact number"
                  value={contactNo}
                  onChange={handleChangeInput}
                  error={errors.contactNo}
                  maxLength={10}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-2">
                <SelectField
                  label="Employee Type"
                  required={true}
                  name="employeeType"
                  value={employeeType}
                  onChange={handleChangeInput}
                  options={empTypeOpts?.map(g => ({
                    label: g.lookupValueEn,
                    value: g.lookupValueCode
                  }))}
                  error={errors.employeeType}
                />
              </div>

              <div className="col-span-4">
                <InputField
                  label="Address"
                  textarea={true}
                  name="address"
                  placeholder="Enter address"
                  value={address}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-span-12">
                <div className="bg-slate-100 border-l-4 border-slate-600 px-4 py-2">
                  <h5 className="text-sm font-semibold text-slate-700">
                    Add Bank Details
                  </h5>
                </div>
              </div>

              <div className="col-span-12">
                <table className="table-fixed w-full border border-slate-300">
                  <thead className="bg-slate-100">
                    <tr>
                      <td className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-slate-200">
                        SL No
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        Bank Name
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        Branch Name
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        Account Number
                      </td>
                      <td className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
                        IFSC Code
                      </td>
                      <td className="w-[60px] text-center text-sm px-4 py-1 border-r border-slate-200">
                        <button type="button" onClick={handleAddRow}>
                          <MdOutlineAddCircle className="inline text-green-600 text-xl" />
                        </button>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {rows?.map((i, index) => (
                      <tr key={index} className="border-b border-slate-200">
                        <td className="border-r border-slate-200 text-center">
                          {index + 1}
                        </td>

                        <td className="border-r border-slate-200 px-2 py-1">
                          <SelectField
                            name="bankId"
                            value={i.bankId}
                            onChange={(e) =>
                              handleInput(index, "bankId", Number(e.target.value))
                            }
                            options={bankNameOptions?.map((opt) => ({
                              value: opt.bankId,
                              label: opt.bankName,
                            }))}
                            placeholder="Select"
                          />
                        </td>
                        
                        <td className="border-r border-slate-200 px-2 py-1">
                          <input
                            name="branchName"
                            value={i.branchName}
                            onChange={(e) =>
                              handleInput(index, "branchName", e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                          />
                        </td>
                        
                        <td className="border-r border-slate-200 px-2 py-1">
                          <input
                            name="accountNo"
                            value={i.accountNo}
                            maxLength={18}
                            onChange={(e) =>
                              handleInput(index, "accountNo", e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                          />
                        </td>
                        
                        <td className="border-r border-slate-200 px-2 py-1">
                          <input
                            name="ifscCode"
                            value={i.ifscCode}
                            onChange={(e) =>
                              handleInput(index, "ifscCode", e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 mt-1 text-sm"
                          />
                        </td>
                        
                        <td className="border-r border-slate-200 text-center">
                          {rows.length > 1 && (
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => handleRemoveRow(index)}
                            >
                              <FaMinusCircle />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="col-span-12">
                <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
                  <ResetBackBtn onClick={resetForm} />
                  <SubmitBtn
                    type={"submit"}
                    btnText={beneficiaryId ? "Update" : "Submit"}
                  />
                </div>
              </div>
            </form>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* ---------- Accordion 2: Beneficiary List ---------- */}
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          sx={{
            backgroundColor: "#f4f0f2",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "14px",
              color: "#2c0014",
            }}
          >
            Beneficiary List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={agencyColumn} />
        </AccordionDetails>
      </Accordion>

      <ReusableDialog
        open={openModal}
        description="Are you sure you want to change status?"
        onClose={() => setOpenModal(false)}
        onConfirm={toggleStatus}
      />

      <ReusableDialog
        open={openSubmit}
        description={`Are you sure you want to ${beneficiaryId ? 'update' : 'submit'} this beneficiary?`}
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default Beneficiary;