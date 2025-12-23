import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import { useEffect } from "react";
import SelectField from "../../components/common/SelectField";
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
  getConsThroughDistService,
  // getFavourANDmodeOfTransferService,
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
import { getMunicipalityViaDistrictsService } from "../../services/wardService";
import { getGIAtypeList } from "../../services/giaService";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedProject } from "../../redux/slices/projectSlice";
import { RiAiGenerate } from "react-icons/ri";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import ReusableDialog from "../../components/common/ReusableDialog";
import { avoidSpecialCharUtil } from "../../utils/validationUtils";

const Project = () => {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const stateSelect = useSelector((state) => state.project.selectedProject);
  // console.log(stateSelect);

  // FORM HANDLING 

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
    proposedBy: "",
    proposedByName: "",
    sectorId: "",
    sector: "",
    subSector: "",
    startDate: "",
    endDate: "",
    fundAllocDate: null,

    projectStatus: "",
    estimatedBudget: "",

    objectType: "",
    objectId: "",

    // fundReleaseTo: "DISTRICT",
    approvedAmount: "",
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
    startDate,
    endDate,
    actualStartDate,
    actualEndDate,
    fundAllocDate,

    proposeByDist,
    objectId,
    fundReleaseTo,
    estimatedBudget,
    approvedAmount,
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
  const [proposedByDesignationOpts, setProposedByDesignationOpts] = useState(
    []
  );
  const [sectorOpts, setSectorOpts] = useState([]);
  const [subSectorOptions, setSubSectorOpts] = useState([]);
  // const [bankListOpts, setbankListOpts] = useState([]);
  const [giaOpts, setGIAoptions] = useState([]);

  // --------------------------------------------------------------------------

  const load = async (serviceFn, payload, setter) => {
    try {
      const res = await serviceFn(encryptPayload(payload));
      setter(res?.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

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

  const getConstOpts = () =>
    load(
      getConsThroughDistService,
      { isActive: true, districtId },
      setConstituencyOpts
    );

  const getProposedByOptions = () =>
    load(
      getProposalByDistService,
      { isActive: true, districtId: proposeByDist },
      setProposedByDesignationOpts
    );
  const getAllSectors = () =>
    load(getSectorService, { isActive: true }, setSectorOpts);

  const getSubSectorOpts = () =>
    load(getSubsectorService, { isActive: true, sectorId }, setSubSectorOpts);

  // const getBankList = () =>
  //   load(getBankNamesService, { isActive: true }, setbankListOpts);

  const getGIATypeOpts = () =>
    load(getGIAtypeList, { isActive: true }, setGIAoptions);

  // const [favourList, setFavourList] = useState([]);
  const [modeOfTransferList, setModeOfTransferList] = useState([]);
  const getFavourandModeOpts = async () => {
    try {
      const payload = encryptPayload({ isActive: true });
      const res = await projectAlllookUpValueService(payload);
      // console.log(res?.data.data);
      // setFavourList(res?.data.data.favourUpList);
      setModeOfTransferList(res?.data.data.modeOfTransfer);
    } catch (error) {
      throw error;
    }
  };

  const [fundReleaseRows, setFundReleaseRows] = useState([
    {
      fundReleaseInfoId: null,
      bankId: "",
      modeOfTransfer: "",
      favourOf: "",
      releaseAmount: "",
      giaYear: "",
      giaTypeId: "",
      bankAccConfigId: "",
      // sanctionOrderNo: "",
      // sanctionOrderDate: "",
      // releaseLetterNo: "",
      // releaseLetterDate: "",
      remarks: "",
      fundAllocDate: "",
    },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const handleAddRow = () => {
    const allFilled = fundReleaseRows.every(
      (item) =>
        item.bankId &&
        item.modeOfTransfer &&
        // item.favourOf &&
        item.releaseAmount &&
        item.giaYear &&
        item.giaTypeId &&
        item.bankAccConfigId
      // item.sanctionOrderNo &&
      // item.sanctionOrderDate &&
      // item.releaseLetterNo &&
      // item.releaseLetterDate
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
          bankId: "",
          modeOfTransfer: "",
          favourOf: "",
          releaseAmount: "",
          giaYear: "",
          giaTypeId: "",
          bankAccConfigId: "",
          // sanctionOrderNo: "",
          // sanctionOrderDate: "",
          // releaseLetterNo: "",
          // releaseLetterDate: "",
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

  const [rowBudgets, setRowBudgets] = useState({});

  const handleRemoveRow = (index) => {
    setFundReleaseRows((prev) => prev.filter((_, i) => i !== index));
  };

  const getUsedAmount = (year, type, excludeIndex) => {
    return fundReleaseRows.reduce((sum, row, idx) => {
      if (
        idx !== excludeIndex &&
        row.giaYear == year &&
        row.giaTypeId == type
      ) {
        return sum + (Number(row.releaseAmount) || 0);
      }
      return sum;
    }, 0);
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
      return null; // optional but good practice
    }
  };

  // const [configOpts, setConfigOpts] = useState([]);
  const [configOpts, setConfigOpts] = useState({});

  const handleRowChange = async (e, index) => {
    const { name, value } = e.target;

    setFundReleaseRows((prev) => {
      const rows = [...prev];
      let row = { ...rows[index], [name]: value };

      const updatedYear = name === "giaYear" ? value : row.giaYear;
      const updatedType = name === "giaTypeId" ? value : row.giaTypeId;
      const updatedBankName = name === "bankId" ? value : row.bankId;
      const updatedBankConfig =
        name === "bankAccConfigId" ? value : row.bankAccConfigId;

      // ---------------- Duplicate check ----------------
      if (updatedYear && updatedType && updatedBankName) {
        if (
          isDuplicateCombination(
            updatedYear,
            updatedType,
            updatedBankName,
            updatedBankConfig,
            index
          )
        ) {
          toast.error("This combination already selected!");
          row[name] = "";
          rows[index] = row;
          return rows;
        }
      }

      // ---------------- GIA change logic ----------------
      if (name === "giaYear" || name === "giaTypeId") {
        row.bankId = "";
        row.bankAccConfigId = "";
        row.releaseAmount = "";
        row.maxamount = "";
        row.fundAllocDate = "";
      }

      // ---------------- Bank change logic ----------------
      if (name === "bankId") {
        row.bankAccConfigId = "";
        row.releaseAmount = "";
        row.maxamount = "";
      }

      // ---------------- Release Amount validation ----------------
      if (name === "releaseAmount") {
        if (value === "") {
          row.releaseAmount = "";
          rows[index] = row;
          return rows;
        }

        if (!/^\d+$/.test(value)) return rows;

        const entered = Number(value);
        const max = Number(row.maxamount);

        if (entered < 0) return rows;

        if (row.maxamount && entered > max) {
          toast.error("Release amount cannot exceed the maximum amount!");
          return rows;
        }

        row.releaseAmount = value;
      }

      rows[index] = row;
      return rows;
    });

    // ---------------- API CALLS (SIDE EFFECTS) ----------------

    const row = fundReleaseRows[index];

    const updatedYear = name === "giaYear" ? value : row.giaYear;
    const updatedType = name === "giaTypeId" ? value : row.giaTypeId;
    const updatedBankName = name === "bankId" ? value : row.bankId;
    const updatedBankConfig =
      name === "bankAccConfigId" ? value : row.bankAccConfigId;

    // 🔹 Load banks when GIA changes
    if (
      (name === "giaYear" || name === "giaTypeId") &&
      updatedYear &&
      updatedType
    ) {
      await getUpdatedFuncDetails(updatedYear, updatedType, index);
    }

    // 🔹 Load bank configs when bank changes
    if (name === "bankId" && updatedBankName) {
      const payload = encryptPayload({
        finyearId: updatedYear,
        giaTypeId: updatedType,
        bankId: updatedBankName,
      });

      const res = await getBankConfigProjectService(payload);

      if (res?.status === 200 && res?.data?.outcome) {
        setConfigOpts((prev) => ({
          ...prev,
          [index]: res.data.data,
        }));
      }
    }

    // 🔹 Load MAX BUDGET when all selected
    if (updatedYear && updatedType && updatedBankName && updatedBankConfig) {
      try {
        const payload = encryptPayload({
          finyearId: updatedYear,
          giaTypeId: updatedType,
          bankId: updatedBankName,
          bankAccConfigId: updatedBankConfig,
        });

        const res = await maxBudgetService(payload);

        if (res?.status === 200 && res?.data?.outcome) {
          setFundReleaseRows((prev) => {
            const rows = [...prev];
            rows[index] = {
              ...rows[index],
              maxamount: res.data.data.totalBudget || 0,
              fundAllocDate: res.data.data.fundAllocDate || "",
            };
            return rows;
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    let updatedVal = value
    if (name === "proposedByName") {
      updatedVal = avoidSpecialCharUtil(value)
    }

    // --- Date Validations ---
    if (name === "endDate" && formData.startDate) {
      if (new Date(value) < new Date(formData.startDate)) {
        setErrors((prev) => ({
          ...prev,
          endDate: "End Date cannot be before Start Date",
        }));
        return;
      }
    }
    if (name === "actualStartDate" && formData.startDate) {
      if (new Date(value) < new Date(formData.startDate)) {
        setErrors((prev) => ({
          ...prev,
          actualStartDate: "Actual Start Date cannot be before Start Date",
        }));
        return;
      }
    }
    if (name === "actualEndDate" && formData.actualStartDate) {
      if (new Date(value) < new Date(formData.actualStartDate)) {
        setErrors((prev) => ({
          ...prev,
          actualEndDate: "Actual End Date cannot be before Actual Start Date",
        }));
        return;
      }
    }

    // normal update
    setFormData((prev) => ({ ...prev, [name]: updatedVal }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const generateCode = async () => {
    try {
      const payload = encryptPayload({ projectName: projectName });
      const res = await generateProjectCodeService(payload);
      // console.log(res);

      setFormData((prev) => ({
        ...prev,
        projectCode: res?.data?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (projectName.length >= 4) {
      generateCode();
    }
    if (projectName < 4) {
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

  const finalFundReleaseRows = fundReleaseRows.map((row) => ({
    ...row,
    sanctionOrderDate: formatDateToDDMMYYYY(row.sanctionOrderDate),
    releaseLetterDate: formatDateToDDMMYYYY(row.releaseLetterDate),
  }));
  const [errors, setErrors] = useState({});

  const [openSubmit, setOpenSubmit] = useState(false);
  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!finYear) {
      newErrors.finYear = "Financial Year is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }
    if (!projectName || !projectName.trim()) {
      newErrors.projectName = "Project name is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }
    if (!aaOrderNo || !aaOrderNo.trim()) {
      newErrors.aaOrderNo = "AA order number is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }
    if (!aaOrderDate || !aaOrderDate.trim()) {
      newErrors.aaOrderDate = "AA order date is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }
    if (!districtId) {
      newErrors.districtId = "District name is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }
    if (!areaType) {
      newErrors.areaType = "Area type is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }
    if (areaType) {
      if (!objectId) {
        newErrors.objectId = "Kindly select";
        setExpanded("panel1");
        setErrors(newErrors);
        return;
      }
    }
    if (!constituencyId) {
      newErrors.constituencyId = "Kindly select constituency";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }
    if (!sectorId) {
      newErrors.sectorId = "Kindly select Sector";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }
    if (!startDate) {
      newErrors.startDate = "Kindly choose start date";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }
    if (!endDate) {
      newErrors.endDate = "Kindly choose end date";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }
    if (!estimatedBudget) {
      newErrors.estimatedBudget = "Kindly fill estimated project cost";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    if (!proposeByDist) {
      newErrors.proposeByDist = "Kindly select proposed by district";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    if (!proposedBy) {
      newErrors.proposedBy = "Proposed by designation is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    if (!proposedByName || !proposedByName.trim()) {
      newErrors.proposedByName = "Proposed by name is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    if (!sectorId) {
      newErrors.sectorId = "Sector is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
      setExpanded("panel1");
      setErrors(newErrors);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      setOpenSubmit(true);
    } else {
      setOpenSubmit(false);
    }
  };

  const handleSubmit = async (e) => {
    const sendData = {
      projectId,
      finYear,
      projectName,
      projectCode,
      aaOrderNo,
      aaOrderDate: formatDateToDDMMYYYY(aaOrderDate),
      areaType,
      constituencyId,
      proposedBy,
      proposedByName,
      objectType: areaType === "BLOCK" ? "VILLAGE" : "WARD",
      objectId: objectId,
      sector: sectorId,
      subSector: Number(subSector),
      actualStartDate: formatDateToDDMMYYYY(actualStartDate),
      actualEndDate: formatDateToDDMMYYYY(actualEndDate),
      startDate: formatDateToDDMMYYYY(startDate),
      endDate: formatDateToDDMMYYYY(endDate),
      estimatedBudget,
      fundAllocDate,

      // fundReleaseTo,
      approvedAmount: totalAmount,

      fundReleaseInfo: fundReleaseRows,
    };
    // console.log(proposedBy);

    try {
      const payload = encryptPayload(sendData);
      const res = await saveProjectService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setOpenSubmit(false);
        toast.success(res?.data.message);
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
          areaType: "",
          constituencyId: "",
          districtProposed: "",

          proposeByDist: "",
          proposedBy: "",
          proposedByName: "",
          sectorId: "",
          sector: "",
          subSector: "",
          startDate: "",
          endDate: "",
          actualStartDate: "",
          actualEndDate: "",
          fundAllocDate: null,

          projectStatus: "",
          estimatedBudget: "",

          objectType: "",
          objectId: "",

          // fundReleaseTo: "DISTRICT",
          approvedAmount: "",
        });
        setFundReleaseRows([
          {
            fundReleaseInfoId: null,
            bankId: "",
            modeOfTransfer: "",
            // favourOf: "",
            releaseAmount: "",
            giaYear: "",
            giaTypeId: "",
            bankAccConfigId: "",
            // sanctionOrderNo: "",
            // sanctionOrderDate: "",
            // releaseLetterNo: "",
            // releaseLetterDate: "",
            remarks: "",
            fundAllocDate: "",
          },
        ]);
      }
    } catch (error) {
      throw error;
    }
    // console.log(sendData);
  };

  const toYMD = (d) => {
    if (!d) return "";
    const [dd, mm, yyyy] = d.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  const mapProjectResponseToForm = (data) => {
    return {
      // LOCATION
      districtId: data?.districtId || "",
      blockId: data?.blockId || "",
      gpId: data?.gpId || "",
      municipalityId: data?.municipalityId || "",

      // PROJECT BASIC
      projectId: data?.projectId || "",
      finYear: data?.finYear || "",
      projectName: data?.projectName || "",
      aaOrderNo: data?.aaOrderNo || "",
      aaOrderDate: toYMD(data?.aaOrderDate),
      areaType: data?.areaType || "",
      constituencyId: data?.constituencyId || "",

      // PROPOSED
      proposeByDist: data?.proposed?.district?.districtId || "",
      proposedBy: data?.proposed?.proposalId || "",
      proposedByName: data?.proposedByName || "",

      // SECTOR
      sectorId: data?.sector || "",
      sector: data?.sector || "",
      subSector: data?.subSector || "",

      // DATES
      startDate: toYMD(data?.startDate),
      endDate: toYMD(data?.endDate),
      actualEndDate: toYMD(data?.actualEndDate),
      actualStartDate: toYMD(data?.actualStartDate),
      fundAllocDate: data?.fundAllocDate || "",

      // FINANCIAL
      estimatedBudget: data?.estimatedBudget || "",
      approvedAmount: data?.approvedAmount || "",

      // OBJECT (VILLAGE/WARD)
      objectType: data?.objectType || "",
      objectId: data?.objectId || "",
    };
  };

  const mapFundReleaseRows = (rows) => {
    return rows.map((row) => ({
      ...row,
    }));
  };


  const [totalBudgetSum, setTotalBudgetSum] = useState("");
  const getTotalBudget = async () => {
    try {
      const res = await totalBudgetService();
      // console.log(res);
      setTotalBudgetSum(res?.data.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getFinancialYearOptions();
    getAllDistOpts();
    getAllSectors();
    // getBankList();
    getGIATypeOpts();
    getTotalBudget();
    getFavourandModeOpts();

  }, []);
  useEffect(() => {
    if (stateSelect) {
      setFormData(mapProjectResponseToForm(stateSelect));
      setFundReleaseRows(mapFundReleaseRows(stateSelect.fundReleaseInfo || []));
    }
  }, [stateSelect])

  useEffect(() => {
    const total = fundReleaseRows.reduce(
      (sum, row) => sum + (parseFloat(row.releaseAmount) || 0),
      0
    );
    setTotalAmount(total);
  }, [fundReleaseRows]);

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearSelectedProject());
    };
  }, [dispatch]);

  useEffect(() => {
    if (districtId) {
      getAllBlockOpts();
      getAllMunicipalityList();
      getConstOpts();
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
    if (proposeByDist) {
      getProposedByOptions();
    }
    if (sectorId) {
      getSubSectorOpts();
    }
  }, [districtId, blockId, gpId, municipalityId, proposeByDist, sectorId]);

  const isDuplicateCombination = (
    year,
    type,
    bank,
    bankConfig,
    excludeIndex
  ) => {
    return fundReleaseRows.some((row, idx) => {
      if (idx === excludeIndex) return false;
      return (
        row.giaYear === year &&
        row.giaTypeId === type &&
        row.bankId == bank &&
        row.bankAccConfigId == bankConfig
      );
    });
  };



  useEffect(() => {
    if (!stateSelect?.fundReleaseInfo?.length) return;

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

      if (
        row.giaYear &&
        row.giaTypeId &&
        row.bankId &&
        row.bankAccConfigId
      ) {
        const payload = encryptPayload({
          fundReleaseInfoId: row.fundReleaseInfoId,
          finyearId: row.giaYear,
          giaTypeId: row.giaTypeId,
          bankId: row.bankId,
          bankAccConfigId: row.bankAccConfigId,
        });

        const res = await maxBudgetService(payload);

        if (res?.status === 200 && res?.data?.outcome) {
          setFundReleaseRows((prev) => {
            const rows = [...prev];
            rows[index] = {
              ...rows[index],
              maxamount: res.data.data.totalBudget || 0,
              fundAllocDate: res.data.data.fundAllocDate || "",
            };
            return rows;
          });
        }
      }
    });
  }, [stateSelect]);



  return (
    <div className="mt-3">
      {/* ---------- Accordion 1: Get District Form ---------- */}
      <form action="" onSubmit={handleSubmitConfirmModal}>
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
                  // error={errors.projectCode}
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
                        onChange={handleChangeInput}
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
                        onChange={handleChangeInput}
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
                        onChange={handleChangeInput}
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
                        onChange={handleChangeInput}
                        options={villageOpts?.map((d) => ({
                          value: d.villageId,
                          label: d.villageNameEn,
                        }))}
                        disabled={gpId ? false : true}
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
                        onChange={handleChangeInput}
                        options={wardOpts?.map((d) => ({
                          value: d.wardId,
                          label: d.wardName,
                        }))}
                        disabled={municipalityId ? false : true}
                        error={errors.objectId}
                        placeholder="Select "
                      />
                    </div>
                  </>
                )}

                <div className="col-span-2">
                  <SelectField
                    label="Constituency Name"
                    required={true}
                    name="constituencyId"
                    value={constituencyId}
                    onChange={handleChangeInput}
                    options={constituencyOpts?.map((d) => ({
                      value: d.consId,
                      label: d.consName,
                    }))}
                    error={errors.constituencyId}
                    placeholder="Select "
                  />
                </div>
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
                    placeholder="Select "
                  />
                </div>
                <div className="col-span-2">
                  <SelectField
                    label="Sub Sector"
                    name="subSector"
                    value={subSector}
                    disabled={sectorId ? false : true}
                    onChange={handleChangeInput}
                    options={subSectorOptions?.map((d) => ({
                      value: d.subSectorId,
                      label: d.subSectorName,
                    }))}
                    //   error={errors.districtId}
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
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label="Estimated Project Cost"
                    required={true}
                    type="number"
                    name="estimatedBudget"
                    placeholder="Enter estimated budget"
                    value={estimatedBudget}
                    onChange={handleChangeInput}
                    error={errors.estimatedBudget}
                  />
                </div>

                <div className="col-span-12">
                  <div className="bg-slate-100 border-l-4 border-slate-600  px-4 py-2">
                    <h5 className="text-sm font-semibold text-slate-700">
                      Proposed By Details
                    </h5>
                  </div>
                </div>

                <div className="col-span-2">
                  <SelectField
                    label="District"
                    required={true}
                    name="proposeByDist"
                    value={proposeByDist}
                    onChange={handleChangeInput}
                    options={distListOpts?.map((d) => ({
                      value: d.districtId,
                      label: d.districtName,
                    }))}
                    error={errors.proposeByDist}
                    placeholder="Select "
                  />
                </div>
                <div className="col-span-2">
                  <SelectField
                    label="Proposed by"
                    required={true}
                    name="proposedBy"
                    value={proposedBy}
                    disabled={proposeByDist ? false : true}
                    onChange={handleChangeInput}
                    options={proposedByDesignationOpts?.map((d) => ({
                      value: d.proposalId,
                      label: d.proposalName,
                    }))}
                    error={errors.proposedBy}
                    placeholder="Select "
                  />
                </div>
                <div className="col-span-2">
                  <InputField
                    label="Proposed by Name"
                    required={true}
                    name="proposedByName"
                    placeholder="Enter propose by name"
                    value={proposedByName}
                    onChange={handleChangeInput}
                    error={errors.proposedByName}
                    maxLength={50}
                  />
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
                {/* <div className="flex items-center gap-3 ">
                  <label className="text-[13px] font-medium text-gray-700">
                    Fund Release To <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-5 items-center">
                    <div className="flex gap-1">
                      <input
                        type="radio"
                        name="fundReleaseTo"
                        id="radio3"
                        value={"DISTRICT"}
                        // checked={
                        //   stateSelect?.fundReleaseTo === "DISTRICT"
                        //     ? true
                        //     : false
                        // }
                        checked={formData.fundReleaseTo === "DISTRICT"}
                        onChange={handleChangeInput}
                      />
                      <label
                        htmlFor="radio3"
                        className="text-sm text-slate-800"
                      >
                        District
                      </label>
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="radio"
                        name="fundReleaseTo"
                        id="radio4"
                        value={"EXECUTIVE_AGENCY"}
                        // checked={
                        //   stateSelect?.fundReleaseTo === "EXECUTIVE_AGENCY"
                        //     ? true
                        //     : false
                        // }
                        checked={formData.fundReleaseTo === "EXECUTIVE_AGENCY"}
                        onChange={handleChangeInput}
                      />
                      <label
                        htmlFor="radio4"
                        className="text-sm text-slate-800"
                      >
                        Executive Agency
                      </label>
                    </div>
                  </div>
                </div> */}
                <div className=" flex items-center gap-3">
                  <h1 className="font-semibold text-slate-500">
                    Total Budget :{" "}
                    <span className="font-normal text-sm text-blue-800 rounded-sm px-3 py-1 bg-blue-500/25 ">
                      ₹ {totalBudgetSum}.00
                    </span>
                  </h1>
                  <h1 className="font-semibold text-slate-500">
                    Released Amount :{" "}
                    <span className="font-normal text-sm text-green-800 rounded-sm px-3 py-1 bg-green-500/25 ">
                      ₹ {totalAmount}.00
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
                        className="absolute text-xl  p-2 text-red-500 flex justify-center items-center rounded-full"
                        style={{ top: "-17px", right: "-14px" }}
                        onClick={() => handleRemoveRow(index)}
                      >
                        <FaMinusCircle />
                      </span>
                    )}
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
                        //   error={errors.districtId}
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
                        //   error={errors.districtId}
                        placeholder="Select "
                      />
                    </div>
                    <div className="col-span-3">
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
                        //   error={errors.districtId}
                        placeholder="Select "
                      />
                    </div>
                    {/* <div className="col-span-2">
                      <SelectField
                        label="Favour of "
                        name="favourOf"
                        value={i.favourOf}
                        onChange={(e) => handleRowChange(e, index)}
                        options={favourList?.map((d) => ({
                          value: d.lookupValueCode,
                          label: d.lookupValueEn,
                        }))}
                        //   error={errors.districtId}
                        placeholder="Select "
                      />
                    </div> */}

                    <div className="col-span-2">
                      <InputField
                        type="number"
                        label="Release Amount"
                        required={true}
                        name="releaseAmount"
                        value={i.releaseAmount}
                        // disabled={i.maxamount ? false : true}
                        onChange={(e) => handleRowChange(e, index)}
                      //   error={errors.blockNameEN}
                      />
                      <div className="flex justify-between">
                        {i.maxamount !== undefined && i.maxamount !== null && (
                          <div className="text-[11px] text-blue-700">
                            Total :{" "}
                            <span className="font-semibold">
                              ₹ {Number(i.maxamount).toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                        {i.maxamount !== undefined && (
                          <div className="text-[11px] text-blue-700">
                            Remaining :{" "}
                            <span className="font-semibold">
                              ₹{" "}
                              {(
                                Number(i.maxamount) -
                                (Number(i.releaseAmount) || 0)
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <div className="col-span-2">
                      <InputField
                        label="Sanction Order No."
                        required={true}
                        name="sanctionOrderNo"
                        value={i.sanctionOrderNo}
                        onChange={(e) => handleRowChange(e, index)}
                        //   error={errors.blockNameEN}
                      />
                    </div>
                    <div className="col-span-2">
                      <InputField
                        label="Sanction Order Date"
                        type="date"
                        required={true}
                        name="sanctionOrderDate"
                        value={i.sanctionOrderDate}
                        onChange={(e) => handleRowChange(e, index)}
                        //   error={errors.blockNameEN}
                      />
                    </div>
                    <div className="col-span-2">
                      <InputField
                        label="Release Letter No."
                        required={true}
                        name="releaseLetterNo"
                        value={i.releaseLetterNo}
                        onChange={(e) => handleRowChange(e, index)}
                        //   error={errors.blockNameEN}
                      />
                    </div>
                    <div className="col-span-2">
                      <InputField
                        label="Release Letter Date"
                        type="date"
                        required={true}
                        name="releaseLetterDate"
                        value={i.releaseLetterDate}
                        onChange={(e) => handleRowChange(e, index)}
                        //   error={errors.blockNameEN}
                      />
                    </div> */}
                    <div className="col-span-4">
                      <InputField
                        label="Description"
                        textarea={true}
                        name="remarks"
                        maxLength={255}
                        value={i.remarks}
                        placeholder="Write Remarks..."
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
            <div className=" mt-3">
              <div className="flex justify-center gap-2 text-[13px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
                <ResetBackBtn />
                <SubmitBtn type={"submit"} btnText={projectId} />
                {/* <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-all active:scale-95"
                >
                  Submit
                </button>

                <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all active:scale-95">
                  Back
                </button> */}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </form>

      <ReusableDialog
        open={openSubmit}
        // title="Submit"
        description="Are you sure you want submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default Project;
