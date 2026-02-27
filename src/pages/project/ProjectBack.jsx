import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import { useEffect } from "react";
import SelectField from "../../components/common/SelectField";
import { GiSevenPointedStar } from "react-icons/gi";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { IoMdAddCircle } from "react-icons/io";
import { FaMinusCircle } from "react-icons/fa";
import {
  getBankNamesService,
  getFinancialYearService,
} from "../../services/budgetService";
import { getAllDists } from "../../services/blockService";
import { getBlockThroughDistrictService } from "../../services/gpService";
import { getGpByBlockService } from "../../services/villageService";
import {
  generateProjectCodeService,
  getBankConfigProjectService,
  getConsByBlockService,
  getConsByDistService,
  getConsThroughDistService,
  getJuridictionService,
  getProjectDetailsByProjectIdService,
  getProposalByDistService,
  getSectorService,
  getSubsectorService,
  getUpdatedFuncDetailsService,
  getVillageThroughGpService,
  getWardByMunicipalityService,
  maxBudgetService,
  projectAlllookUpValueService,
  saveProjectService,
  totalBudgetService,
} from "../../services/projectService";
import CommonFormModal from "../../components/common/CommonFormModal";
import { getMunicipalityViaDistrictsService } from "../../services/wardService";
import { getGIAtypeList } from "../../services/giaService";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedProject } from "../../redux/slices/projectSlice";
import { RiAiGenerate } from "react-icons/ri";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import ReusableDialog from "../../components/common/ReusableDialog";
import { avoidSpecialCharUtil, formatWithCommas, removeCommas } from "../../utils/validationUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { load } from "../../hooks/load";
import { forwardListByMenuService } from "../../services/workflowService";
import { GrSave } from "react-icons/gr";
import { constituencyTypeListService } from "../../services/constituencyService";
import { judictionMapConfigService } from "../../services/judictionMapConfigService";
import { sanitizeInputUtil } from "../../utils/sanitizeInputUtil";
import {
  getAllHeadListService,
  getSubHeadsByHeadIdlist,
} from "../../services/headService";

const Project = () => {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const stateSelect = useSelector((state) => state.project.selectedProject);

  const [formData, setFormData] = useState({
    districtId: "",
    blockId: "",
    gpId: "",
    municipalityId: "",

    projectId: null,
    finYear: "",
    projectName: "",
    projectCode: "",
    aaOrderNo: "",
    aaOrderDate: "",
    areaType: "BLOCK",
    constituencyId: "",
    districtProposed: "",

    proposeByDist: "",
    proposeByBlock: "",
    proposedBy: "",
    proposedByName: "",
    sectorId: "",
    sector: "",
    subSector: "",
    judictionType: "",
    constituencyTypeCode: "",
    startDate: "",
    endDate: "",
    actualStartDate: "",
    actualEndDate: "",
    fundAllocDate: null,

    projectStatus: "",
    estimatedBudget: "",

    objectType: "",
    objectId: "",

    approvedAmount: "",
    remarks: ""
  });

  const {
    districtId,
    blockId,
    gpId,
    municipalityId,
    projectId,
    finYear,
    projectName,
    projectCode,
    aaOrderNo,
    aaOrderDate,
    areaType,
    constituencyId,
    proposedBy,
    proposedByName,
    sectorId,
    sector,
    subSector,
    judictionType,
    constituencyTypeCode,
    startDate,
    endDate,
    actualStartDate,
    actualEndDate,
    fundAllocDate,

    proposeByBlock,
    proposeByDist,

    objectId,
    fundReleaseTo,
    estimatedBudget,
    approvedAmount,
    remarks,
  } = formData;

  // ALL SELECT'S OPTIONS
  const [finYearOpts, setFinYearOpts] = useState([]);
  const [distListOpts, setDistListOpts] = useState([]);
  const [blockOpts, setBlockOpts] = useState([]);
  const [gpOpts, setGpOptions] = useState([]);
  const [villageOpts, setVillageOpts] = useState([]);
  const [municipalityOpts, setMunicipalityOpts] = useState([]);
  const [wardOpts, setWardOpts] = useState([]);
  const [constituencyOpts, setConstituencyOpts] = useState([]);
  const [propsByBlock, setPropsByBlock] = useState([]);
  const [juridictionOpts, setJuridictionOpts] = useState([]);
  const [sectorOpts, setSectorOpts] = useState([]);
  const [subSectorOptions, setSubSectorOpts] = useState([]);
  const [giaOpts, setGIAoptions] = useState([]);
  const [actualFinDuartion, setActualFinDuartion] = useState({})

  // Head and Subhead options
  const [headOpts, setHeadOpts] = useState([]);
  const [subHeadOpts, setSubHeadOpts] = useState({}); // Changed to object for row-specific options

  // --------------------------------------------------------------------------
  const [forwardedId, setForwardedId] = useState(null)
  const [button, setButtons] = useState([])
  const [stageForwardedRuleStatus, setStageForwardedRuleStatus] = useState('')

  const location = useLocation()

  const getWorkFlow = async () => {
    try {
      const payload = encryptPayload({
        appModuleUrl: location.pathname,
        forwardedId: (forwardedId ? Number(forwardedId) : null)
      })
      const res = await forwardListByMenuService(payload)


      if (res?.status === 200 && res?.data.outcome) {
        // const filteredButtons = res?.data.data.filter(button =>
        //   button.actionType.actionCode !== stageForwardedRuleStatus
        // )

        setButtons(res?.data.data)
      } else {
        setButtons([])
      }
    } catch (error) {
      console.log(error)
      setButtons([])
    }
  }

  const getMLAMP = () =>
    load(getConsByBlockService, { blockId: proposeByBlock }, setJuridictionOpts)

  const getProposedByBlock = () =>
    load(getBlockThroughDistrictService, { isActive: true, districtId: proposeByDist }, setPropsByBlock);

  const getConsOpts = () =>
    load(getConsByBlockService, { blockId: blockId }, setConstituencyOpts)

  const getFinancialYearOptions = () =>
    load(getFinancialYearService, { isActive: true }, setFinYearOpts);

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

  const getAllSectors = () =>
    load(getSectorService, { isActive: true }, setSectorOpts);

  const getSubSectorOpts = () =>
    load(getSubsectorService, { isActive: true, sectorId }, setSubSectorOpts);

  const getGIATypeOpts = () =>
    load(getGIAtypeList, { isActive: true }, setGIAoptions);

  const getAllHeads = () =>
    load(getAllHeadListService, { isActive: true }, setHeadOpts);

  // Updated getSubHeadsByHeadId function to handle row-specific options
  const getSubHeadsByHeadId = async (headId, rowIndex = null) => {
    if (!headId) {
      if (rowIndex !== null) {
        setSubHeadOpts(prev => ({
          ...prev,
          [rowIndex]: []
        }));
      } else {
        setSubHeadOpts({});
      }
      return;
    }

    try {
      const payload = encryptPayload({
        isActive: true,
        headId: headId
      });
      const res = await getSubHeadsByHeadIdlist(payload);

      if (res?.status === 200 && res?.data?.outcome) {
        const subHeads = res.data.data || [];

        if (rowIndex !== null) {
          // Store subheads for specific row
          setSubHeadOpts(prev => ({
            ...prev,
            [rowIndex]: subHeads
          }));
        } else {
          // Store globally (for new rows)
          const globalOpts = {};
          globalOpts[0] = subHeads;
          setSubHeadOpts(globalOpts);
        }
      } else {
        if (rowIndex !== null) {
          setSubHeadOpts(prev => ({
            ...prev,
            [rowIndex]: []
          }));
        } else {
          setSubHeadOpts({});
        }
      }
    } catch (error) {
      console.error("Error fetching subheads:", error);
      toast.error("Failed to fetch subheads");
      if (rowIndex !== null) {
        setSubHeadOpts(prev => ({
          ...prev,
          [rowIndex]: []
        }));
      } else {
        setSubHeadOpts({});
      }
    }
  };

  // Function to load subheads for existing rows during edit
  const loadExistingSubHeads = async () => {
    if (stateSelect?.fundReleaseInfo?.length > 0) {
      // For each row that has a headId, load its subheads
      stateSelect.fundReleaseInfo.forEach(async (row, index) => {
        if (row.headId) {
          try {
            const payload = encryptPayload({
              isActive: true,
              headId: row.headId
            });
            const res = await getSubHeadsByHeadIdlist(payload);

            if (res?.status === 200 && res?.data?.outcome) {
              setSubHeadOpts(prev => ({
                ...prev,
                [index]: res.data.data || []
              }));
            }
          } catch (error) {
            console.error("Error loading subheads:", error);
          }
        }
      });
    }
  };

  const [modeOfTransferList, setModeOfTransferList] = useState([]);
  const getFavourandModeOpts = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await projectAlllookUpValueService(payload);
      setModeOfTransferList(res?.data.data.modeOfTransfer);
    } catch (error) {
      throw error;
    }
  };

  const [fundReleaseRows, setFundReleaseRows] = useState([
    {
      fundReleaseInfoId: null,
      headId: "",
      subHeadId: "",
      bankId: "",
      modeOfTransfer: "",
      favourOf: "",
      releaseAmount: "",
      giaYear: "",
      giaTypeId: "",
      bankAccConfigId: "",
      remarks: "",
      fundAllocDate: "",
    },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleAddRow = () => {
    const allFilled = fundReleaseRows.every(
      (item) =>
        item.headId &&
        item.subHeadId &&
        item.bankId &&
        item.modeOfTransfer &&
        item.releaseAmount &&
        item.giaYear &&
        item.giaTypeId &&
        item.bankAccConfigId

    );

    if (!allFilled) {
      toast.error("Please fill all the fields before adding another entry.");
      return;
    }

    setFundReleaseRows((prev) => {
      const updatedList = [
        ...prev,
        {
          fundReleaseInfoId: null,
          headId: "",
          subHeadId: "",
          bankId: "",
          modeOfTransfer: "",
          favourOf: "",
          releaseAmount: "",
          giaYear: "",
          giaTypeId: "",
          bankAccConfigId: "",
          remarks: "",
          fundAllocDate: "",
        },
      ];

      const total = updatedList.reduce(
        (sum, item) => sum + (parseFloat(item.releaseAmount) || 0),
        0
      );

      setTotalAmount(total);
      return updatedList;
    });
  };

  const handleRemoveRow = (index) => {
    setFundReleaseRows((prev) => prev.filter((_, i) => i !== index));
    // Also remove subhead options for this row
    setSubHeadOpts(prev => {
      const newOpts = { ...prev };
      delete newOpts[index];
      return newOpts;
    });
  };

  const [bankListOpts, setBankListOpts] = useState({});
  const getUpdatedFuncDetails = async (giaYear, giaTypeId, rowIndex) => {
    try {
      const payload = encryptPayload({
        finyearId: giaYear,
        giaTypeId: giaTypeId,
      });
      const res = await getUpdatedFuncDetailsService(payload);

      if (res?.status === 200 && res?.data?.outcome) {
        setBankListOpts((prev) => ({
          ...prev,
          [rowIndex]: res.data.data,
        }));
      }

      return res;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const [configOpts, setConfigOpts] = useState({});

  const recalcSequentialForCombination = (rows, combo) => {
    const indices = rows
      .map((r, i) => ({ r, i }))
      .filter(
        x =>
          x.r.giaYear === combo.giaYear &&
          x.r.giaTypeId === combo.giaTypeId &&
          x.r.bankId === combo.bankId &&
          x.r.bankAccConfigId === combo.bankAccConfigId
      )
      .map(x => x.i);

    if (!indices.length) return rows;

    const updated = [...rows];
    const totalBudget = Number(updated[indices[0]].maxamount || 0);

    let runningUsed = 0;

    indices.forEach(i => {
      let used = Number(updated[i].releaseAmount || 0);

      updated[i] = {
        ...updated[i],
        maxamount: totalBudget,
        remainingAmount: Math.max(totalBudget - runningUsed - used, 0),
      };

      runningUsed += used;
    });

    return updated;
  };

  const handleRowChange = async (e, index) => {
    const { name, value } = e.target;

    // ================= STATE UPDATE =================
    setFundReleaseRows(prev => {
      const rows = [...prev];
      const row = { ...rows[index], [name]: value };

      // Reset dependent fields
      if (name === "headId") {
        row.subHeadId = "";
        row.bankId = "";
        row.bankAccConfigId = "";
        row.releaseAmount = "";
        row.remainingAmount = 0;
        row.fundAllocDate = "";
      }

      if (name === "subHeadId") {
        row.bankId = "";
        row.bankAccConfigId = "";
        row.releaseAmount = "";
        row.remainingAmount = 0;
        row.fundAllocDate = "";
      }

      if (name === "giaYear" || name === "giaTypeId") {
        row.bankId = "";
        row.bankAccConfigId = "";
        row.releaseAmount = "";
        row.remainingAmount = 0;
        row.fundAllocDate = "";
      }

      if (name === "bankId") {
        row.bankAccConfigId = "";
        row.releaseAmount = "";
        row.remainingAmount = 0;
      }

      if (name === "releaseAmount") {
        const raw = removeCommas(value);

        if (!/^\d*$/.test(raw)) return rows;

        rows[index] = {
          ...rows[index],
          releaseAmount: raw,
        };

        const combo = {
          giaYear: rows[index].giaYear,
          giaTypeId: rows[index].giaTypeId,
          bankId: rows[index].bankId,
          bankAccConfigId: rows[index].bankAccConfigId,
        };

        return recalcSequentialForCombination(rows, combo);
      }

      rows[index] = row;
      return rows;
    });

    // Stop side effects for releaseAmount
    if (name === "releaseAmount") return;

    // ================= SIDE EFFECTS =================
    const currentRow = fundReleaseRows[index];

    const updatedYear =
      name === "giaYear" ? value : currentRow.giaYear;
    const updatedType =
      name === "giaTypeId" ? value : currentRow.giaTypeId;
    const updatedBank =
      name === "bankId" ? value : currentRow.bankId;
    const updatedBankConfig =
      name === "bankAccConfigId"
        ? value
        : currentRow.bankAccConfigId;
    const updatedHeadId =
      name === "headId" ? value : currentRow.headId;
    const updatedSubHeadId =
      name === "subHeadId" ? value : currentRow.subHeadId;

    // -------- Load Subheads when Head changes --------
    if (name === "headId" && updatedHeadId) {
      await getSubHeadsByHeadId(updatedHeadId, index);
      return;
    }

    // -------- Load Banks --------
    if (
      (name === "giaYear" || name === "giaTypeId") &&
      updatedYear &&
      updatedType
    ) {
      await getUpdatedFuncDetails(updatedYear, updatedType, index);
      return;
    }

    // -------- Load Bank Configs --------
    if (name === "bankId" && updatedBank) {
      const payload = encryptPayload({
        finyearId: updatedYear,
        giaTypeId: updatedType,
        bankId: updatedBank,
      });

      const res = await getBankConfigProjectService(payload);

      if (res?.status === 200 && res?.data?.outcome) {
        setConfigOpts(prev => ({
          ...prev,
          [index]: res.data.data,
        }));
      }
      return;
    }

    // -------- Load Budget --------
    if (
      name === "bankAccConfigId" &&
      updatedYear &&
      updatedType &&
      updatedBank &&
      updatedBankConfig
    ) {
      // Check existing row
      const existingRow = fundReleaseRows.find(
        (r, i) =>
          i !== index &&
          r.giaYear === updatedYear &&
          r.giaTypeId === updatedType &&
          r.bankId == updatedBank &&
          r.bankAccConfigId == updatedBankConfig &&
          r.maxamount !== undefined
      );

      if (existingRow) {
        const total = Number(existingRow.maxamount || 0);

        const used = fundReleaseRows.reduce((sum, r, i) => {
          if (i === index) return sum;
          if (
            r.giaYear === updatedYear &&
            r.giaTypeId === updatedType &&
            r.bankId == updatedBank &&
            r.bankAccConfigId == updatedBankConfig
          ) {
            return sum + (Number(r.releaseAmount) || 0);
          }
          return sum;
        }, 0);

        const remaining = Math.max(total - used, 0);

        setFundReleaseRows(prev => {
          const rows = [...prev];

          rows[index] = {
            ...rows[index],
            maxamount: total,
            releaseAmount: "",
            fundAllocDate,
          };

          return recalcSequentialForCombination(rows, {
            giaYear: updatedYear,
            giaTypeId: updatedType,
            bankId: updatedBank,
            bankAccConfigId: updatedBankConfig,
          });
        });

        return;
      }
      // Fetch from API
      const payload = encryptPayload({
        finyearId: updatedYear,
        giaTypeId: updatedType,
        bankId: updatedBank,
        bankAccConfigId: updatedBankConfig,
      });

      const res = await maxBudgetService(payload);

      if (res?.status === 200 && res?.data?.outcome) {
        const total = Number(res.data.data.totalBudget || 0);

        setFundReleaseRows(prev => {
          const rows = [...prev];
          rows[index] = {
            ...rows[index],
            maxamount: total,
            remainingAmount: total,
            fundAllocDate: res.data.data.fundAllocDate || "",
            releaseAmount: "",
          };

          return recalcSequentialForCombination(rows, {
            giaYear: updatedYear,
            giaTypeId: updatedType,
            bankId: updatedBank,
            bankAccConfigId: updatedBankConfig,
          });
        });
      }
    }
  };

  const validateField = (fieldName, fieldValue, data) => {
    let error = "";

    const selected = fieldValue ? new Date(fieldValue) : null;
    const aaDate = data.aaOrderDate ? new Date(data.aaOrderDate) : null;
    const startDateObj = data.startDate ? new Date(data.startDate) : null;
    const endDateObj = data.endDate ? new Date(data.endDate) : null;
    const actualStartObj = data.actualStartDate
      ? new Date(data.actualStartDate)
      : null;
    const actualEndObj = data.actualEndDate
      ? new Date(data.actualEndDate)
      : null;

    const fyStart = actualFinDuartion?.startDate
      ? new Date(actualFinDuartion.startDate.split("/").reverse().join("-"))
      : null;

    if (!selected) return "";

    switch (fieldName) {
      case "aaOrderDate":
        if (finYear && fyStart && selected < fyStart)
          error = "AA order date can't be before the financial year selected";
        else if (actualStartObj && selected > actualStartObj)
          error = "AA order date can't be after the Actual Start Date";
        else if (startDateObj && selected > startDateObj)
          error = "AA order date can't be after the Start Date";
        break;

      case "startDate":
        if (aaDate && selected < aaDate)
          error = "Start Date cannot be before AA Order Date";
        else if (actualStartObj && selected > actualStartObj)
          error = "Start Date cannot be after Actual Start Date";
        else if (endDateObj && selected > endDateObj)
          error = "Start Date cannot be after End Date";
        break;

      case "endDate":
        if (startDateObj && selected < startDateObj)
          error = "End Date cannot be before Start Date";
        else if (actualEndObj && selected > actualEndObj)
          error = "End Date cannot be after Actual End Date";
        break;

      case "actualStartDate":
        if (startDateObj && selected < startDateObj)
          error = "Actual Start Date cannot be before Start Date";
        break;

      case "actualEndDate":
        if (actualStartObj && selected < actualStartObj)
          error = "Actual End Date cannot be before Actual Start Date";
        else if (endDateObj && selected < endDateObj)
          error = "Actual End Date cannot be before End Date";
        break;

      default:
        break;
    }

    return error;
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    let updatedVal = value;
    if (name === "proposedByName") {
      updatedVal = avoidSpecialCharUtil(value);
    }

    if (name === "estimatedBudget") {
      updatedVal = removeCommas(value).replace(/\D/g, "");
    }

    const updatedFormData = {
      ...formData,
      [name]: sanitizeInputUtil(updatedVal),
    };

    // validate current field
    const currentError = validateField(name, updatedVal, updatedFormData);

    const dependencies = {
      aaOrderDate: ["startDate"],
      startDate: ["aaOrderDate", "endDate", "actualStartDate"],
      endDate: ["startDate", "actualEndDate"],
      actualStartDate: ["startDate", "actualEndDate"],
      actualEndDate: ["endDate"],
    };

    const newErrors = { ...errors, [name]: currentError };

    (dependencies[name] || []).forEach((dep) => {
      newErrors[dep] = validateField(dep, updatedFormData[dep], updatedFormData);
    });

    setFormData(updatedFormData);
    setErrors(newErrors);
  };

  const generateCode = async () => {
    try {
      const payload = encryptPayload({ projectName: projectName });
      const res = await generateProjectCodeService(payload);

      setFormData((prev) => ({
        ...prev,
        projectCode: res?.data?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (projectName.length === 4) {
      generateCode();
    }
    if (projectName < 4 || projectName > 4) {
      setFormData((prev) => ({
        ...prev,
        projectCode: "",
      }));
    }
  }, [projectName]);

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const [errors, setErrors] = useState({});

  const [openSubmit, setOpenSubmit] = useState(false);

  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};

    console.log("hello");

    // Financial Year validation
    if (!finYear) {
      newErrors.finYear = "Financial Year is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    // Project Name validation
    if (!projectName || !projectName.trim()) {
      newErrors.projectName = "Project name is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    // AA Order Number validation
    if (!aaOrderNo || !aaOrderNo.trim()) {
      newErrors.aaOrderNo = "AA order number is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    // AA Order Date validation
    if (!aaOrderDate || !aaOrderDate.trim()) {
      newErrors.aaOrderDate = "AA order date is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    // District validation
    if (!districtId) {
      newErrors.districtId = "District name is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    // Area Type validation
    if (!areaType) {
      newErrors.areaType = "Area type is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    // Object/Village/Ward validation
    if (areaType) {
      if (!objectId) {
        const fieldName = areaType === "BLOCK" ? "Village" : "Ward";
        newErrors.objectId = `Please select a ${fieldName}`;
        setExpanded("panel1");
        setErrors(newErrors);
        return;
      }
    }

    // Sector validation
    if (!sectorId) {
      newErrors.sectorId = "Kindly select Sector";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    // Start Date validation
    if (!startDate) {
      newErrors.startDate = "Kindly choose start date";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    // End Date validation
    if (!endDate) {
      newErrors.endDate = "Kindly choose end date";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    // Estimated Budget validation
    if (!estimatedBudget) {
      newErrors.estimatedBudget = "Kindly fill estimated project cost";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    if (Object.keys(errors).length === 0) {
      setOpenSubmit(true);
    } else {
      setOpenSubmit(false);
    }
  };

  const [pendingAction, setPendingAction] = useState(null);

  const handleRemarksSubmit = () => {
    if (!remarks || !remarks.trim()) {
      toast.error("Remarks are mandatory");
      return;
    }

    setForwardedId(pendingAction?.forwardedId);
    const id = pendingAction?.forwardedId;

    setRejectionModal(false);
    setPendingAction(null);

    handleSubmit(id);
  };

  const navigate = useNavigate();
  // console.log(errors);

  const handleSubmit = async (passedForwardedId = null) => {


    const cleanedFundReleaseRows = fundReleaseRows.map(row => ({
      fundReleaseInfoId: row.fundReleaseInfoId || null,
      headId: row.headId || "",
      subHeadId: row.subHeadId || "",
      bankId: row.bankId || "",
      modeOfTransfer: row.modeOfTransfer || "",
      favourOf: row.favourOf || "",
      releaseAmount: row.releaseAmount || "0",
      giaYear: row.giaYear || "",
      giaTypeId: row.giaTypeId || "",
      bankAccConfigId: row.bankAccConfigId || "",
      remarks: row.remarks || "",
      fundAllocDate: row.fundAllocDate || "",
    }));

    const sendData = {
      forwardedId: passedForwardedId ?? forwardedId,
      projectId: projectId || null,
      finYear: finYear || "",
      projectName: projectName || "",
      projectCode: projectCode || "",
      aaOrderNo: aaOrderNo || "",
      aaOrderDate: formatDateToDDMMYYYY(aaOrderDate) || "",
      areaType: areaType || "",
      constituencyId: constituencyId || "",
      proposedBy: proposedBy || null,
      proposedByName: proposedByName || "",
      objectType: areaType === "BLOCK" ? "VILLAGE" : "WARD",
      objectId: objectId || "",
      sector: sectorId || "",
      subSector: Number(subSector) || 0,
      actualStartDate: formatDateToDDMMYYYY(actualStartDate) || "",
      actualEndDate: formatDateToDDMMYYYY(actualEndDate) || "",
      startDate: formatDateToDDMMYYYY(startDate) || "",
      endDate: formatDateToDDMMYYYY(endDate) || "",
      estimatedBudget: estimatedBudget || "0",
      fundAllocDate: fundAllocDate || "",
      approvedAmount: totalAmount || 0,
      fundReleaseInfo: cleanedFundReleaseRows,
      remarks: remarks || "",
    };
    if (Object.keys(errors).length === 0) {
      try {
        const payload = encryptPayload(sendData);

        const res = await saveProjectService(payload);

        if (res?.status === 200 && res?.data.outcome) {
          setOpenSubmit(false);
          toast.success(res?.data.message);
          navigate("/project-list");

          // Reset form
          setFormData({
            districtId: "",
            blockId: "",
            gpId: "",
            municipalityId: "",
            projectId: null,
            finYear: "",
            projectName: "",
            projectCode: "",
            aaOrderNo: "",
            aaOrderDate: "",
            areaType: "BLOCK",
            constituencyId: "",
            districtProposed: "",
            proposeByDist: "",
            proposeByBlock: "",
            proposedBy: "",
            proposedByName: "",
            sectorId: "",
            sector: "",
            subSector: "",
            judictionType: "",
            constituencyTypeCode: "",
            startDate: "",
            endDate: "",
            actualStartDate: "",
            actualEndDate: "",
            fundAllocDate: null,
            projectStatus: "",
            estimatedBudget: "",
            objectType: "",
            objectId: "",
            approvedAmount: "",
            remarks: ""
          });

          setFundReleaseRows([
            {
              fundReleaseInfoId: null,
              headId: "",
              subHeadId: "",
              bankId: "",
              modeOfTransfer: "",
              releaseAmount: "",
              giaYear: "",
              giaTypeId: "",
              bankAccConfigId: "",
              remarks: "",
              fundAllocDate: "",
            },
          ]);
          setSubHeadOpts({});
        }
      } catch (error) {
        console.error(error);
        setOpenSubmit(false)
      }
    }
    else{
      setOpenSubmit(false)
    }

  };

  const toYMD = (d) => {
    if (!d) return "";
    const [dd, mm, yyyy] = d.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [showRejectionModal, setRejectionModal] = useState(false)

  const mapProjectResponseToForm = (data) => {
    setForwardedId(data?.forwardedId)
    setStageForwardedRuleStatus(data?.stageForwardedRuleStatus)
    return {
      districtId: data?.districtId || "",
      blockId: data?.blockId || "",
      gpId: data?.gpId || "",
      municipalityId: data?.municipalityId || "",
      projectId: data?.projectId || "",
      finYear: data?.finYear || "",
      projectName: data?.projectName || "",
      projectCode: data?.projectCode || "",
      aaOrderNo: data?.aaOrderNo || "",
      aaOrderDate: toYMD(data?.aaOrderDate),
      areaType: data?.areaType || "BLOCK",
      constituencyId: data?.constituencyId || "",
      proposeByDist: data?.proposed?.districtId || "",
      proposeByBlock: data?.proposed?.blockId || "",
      proposedBy: data?.proposed?.proposalId || "",
      proposedByName: data?.proposedByName || "",
      sectorId: data?.sector || "",
      sector: data?.sector || "",
      subSector: data?.subSector || "",
      startDate: toYMD(data?.startDate),
      endDate: toYMD(data?.endDate),
      actualEndDate: toYMD(data?.actualEndDate),
      actualStartDate: toYMD(data?.actualStartDate),
      fundAllocDate: data?.fundAllocDate || "",
      estimatedBudget: data?.estimatedBudget || "",
      approvedAmount: data?.approvedAmount || "",
      objectType: data?.objectType || "",
      objectId: data?.objectId || "",
    };
  };

  const isFieldEditable = () => {
    if (!stageForwardedRuleStatus) return true;
    return stageForwardedRuleStatus === "DRAFT" || stageForwardedRuleStatus === "REVERTED";
  };

  const mapFundReleaseRows = (rows) => {
    return rows.map((row) => ({
      ...row,
      headId: row.headId || "",
      subHeadId: row.subHeadId || "",
      maxamount: 0,
      remainingAmount: 0,
      releaseAmount: row.releaseAmount || "",
    }));
  };

  const [totalBudgetSum, setTotalBudgetSum] = useState("");

  const getTotalBudget = async () => {
    try {
      const res = await totalBudgetService();
      setTotalBudgetSum(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getFinancialYearOptions();
    getAllDistOpts();
    getAllSectors();
    getGIATypeOpts();
    getTotalBudget();
    getFavourandModeOpts();
    getAllHeads();
  }, []);

  useEffect(() => {
    if (proposeByDist) {
      getProposedByBlock()
    }
  }, [proposeByDist])

  useEffect(() => {
    if (proposeByBlock) {
      getMLAMP()
    }
  }, [proposeByBlock])

  useEffect(() => {
    if (finYear) {
      finYearOpts?.map((i) => {
        if (i.finyearId == finYear) {
          setActualFinDuartion(i)
        }
      })
    }
  }, [finYear])

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProject());
    };
  }, [dispatch]);

  useEffect(() => {
    if (districtId) {
      getAllBlockOpts();
    }
    if (blockId) {
      getAllGPoptions();
      getConsOpts();
    }
    if (municipalityId) {
      getAllWardOptions();
    }
    if (sectorId) {
      getSubSectorOpts();
    }
  }, [districtId, blockId, municipalityId, proposeByDist, sectorId]);

  useEffect(() => {
    if (districtId) {
      getAllMunicipalityList();
    }
  }, [districtId, areaType])

  useEffect(() => {
    if (gpId) {
      getVillageList();
    }
  }, [gpId])

  useEffect(() => {
    if (stateSelect) {
      setFormData(mapProjectResponseToForm(stateSelect));
      setFundReleaseRows(mapFundReleaseRows(stateSelect?.fundReleaseInfo || []));

      if (stateSelect?.fundReleaseInfo?.length > 0) {
        loadExistingSubHeads();
      }
    }
  }, [stateSelect]);

  useEffect(() => {
    const total = fundReleaseRows.reduce(
      (sum, row) => sum + (parseFloat(row.releaseAmount) || 0),
      0
    );
    setTotalAmount(total);
  }, [fundReleaseRows]);

  useEffect(() => {
    if (!stateSelect?.fundReleaseInfo?.length) return;

    setFundReleaseRows(mapFundReleaseRows(stateSelect?.fundReleaseInfo || []));

    stateSelect.fundReleaseInfo.forEach(async (row, index) => {
      if (row.giaYear && row.giaTypeId) {
        await getUpdatedFuncDetails(row.giaYear, row.giaTypeId, index);
      }

      if (row.giaYear && row.giaTypeId && row.bankId) {
        const payload = encryptPayload({
          finyearId: row.giaYear,
          giaTypeId: row.giaTypeId,
          bankId: row.bankId,
        });

        const res = await getBankConfigProjectService(payload);

        if (res?.status === 200 && res?.data?.outcome) {
          setConfigOpts((prev) => ({
            ...prev,
            [index]: res.data.data,
          }));
        }
      }

      if (row.giaYear && row.giaTypeId && row.bankId && row.bankAccConfigId) {
        const payload = encryptPayload({
          fundReleaseInfoId: row.fundReleaseInfoId,
          finyearId: row.giaYear,
          giaTypeId: row.giaTypeId,
          bankId: row.bankId,
          bankAccConfigId: row.bankAccConfigId,
        });

        const res = await maxBudgetService(payload);

        if (res?.status === 200 && res?.data?.outcome) {
          const maxamount = res.data.data.totalBudget || 0;
          const currentRelease = Number(row.releaseAmount || 0);

          setFundReleaseRows((prev) => {
            const rows = [...prev];
            rows[index] = {
              ...rows[index],
              maxamount: maxamount,
              remainingAmount: Math.max(maxamount - currentRelease, 0),
              fundAllocDate: res.data.data.fundAllocDate || "",
            };
            return rows;
          });
        }
      }
    });
  }, [stateSelect]);

  useEffect(() => {
    getWorkFlow()
  }, [forwardedId])

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmitConfirmModal}>
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
              Project Details
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <div className="p-3">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 flex flex-wrap gap-6">
                  {constituencyOpts?.map((i, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 text-[12px] w-fit text-amber-600 rounded-sm cursor-pointer"
                    >
                      <span className=" text-white bg-amber-600 rounded-full p-1"><GiSevenPointedStar /></span>
                      <span>{`${i.judictionRoleCode} - ${i.constituencyName}`}</span>
                    </div>
                  ))}
                </div>

                <div className="col-span-2">
                  <SelectField
                    label="Financial Year"
                    required={true}
                    name="finYear"
                    value={finYear}
                    onChange={handleChangeInput}
                    options={finYearOpts?.map((d) => ({
                      value: d.finyearId,
                      label: d.finYear,
                    }))}
                    error={errors.finYear}
                    placeholder="Select "
                    disabled={!isFieldEditable()}
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label="Project Name"
                    required={true}
                    name="projectName"
                    placeholder="Enter project name"
                    onChange={handleChangeInput}
                    value={projectName}
                    maxLength={50}
                    minLength={4}
                    readOnly={!isFieldEditable()}
                    error={errors.projectName}
                  />
                </div>
                <div className="col-span-2 ">
                  <InputField
                    label="Project Code"
                    required={true}
                    name="projectCode"
                    placeholder="Project code"
                    value={projectCode}
                    disabled={true}
                    onChange={handleChangeInput}
                    maxLength={50}
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label="AA Order Number"
                    required={true}
                    name="aaOrderNo"
                    maxLength={50}
                    placeholder="Enter AA order number"
                    value={aaOrderNo}
                    onChange={handleChangeInput}
                    readOnly={!isFieldEditable()}
                    error={errors.aaOrderNo}
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label="AA Order Date"
                    required={true}
                    type="date"
                    name="aaOrderDate"
                    placeholder="Enter AA order date"
                    value={aaOrderDate}
                    onChange={handleChangeInput}
                    readOnly={!isFieldEditable()}
                    error={errors.aaOrderDate}
                  />
                </div>
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
                    disabled={!isFieldEditable()}
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
                        checked={formData.areaType === "BLOCK"}
                        id="radio1"
                        onChange={handleChangeInput}
                        disabled={!isFieldEditable()}
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
                        checked={formData.areaType === "MUNICIPALITY"}
                        id="radio2"
                        onChange={handleChangeInput}
                        disabled={!isFieldEditable()}
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
                        onChange={handleChangeInput}
                        options={blockOpts?.map((d) => ({
                          value: d.blockId,
                          label: d.blockNameEN,
                        }))}
                        disabled={!districtId || !isFieldEditable()}
                        placeholder="Select "
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
                        disabled={!blockId || !isFieldEditable()}
                        placeholder="Select "
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
                        disabled={!gpId || !isFieldEditable()}
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
                        disabled={!districtId || !isFieldEditable()}
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
                        disabled={!municipalityId || !isFieldEditable()}
                        error={errors.objectId}
                        placeholder="Select "
                      />
                    </div>
                  </>
                )}

                <div className="col-span-2">
                  <SelectField
                    label="Sector"
                    required={true}
                    name="sectorId"
                    value={sectorId}
                    onChange={handleChangeInput}
                    options={sectorOpts?.map((d) => ({
                      value: d.sectorId,
                      label: d.sectorName,
                    }))}
                    error={errors.sectorId}
                    disabled={!isFieldEditable()}
                    placeholder="Select "
                  />
                </div>
                <div className="col-span-2">
                  <SelectField
                    label="Sub-Sector"
                    name="subSector"
                    value={subSector}
                    onChange={handleChangeInput}
                    options={subSectorOptions?.map((d) => ({
                      value: d.subSectorId,
                      label: d.subSectorName,
                    }))}
                    disabled={!sectorId || !isFieldEditable()}
                    placeholder="Select "
                  />
                </div>

                <div className="col-span-2">
                  <InputField
                    label="Start Date"
                    type="date"
                    required={true}
                    name="startDate"
                    value={startDate}
                    onChange={handleChangeInput}
                    error={errors.startDate}
                    disabled={!isFieldEditable()}
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label="End Date"
                    type="date"
                    required={true}
                    name="endDate"
                    value={endDate}
                    min={startDate || ""}
                    onChange={handleChangeInput}
                    error={errors.endDate}
                    disabled={!isFieldEditable()}
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label="Actual Start Date"
                    type="date"
                    name="actualStartDate"
                    value={actualStartDate}
                    onChange={handleChangeInput}
                    error={errors.actualStartDate}
                    disabled={!isFieldEditable()}
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label="Actual End Date"
                    type="date"
                    name="actualEndDate"
                    value={actualEndDate}
                    min={actualStartDate || ""}
                    onChange={handleChangeInput}
                    error={errors.actualEndDate}
                    disabled={!isFieldEditable()}
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label="Estimated Project Cost"
                    required={true}
                    amount={true}
                    name="estimatedBudget"
                    placeholder="Enter estimated budget"
                    value={formatWithCommas(estimatedBudget)}
                    onChange={handleChangeInput}
                    error={errors.estimatedBudget}
                    disabled={!isFieldEditable()}
                  />
                </div>

                <div className="col-span-12">
                  <div className="bg-slate-100 border-l-4 border-slate-600 px-4 py-2">
                    <h5 className="text-sm font-semibold text-slate-700">
                      Proposed By Details
                    </h5>
                  </div>
                </div>

                <div className="col-span-2">
                  <SelectField
                    label="District"
                    name="proposeByDist"
                    value={proposeByDist}
                    onChange={handleChangeInput}
                    options={distListOpts?.map((d) => ({
                      value: d.districtId,
                      label: d.districtName,
                    }))}
                    placeholder="Select "
                    disabled={!isFieldEditable()}
                  />
                </div>
                <div className="col-span-2">
                  <SelectField
                    label="Block Name"
                    name="proposeByBlock"
                    value={proposeByBlock}
                    onChange={handleChangeInput}
                    options={propsByBlock?.map((d) => ({
                      value: d.blockId,
                      label: d.blockNameEN,
                    }))}
                    placeholder="Select "
                    disabled={!proposeByDist || !isFieldEditable()}
                  />
                </div>

                <div className="col-span-2">
                  <SelectField
                    label="Proposed by"
                    name="proposedBy"
                    value={proposedBy}
                    disabled={!proposeByBlock || !isFieldEditable()}
                    onChange={handleChangeInput}
                    options={juridictionOpts?.map((d) => ({
                      value: d.judictionConfigMapId,
                      label: `${d.judictionRoleCode} - ${d.constituencyName}`,
                    }))}
                    placeholder="Select "
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label="Proposed by Name"
                    name="proposedByName"
                    placeholder="Enter propose by name"
                    value={proposedByName}
                    onChange={handleChangeInput}
                    disabled={!isFieldEditable()}
                    maxLength={50}
                  />
                </div>
                <div className="col-span-2">
                  <button
                    type="button"
                    className="px-5 py-1 text-sm bg-green-200 text-green-800 rounded-sm mt-6"
                    onClick={() => setExpanded("panel3")}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
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
              Fund Release Information
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <div className="p-3">
              <div className="flex justify-end items-start mt-5">
                <div className=" flex items-center gap-3">
                  <h1 className="font-semibold text-slate-500">
                    Total Budget :{" "}
                    <span className="font-normal text-sm text-blue-800 rounded-sm px-3 py-1 bg-blue-500/25 ">
                      ₹{" "}
                      {Number(totalBudgetSum).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </h1>
                  <h1 className="font-semibold text-slate-500">
                    Released Amount :{" "}
                    <span className="font-normal text-sm text-green-800 rounded-sm px-3 py-1 bg-green-500/25 ">
                      ₹{" "}
                      {Number(totalAmount).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </h1>
                </div>
              </div>
              {fundReleaseRows.map((i, index) => {
                return (
                  <div
                    className="grid grid-cols-12 gap-6 p-3 rounded-sm mt-10 border border-orange-200 bg-[#fffcfc] relative"
                    key={index}
                  >
                    {fundReleaseRows.length > 1 && (
                      <span
                        className="absolute text-xl p-2 text-red-500 flex justify-center items-center rounded-full"
                        style={{ top: "-17px", right: "-14px" }}
                        onClick={() => handleRemoveRow(index)}
                      >
                        <FaMinusCircle />
                      </span>
                    )}

                    {/* Head Field */}
                    <div className="col-span-2">
                      <SelectField
                        label="Head"
                        name="headId"
                        required={true}
                        value={i.headId}
                        onChange={(e) => handleRowChange(e, index)}
                        options={headOpts?.map((d) => ({
                          value: d.headId,
                          label: d.headName,
                        }))}
                        disabled={!isFieldEditable()}
                        placeholder="Select Head"
                      />
                    </div>

                    {/* Subhead Field - Updated to use row-specific options */}
                    <div className="col-span-2">
                      <SelectField
                        label="Subhead"
                        name="subHeadId"
                        required={true}
                        value={i.subHeadId}
                        onChange={(e) => handleRowChange(e, index)}
                        options={
                          (subHeadOpts[index] || []).map((d) => ({
                            value: d.subHeadId,
                            label: d.subHeadName,
                          }))
                        }
                        disabled={!i.headId || !isFieldEditable()}
                        placeholder="Select Subhead"
                      />
                    </div>

                    <div className="col-span-2">
                      <SelectField
                        label="GIA Year "
                        name="giaYear"
                        required={true}
                        value={i.giaYear}
                        onChange={(e) => handleRowChange(e, index)}
                        options={finYearOpts?.map((d) => ({
                          value: d.finyearId,
                          label: d.finYear,
                        }))}
                        disabled={!isFieldEditable()}
                        placeholder="All "
                      />
                    </div>

                    <div className="col-span-2">
                      <SelectField
                        label="GIA Type "
                        name="giaTypeId"
                        required={true}
                        value={i.giaTypeId}
                        onChange={(e) => handleRowChange(e, index)}
                        options={giaOpts?.map((d) => ({
                          value: d.giaTypeId,
                          label: d.giaTypeName,
                        }))}
                        disabled={!isFieldEditable()}
                        placeholder="Select "
                      />
                    </div>
                    <div className="col-span-4">
                      <SelectField
                        label="Bank Name"
                        name="bankId"
                        required={true}
                        value={fundReleaseRows[index]?.bankId || ""}
                        onChange={(e) => handleRowChange(e, index)}
                        options={
                          bankListOpts[index]?.map((d) => ({
                            value: d.bankId,
                            label: d.bankName,
                          })) || []
                        }
                        disabled={!isFieldEditable()}
                        placeholder="Select"
                      />
                    </div>
                    <div className="col-span-3">
                      <SelectField
                        label="Branch | Account Number | IFSC"
                        name="bankAccConfigId"
                        value={fundReleaseRows[index]?.bankAccConfigId || ""}
                        onChange={(e) => handleRowChange(e, index)}
                        placeholder="Select"
                        options={
                          configOpts[index]?.map((i) => ({
                            value: i.bankAccConfigId,
                            label: `${i.branch} | ${i.accNo} | ${i.ifsc}`,
                          })) || []
                        }
                        disabled={!isFieldEditable()}
                      />
                    </div>
                    <div className="col-span-2">
                      <SelectField
                        label="Mode of transfer"
                        name="modeOfTransfer"
                        required={true}
                        value={i.modeOfTransfer}
                        onChange={(e) => handleRowChange(e, index)}
                        options={modeOfTransferList?.map((d) => ({
                          value: d.lookupValueCode,
                          label: d.lookupValueEn,
                        }))}
                        disabled={!isFieldEditable()}
                        placeholder="Select "
                      />
                    </div>

                    <div className="col-span-2">
                      <InputField
                        amount={true}
                        label="Release Amount"
                        required={true}
                        name="releaseAmount"
                        value={formatWithCommas(i.releaseAmount)}
                        disabled={!isFieldEditable()}
                        onChange={(e) => handleRowChange(e, index)}
                        error={i.releaseAmount > i.maxamount ? `Release Amount cant be more than ₹ ${i.maxamount?.toLocaleString("en-IN")}` : ''}
                      />
                    </div>
                    <div className="col-span-4">
                      <InputField
                        label="Description"
                        textarea={true}
                        name="remarks"
                        maxLength={255}
                        value={i.remarks}
                        disabled={!isFieldEditable()}
                        onChange={(e) => handleRowChange(e, index)}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-end mt-3">
                <button
                  className="p-1 rounded-sm text-white bg-green-600 text-md"
                  type="button"
                  onClick={handleAddRow}
                  title="Add Fund Release Informations"
                >
                  <IoMdAddCircle />
                </button>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
                <ResetBackBtn />
                {button?.map((i, index) => {
                  return (
                    <button
                      type={'button'}
                      key={index}
                      className={i?.actionType.color}
                      onClick={() => {
                        if (
                          i?.actionType.actionCode === "REVERTED" ||
                          i?.actionType.actionCode === "REJECTED"
                        ) {
                          setPendingAction(i);
                          setRejectionModal(true);
                        } else {
                          setForwardedId(i.forwardedId);
                          setOpenSubmit(true);
                        }
                      }}
                    >
                      <GrSave /> {i?.actionType.actionNameEn}
                    </button>
                  )
                })}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </form>

      <ReusableDialog
        open={openSubmit}
        description="Are you sure you want to submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={() => handleSubmit()}
      />

      <CommonFormModal
        open={showRejectionModal}
        onClose={() => setRejectionModal(false)}
        title="Add Remarks"
        subtitle="Remarks are mandatory for this action"
        footer={
          <>
            <button
              type="button"
              className="bg-green-500 text-white text-[13px] px-3 py-1 rounded-sm border border-green-600 transition-all active:scale-95 uppercase flex items-center gap-1"
              onClick={handleRemarksSubmit}
            >
              Submit
            </button>
          </>
        }
      >
        <InputField
          label="Remarks"
          type="text"
          name="remarks"
          value={remarks}
          textarea={true}
          onChange={handleChangeInput}
        />
      </CommonFormModal>
    </div>
  );
};

export default Project;