import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import InputField from "../../components/common/InputField";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useEffect } from "react";
import { GoPencil } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import ReusableDialog from "../../components/common/ReusableDialog";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import {
  editMilestoneService,
  getMilesStoneListService,
  saveMilesStoneService,
  toggleMilestoneStatusService,
} from "../../services/milesStoneService";
import { Tooltip } from "@mui/material";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import SelectField from "../../components/common/SelectField";
import { FaEye } from "react-icons/fa";
import { getCategoryListService, getSubCategoryListService } from "../../services/grievanceService";

const RadioButton = ({ label, value, onChange }) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <RadioGroup
      row
      value={value ? "true" : "false"}
      onChange={(e) => onChange(e.target.value === "true")}
    >
      <FormControlLabel value="true" control={<Radio />} label="Yes" />
      <FormControlLabel value="false" control={<Radio />} label="No" />
    </RadioGroup>
  </FormControl>
);

const AddWorkFlowConfiguration = () => {



  const [formData, setFormData] = useState({
    virtualGrvSlotId: null,
    grvCtgId: null,
    grvSubCtgId: null,
    routeType:"",
    fromStage:"",
    toStage:"",
    isActive:"",
    isShownPage: true,  
    isFirstStage: true,  
    isLastStage: true,   
  });
  
  const {
    virtualGrvSlotId,
    grvCtgId,
    grvSubCtgId,
    routeType,
    fromStage,
    toStage,
    isActive,
    isShownPage,  
    isFirstStage,  
    isLastStage,   

  } = formData;
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);

  
  const getGrievanceCategoryName = async () => {
    try {
      const res = await getCategoryListService();
      setCategoryList(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getGrievanceSubCategoryName = async () => {
    try {
      const res = await getSubCategoryListService();
      setAllSubCategories(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // const getGrievanceCategoryName = async () => {
  //   try {
  //     const res = await getCategoryListService();
  //     setCategoryList(res?.data?.data || []);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  
  // const getGrievanceSubCategoryName = async () => {
  //   try {
  //     const res = await getSubCategoryListService();
  //     setAllSubCategories(res?.data?.data || []); // keep master list
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // for ajax call--------------------------------
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
-    setFormData((prev) => ({
      ...prev,
      grvCtgId: selectedCategoryId,
      grvSubCtgId: "", 
    }));
    setErrors((prev) => ({ ...prev, grvCtgId: "", grvSubCtgId: "" }));
    const filteredSubs = allSubCategories.filter(
      (sub) => String(sub.grvCtgId) === String(selectedCategoryId)
    );
    setSubCategoryList(filteredSubs);
  };
  
//-------------------------------------------------

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData({ ...formData, [name]: value });
  };
  const [errors, setErrors] = useState({});
  const [openSubmit, setOpenSubmit] = useState(false);

  // const handleSubmitConfirmModal = (e) => {
  //   e.preventDefault();
  //   let newErrors = {};

  //   if (!milestoneName || !milestoneName.trim()) {
  //     newErrors.milestoneName = "Milestone name is required";
  //     setErrors(newErrors);
  //     return;
  //   }
  //   if (Object.keys(newErrors).length === 0) {
  //     setOpenSubmit(true);
  //   }
  // };



  const handleSubmitConfirmModal = (e) => {
    e.preventDefault();
    let newErrors = {};
  
    if (!grvCtgId) {
      newErrors.grvCtgId = "Grievance Category is required";
      setErrors(newErrors);
      return; 
    }
  
    if (!grvSubCtgId) {
      newErrors.grvSubCtgId = "Grievance Sub Category is required";
      setErrors(newErrors);
      return;
    }
  
    if (!routeType || !routeType.trim()) {
      newErrors.routeType = "Route Type is required";
      setErrors(newErrors);
      return;
    }
  
    if (!fromStage) {
      newErrors.fromStage = "From Stage is required";
      setErrors(newErrors);
      return;
    }
  
    if (!toStage) {
      newErrors.toStage = "To Stage is required";
      setErrors(newErrors);
      return;
    }
  
    if (isShownPage === null || isShownPage === undefined) {
      newErrors.isShownPage = "Show In Page is required";
      setErrors(newErrors);
      return;
    }
  
    if (isFirstStage === null || isFirstStage === undefined) {
      newErrors.isFirstStage = "Is First Stage is required";
      setErrors(newErrors);
      return;
    }
  
    if (isLastStage === null || isLastStage === undefined) {
      newErrors.isLastStage = "Is Last Stage is required";
      setErrors(newErrors);
      return;
    }
   
   if (!formData.action || !formData.action.trim()) {
      newErrors.action = "Action is required";
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setOpenSubmit(true);
  };
  


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = {
      virtualGrvSlotId: null,
      grvCtgId: null,
      grvSubCtgId: null,
      routeType:"",
      fromStage:"",
      toStage:"",
      isActive:"",
      isShownPage: "",  
      isFirstStage: "",  
      isLastStage: "",   
    };
    try {
      setOpenSubmit(false);
      setExpanded("panel2");
      const payload = encryptPayload(sendData);
      const res = await saveMilesStoneService(payload);
      console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        toast.success(res?.data.message);
        setFormData({
          virtualGrvSlotId: null,
          grvCtgId: null,
          grvSubCtgId: null,
          routeType:"",
          fromStage:"",
          toStage:"",
          isActive:"",
          isShownPage: "",  
          isFirstStage: "",  
          isLastStage: "", 
        });
        setExpanded("panel2");
        getMilesStoneTable();
      } else {
        toast.error(res?.data.message);
        setFormData({
          virtualGrvSlotId: null,
          grvCtgId: null,
          grvSubCtgId: null,
          routeType:"",
          fromStage:"",
          toStage:"",
          isActive:"",
          isShownPage: "",  
          isFirstStage: "",  
          isLastStage: "", 
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const [tableData, setTableData] = useState([]);
  const getMilesStoneTable = async () => {
    try {
      const payload = encryptPayload({ isActive: false });
      const res = await getMilesStoneListService(payload);
      // console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setTableData(res?.data.data || []);
      } else {
        toast.error(res?.data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getMilesStoneTable();
    getGrievanceCategoryName();
    getGrievanceSubCategoryName();
  }, []);

  const [openModal, setOpenModal] = useState(false);

  const editMilestone = async (id) => {
    try {
      const payload = encryptPayload({ virtualGrvSlotId: id, isActive: false });
      const res = await editMilestoneService(payload);
      if (res?.status === 200 && res?.data.outcome) {
        setFormData(res?.data.data);
        setExpanded("panel1");
        setErrors({});
      }
    } catch (error) {
      throw error;
    }
  };



   /* ---------------- EDIT / VIEW ---------------- */
   const openEdit = async (id, view = false) => {
    const payload = encryptPayload({ virtualGrvSlotId: id });
    const res = await editMilestoneService(payload);

    if (res?.data?.outcome) {
      const data = res.data.data;

      const filteredSubs = allSubCategories.filter(
        (s) => String(s.grvCtgId) === String(data.grvCtgId)
      );

      setSubCategoryList(filteredSubs);
      setFormData({
        ...data,
        isShownPage: Boolean(data.isShownPage),
        isFirstStage: Boolean(data.isFirstStage),
        isLastStage: Boolean(data.isLastStage),
      });

      setMode(view ? "VIEW" : "EDIT");
      setExpanded("panel1");
    }
  };

  const activeOptions = [
    { value: "Reject", label: "Reject" },
    { value: "Verify", label: "Verify" },
    { value: "Save", label: "Save" },
    { value: "Disposed", label: "Disposed" },
  ];
  // const [openvirtualGrvSlotId, setvirtualGrvSlotId] = useState("");

  const toggleStatus = async () => {
    try {
      // const payload = encryptPayload({ virtualGrvSlotId: openvirtualGrvSlotId});
      const res = await toggleMilestoneStatusService(payload);
      //   console.log(res);
      if (res?.status === 200 && res?.data.outcome) {
        setOpenModal(false);
        toast.success(res?.data.data);
        getMilesStoneTable();
      }
    } catch (error) {
      throw error;
    }
  };

  const milestoneColumn = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Grievance Type",
      selector: (row) =>
        (
          <div className="flex gap-1">
            <p>{row.grvCtgId}</p> |{" "}
            <p className="text-slate-800">{row.grvSubCtgId}</p>
          </div>
        ) || "N/A",
      sortable: true,
    },
    {
      name: "Route Type",

      selector: (row) => row.routeType || "N/A",
      sortable: true,
    },
    {
      name: "From Stage",

      selector: (row) => row.romStage || "N/A",
      sortable: true,
    },
    {
      name: "To Stage",

      selector: (row) => row.toStage || "N/A",
      sortable: true,
    },
    
    {
      name: "Status",
      width: "100px",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-sm text-xs ${
            row.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.isActive ? "N/A" : ""}
        </span>
      ),
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
              className="flex items-center justify-center h-8 w-8 bg-blue-500/25 text-blue-500 rounded-full"
              onClick={() => {
                editMilestone(row?.virtualGrvSlotId);
              }}
            >
              <GoPencil className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip>
            <button
              className="h-8 w-8 bg-blue-500/25 text-blue-500 rounded-sm flex justify-center items-center"
              onClick={() => ViewUser(i.userId)}
            >
              <FaEye />
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
            Add WorkFlow
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
                  label="Grievance Category"
                  required
                  name="grvCtgId"
                  value={grvCtgId}
                  onChange={handleCategoryChange}
                  options={categoryList.map((d) => ({
                    value: d.grievanceCategoryId,
                    label: d.grievanceCategoryName,
                  }))}
                   error={errors.grvCtgId}
                  placeholder="Select"
                />
              </div>
              <div className="col-span-2">
              <SelectField
                label="Grievance Sub Category"
                required
                name="grvSubCtgId"
                value={grvSubCtgId || ""}
                onChange={handleChangeInput}
                options={subCategoryList.map((d) => ({
                  value: d.grvSubCtgId,
                  label: d.grvSubCtgName,
                }))}
                error={errors.grvSubCtgId}
                placeholder={grvCtgId ? "Select Sub Category" : "Select"}
                disabled={!grvCtgId}  
              />

              </div>

              <div className="col-span-3">
                <InputField
                  label="Route Type"
                  required={true}
                  textarea={true}
                  name="routeType"
                  maxLength={255}
                   value={routeType}
                   error={errors.routeType}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="col-span-2">
                <SelectField
                  label="From Stage"
                  required={true}
                  maxLength={100}
                  name="fromStage"
                  placeholder="select"
                  value={fromStage}
                  onChange={handleChangeInput}
                  error={errors.fromStage}
                />
              </div>
              <div className="col-span-2">
                <SelectField
                  label="To Stage"
                  required={true}
                  maxLength={100}
                  name="toStage"
                  placeholder="select"
                  value={toStage}
                  onChange={handleChangeInput}
                  error={errors.toStage}
                />
              </div>
              <div className="col-span-9 grid grid-cols-12 gap-6 mt-2">
                <div className="col-span-4 flex flex-col">
                  <label className="text-[13px] font-medium text-gray-700">
                    Show In Page ? <span className="text-red-500">*</span>
                  </label>
                  <RadioButton required
                    // value={formData.showInPage}
                    // onChange={(val) => handleRadioChange("showInPage", val)}
                    value={formData.isShownPage}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, isShownPage: val }))
                    }
                  />
                </div>

                <div className="col-span-4 flex flex-col">
                  <label className="text-[13px] font-medium text-gray-700">
                    Is First Stage <span className="text-red-500">*</span>
                  </label>
                  <RadioButton
                    // value={formData.isFirstStage}
                    // onChange={(val) => {
                    // //   handleRadioChange("isFirstStage", val);
                    // //   if (val) handleRadioChange("isLastStage", false);
                    // }}
                    value={formData.isFirstStage}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, isFirstStage: val }))
                    }
                  />
                </div>

                <div className="col-span-4 flex flex-col">
                  <label className="text-[13px] font-medium text-gray-700">
                    Is Last Stage <span className="text-red-500">*</span>
                  </label>
                  <RadioButton
                    // value={formData.isLastStage}
                    // onChange={(val) => {
                    //   handleRadioChange("isLastStage", val);
                    //   if (val) handleRadioChange("isFirstStage", false);
                    // }}
                    value={formData.isLastStage}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, isLastStage: val }))
                    }
                  />
                </div>
              </div>
              {/* <div className="col-span-2 ">
                <SelectField
                  label="Action"
                  required={true}
                  maxLength={100}
                  name="action"
                  placeholder="select"
                  //   value={fromStage}
                  onChange={handleChangeInput}
                  //   error={errors.toStage}
                />
              </div> */}

              <div className="col-span-2">
                <SelectField
                  label="Action:"
                  required={true}
                  name="isActive"
                  value={isActive}
                  onChange={handleChangeInput}
                  options={activeOptions}
                  placeholder="Select"
                  error={errors.isActive}
                />
              </div>

              <div className="col-span-12">
                <div className="flex justify-center gap-2 text-[18px] bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3 rounded-b-md">
                  <ResetBackBtn />
                  <SubmitBtn type={"submit"} btnText={virtualGrvSlotId} />
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
            </form>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* ---------- Accordion 2: WorkFlow List ---------- */}
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
            WorkFlow List
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReusableDataTable data={tableData} columns={milestoneColumn} />
        </AccordionDetails>
      </Accordion>
      <ReusableDialog
        open={openModal}
        // title="Change Status"
        description="Are you sure you want to change status?"
        onClose={() => setOpenModal(false)}
        onConfirm={toggleStatus}
      />

      <ReusableDialog
        open={openSubmit}
        description="Are you sure you want submit?"
        onClose={() => setOpenSubmit(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
};

export default AddWorkFlowConfiguration;
