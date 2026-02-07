import React, { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import Typography from "@mui/material/Typography";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { encryptPayload } from "../../crypto.js/encryption";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "../../components/common/CommonAccordion";
import { ResetBackBtn, SubmitBtn } from "../../components/common/CommonButtons";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import {
  getActionTypeService,
  getWorkflowModuleService,
  getWorkflowRuleListService,
  getWorkflowStatusService,
  saveOrUpdateWorkflowService,
} from "../../services/workflowService";
import { getRoleListService } from "../../services/umtServices";
import { Tooltip } from "@mui/material";

/* ================= CONSTANTS ================= */
const EMPTY_ROW = {
  forwardedId: null,
  fromStageId: "",
  toStageId: "",
  actionTypeId: "",
  statusId: "",
  fwdRuleCode: "",
  routeType: "",
  showInPage: true,
  entityLebelId: null,
  grantLevel: null,
  isFirstStage: false,
  isLastStage: false,
};

const REQUIRED_FIELDS = ['toStageId', 'actionTypeId', 'statusId', 'fwdRuleCode', 'routeType'];

/* ================= HELPER FUNCTIONS ================= */
const calculateStageFlags = (rows) => {
  if (rows.length === 0) return [];
  
  return rows.map((row, index) => {
    const totalRows = rows.length;
    let isFirstStage = false;
    let isLastStage = false;
    
    if (totalRows === 1) {
      isFirstStage = true;
      isLastStage = false;
    } else if (totalRows === 2) {
      if (index === 0) {
        isFirstStage = true;
        isLastStage = false;
      } else {
        isFirstStage = false;
        isLastStage = true;
      }
    } else {
      if (index === 0) {
        isFirstStage = true;
        isLastStage = false;
      } else if (index === totalRows - 1) {
        isFirstStage = false;
        isLastStage = true;
      } else {
        isFirstStage = false;
        isLastStage = false;
      }
    }
    
    return { ...row, isFirstStage, isLastStage };
  });
};

/* ================= MAIN COMPONENT ================= */
const WorkflowConfig = () => {
  /* ================= STATE ================= */
  const [expanded, setExpanded] = useState("panel1");
  const [formData, setFormData] = useState({ moduleId: "" });
  const [rules, setRules] = useState([]);
  const [modules, setModules] = useState([]);
  const [roles, setRoles] = useState([]);
  const [actions, setActions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleChangeInput = useCallback((e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    
    if (name === "moduleId") {
      setRules([]);
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      if (value) {
        loadModuleRules(value);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleInput = useCallback((index, name, value) => {
    setRules((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
    
    // Clear error when user types
    const errorKey = `${name}_${index}`;
    setErrors((prev) => ({ ...prev, [errorKey]: "" }));
  }, []);

  const addRow = useCallback(() => {
    if (!formData.moduleId) {
     toast.error("Please Select Module To Add");
      return;
    }

    if (rules.length === 0) {
      const newRow = { ...EMPTY_ROW, isFirstStage: true, isLastStage: false };
      setRules([newRow]);
      return;
    }

    const lastRow = rules[rules.length - 1];
    const hasMissingFields = REQUIRED_FIELDS.some(field => !lastRow[field]);
    
    if (hasMissingFields) {
      toast.error("Please fill all required fields in the previous row before adding a new one");
      return;
    }

    if (lastRow.isFirstStage && !lastRow.fromStageId) {
      toast.error("Please fill 'From Stage' in the first row before adding another row");
      return;
    }

    const newRows = [...rules, { ...EMPTY_ROW }];
    const rowsWithUpdatedFlags = calculateStageFlags(newRows);
    setRules(rowsWithUpdatedFlags);
  }, [rules]);

  const deleteRow = useCallback((index) => {
    if (rules.length === 0) {
      toast.error("No rows to delete");
      return;
    }
    
    if (rules.length === 1) {
      setRules([]);
      return;
    }
    
    const updated = rules.filter((_, i) => i !== index);
    const rowsWithUpdatedFlags = calculateStageFlags(updated);
    setRules(rowsWithUpdatedFlags);
  }, [rules]);

  const isDuplicateCode = useCallback((value, index) => {
    return rules.some((r, i) => r.fwdRuleCode === value && i !== index);
  }, [rules]);

  /* ================= VALIDATION ================= */
  const validateForm = useCallback(() => {
    let newErrors = {};

    if (!formData.moduleId) {
      newErrors.moduleId = "Module is required";
      setErrors(newErrors);
      
      return false;
    }

    let hasErrors = false;

    rules.forEach((row, index) => {
      if (!row.fromStageId) {
        newErrors[`fromStageId_${index}`] = "From Stage is required";
        hasErrors = true;
        return
      }
      
      if (!row.toStageId) {
        newErrors[`toStageId_${index}`] = "To Stage is required";
        hasErrors = true;
        return
      }

      if (!row.toStageId) {
        newErrors[`toStageId_${index}`] = "To Stage is required";
        hasErrors = true;
        return
      }
      
      if (!row.actionTypeId) {
        newErrors[`actionTypeId_${index}`] = "Action Type is required";
        hasErrors = true;
        return
      }
      
      if (!row.statusId) {
        newErrors[`statusId_${index}`] = "Status is required";
        hasErrors = true;
        return
      }

      if (!row.fwdRuleCode) {
        newErrors[`fwdRuleCode_${index}`] = "Forwarded Code is required";
        hasErrors = true;
        return
      } else if (isDuplicateCode(row.fwdRuleCode, index)) {
        newErrors[`fwdRuleCode_${index}`] = "Duplicate Forwarded Code";
        hasErrors = true;
        return
      }

      if (!row.routeType) {
        newErrors[`routeType_${index}`] = "Route Type is required";
        hasErrors = true;
        return
      }
      
     
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [formData.moduleId, rules, isDuplicateCode]);

  /* ================= API FUNCTIONS ================= */
  const loadMasters = useCallback(async () => {
    try {
      const [m, r, a, s] = await Promise.all([
        getWorkflowModuleService(),
        getRoleListService(encryptPayload(true)),
        getActionTypeService(),
        getWorkflowStatusService(),
      ]);

      setModules(m?.data?.data || []);
      setRoles(r?.data?.data || []);
      setActions(a?.data?.data || []);
      setStatuses(s?.data?.data || []);
    } catch (error) {
      console.error("Error loading masters:", error);
      toast.error("Failed to load master data");
    }
  }, []);

  const loadModuleRules = useCallback(async (moduleId = null) => {
    const idToUse = moduleId || formData.moduleId;
    
    if (!idToUse) return;

    try {
      const res = await getWorkflowRuleListService(
        encryptPayload({ moduleId: idToUse })
      );

      if (res?.data?.outcome && res.data.data?.length) {
        const rowsWithUpdatedFlags = calculateStageFlags(res.data.data);
        setRules(rowsWithUpdatedFlags);
      
      } else {
        setRules([]);
        toast.info("No existing rules found for this module");
      }
    } catch (error) {
      console.error("Error loading rules:", error);
      toast.error("Failed to load workflow rules");
    }
  }, [formData.moduleId]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    const payload = {
      moduleId: formData.moduleId,
      stageRules: rules,
    };

    try {
      const res = await saveOrUpdateWorkflowService(encryptPayload(payload));

      if (res?.data?.outcome) {
        toast.success(res?.data?.message || "Workflow saved successfully");
        loadModuleRules();
      } else {
           if (res?.status === 200) {
                toast.info(res?.data?.message || "No workflow configuration data is available to add.");
              } else {
                toast.error(res?.data?.message || "Failed to save workflow");
              }
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Error saving workflow");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.moduleId, rules, validateForm, loadModuleRules, isSubmitting]);

  const handleReset = useCallback(() => {
    setFormData({ moduleId: "" });
    setRules([]);
    setErrors({});
    setExpanded("panel1");
  }, []);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    loadMasters();
  }, [loadMasters]);

  /* ================= MEMOIZED VALUES ================= */
  const moduleOptions = useMemo(() => 
    modules?.map((m) => ({
      value: m.moduleId,
      label: m.moduleName,
    })) || []
  , [modules]);

  const roleOptions = useMemo(() => 
    roles?.map((opt) => ({
      value: opt.roleId,
      label: opt.displayName,
    })) || []
  , [roles]);

  const actionOptions = useMemo(() => 
    actions?.map((opt) => ({
      value: opt.actionTypeId,
      label: opt.actionNameEn,
    })) || []
  , [actions]);

  const statusOptions = useMemo(() => 
    statuses?.map((opt) => ({
      value: opt.statusId,
      label: opt.status,
    })) || []
  , [statuses]);



  /* ================= RENDER FUNCTIONS ================= */
const renderTableHeader = () => (
  <thead className="bg-slate-100">
    <tr>
      <th className="w-[60px] text-center text-sm font-semibold px-2 py-1 border-r border-slate-200">
        SL No
      </th>
      <th className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
        From Stage <span className="text-red-500">*</span>
      </th>
      <th className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
        To Stage <span className="text-red-500">*</span>
      </th>
      <th className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
        Action Type <span className="text-red-500">*</span>
      </th>
      <th className="text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
        Status <span className="text-red-500">*</span>
      </th>
      <th className="min-w-[150px] text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
        Forwarded Code <span className="text-red-500">*</span>
      </th>
      <th className="min-w-[150px] text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
        Route Type <span className="text-red-500">*</span>
      </th>
      <th className="w-[140px] text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
        Stage Flags
      </th>
      {/* ADDED: Show in Page column */}
      <th className="w-[140px] text-center text-sm font-semibold px-4 py-1 border-r border-slate-200">
        Show in Page
      </th>
      <th className="w-[70px] text-center text-sm px-3 py-1 border-r border-slate-200">
        Actions
      </th>
    </tr>
  </thead>
);

const renderTableRow = (row, index) => (
  <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
    <td className="border-r border-slate-200 text-center align-top">
      <div className="flex flex-col items-center justify-center h-full py-2">
        <span className="font-medium text-gray-800">{index + 1}</span>
      </div>
    </td>

    <td className="border-r border-slate-200 px-2 py-2 align-top">
      <SelectField
        name="fromStageId"
        value={row.fromStageId}
        onChange={(e) => handleInput(index, "fromStageId", e.target.value)}
        options={roleOptions}
        placeholder="Select"
        error={errors[`fromStageId_${index}`]}
        size="small"
      />
    </td>
    
    <td className="border-r border-slate-200 px-2 py-2 align-top">
      <SelectField
        name="toStageId"
        value={row.toStageId}
        onChange={(e) => handleInput(index, "toStageId", e.target.value)}
        options={roleOptions}
        placeholder="Select"
        error={errors[`toStageId_${index}`]}
        size="small"
      />
    </td>
    
    <td className="border-r border-slate-200 px-2 py-2 align-top">
      <SelectField
        name="actionTypeId"
        value={row.actionTypeId}
        onChange={(e) => handleInput(index, "actionTypeId", e.target.value)}
        options={actionOptions}
        placeholder="Select"
        error={errors[`actionTypeId_${index}`]}
        size="small"
      />
    </td>
    
    <td className="border-r border-slate-200 px-2 py-2 align-top">
      <SelectField
        name="statusId"
        value={row.statusId}
        onChange={(e) => handleInput(index, "statusId", e.target.value)}
        options={statusOptions}
        placeholder="Select"
        error={errors[`statusId_${index}`]}
        size="small"
      />
    </td>
    
    <td className="border-r border-slate-200 px-2 py-2 align-top">
      <Tooltip 
        title={row.fwdRuleCode || ""} 
        arrow 
        disableHoverListener={!row.fwdRuleCode || row.fwdRuleCode.length <= 20}
      >
        <div>
          <InputField
            name="fwdRuleCode"
            value={row.fwdRuleCode}
            onChange={(e) => handleInput(index, "fwdRuleCode", e.target.value)}
            placeholder="Enter code"
            error={errors[`fwdRuleCode_${index}`]}
            size="small"
          />
        </div>
      </Tooltip>
    </td>

    <td className="border-r border-slate-200 px-2 py-2 align-top">
      <Tooltip 
        title={row.routeType || ""} 
        arrow 
        disableHoverListener={!row.routeType || row.routeType.length <= 20}
      >
        <div>
          <InputField
            name="routeType"
            value={row.routeType}
            onChange={(e) => handleInput(index, "routeType", e.target.value)}
            placeholder="Enter route type"
            error={errors[`routeType_${index}`]}
            size="small"
          />
        </div>
      </Tooltip>
    </td>
    
    <td className="border-r border-slate-200 px-2 py-2 align-top">
      <div className="flex flex-col items-center space-y-1.5">
        <div className="flex items-center justify-between w-full px-2">
          <span className="text-xs font-medium text-gray-600">First:</span>
          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            row.isFirstStage 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {row.isFirstStage ? 'TRUE' : 'FALSE'}
          </span>
        </div>
        
        <div className="flex items-center justify-between w-full px-2">
          <span className="text-xs font-medium text-gray-600">Last:</span>
          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            row.isLastStage 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {row.isLastStage ? 'TRUE' : 'FALSE'}
          </span>
        </div>
      </div>
    </td>
    
    {/* ADDED: Show in Page toggle */}
    <td className="border-r border-slate-200 px-2 py-2 align-middle">
      <div className="flex items-center justify-center h-full">
        <Tooltip title={row.showInPage ? "Showing in page" : "Hidden from page"} arrow>
          <button
            type="button"
            onClick={() => handleInput(index, "showInPage", !row.showInPage)}
            className={`relative inline-flex h-5 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              row.showInPage ? 'bg-green-600' : 'bg-red-500'
            }`}
            aria-label={`Toggle show in page - currently ${row.showInPage ? 'shown' : 'hidden'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                row.showInPage ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </Tooltip>
      </div>
    </td>
    
    <td className="border-r border-slate-200 text-center align-middle">
      <div className="flex items-center justify-center h-full">
        <Tooltip title="Delete Row" arrow>
          <button
            type="button"
            className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
            onClick={() => deleteRow(index)}
            aria-label="Delete row"
          >
            <FaTrash className="w-4 h-10" />
          </button>
        </Tooltip>
      </div>
    </td>

  </tr>
);

  
  /* ================= MAIN RENDER ================= */
  return (
    <div className="mt-3">
      <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
        <AccordionSummary
          arrowcolor="#fff"
          sx={{
            backgroundColor: "#f4f0f2",
            '&.Mui-expanded': {
              minHeight: '48px',
              margin: 0,
            },
          }}
        >
          <Typography className="text-sm font-medium text-[#2c0014]">
            Workflow Configuration
          </Typography>
        </AccordionSummary>

        <AccordionDetails className="p-0">
          <div className="p-4">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Module Selection */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3">
                  <SelectField
                    label="Module"
                    required
                    name="moduleId"
                    value={formData.moduleId}
                    onChange={handleChangeInput}
                    options={moduleOptions}
                    error={errors.moduleId}
                    placeholder="Select Module"
                    size="small"
                  />
                </div>
              </div>

              {/* Add Row Button */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {rules.length > 0 && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {rules.length} rule{rules.length !== 1 ? 's' : ''} configured
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
      if (!formData.moduleId) {
        toast.error("Please select Module to Proceed");
      } else {
        addRow();
      }
    }}
                  
                 className={`flex items-center gap-2 px-4 py-2.5 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-offset-2 
               transition-colors text-sm font-medium shadow-sm
               ${!formData.moduleId 
                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                 : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'}`}
                >
                  <FaPlusCircle className="w-4 h-4" />
                  Add Workflow Rule
                </button>
              </div>

              {/* Workflow Rules Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      {renderTableHeader()}
                      <tbody className="divide-y divide-slate-200">
                        {rules.map((row, index) => renderTableRow(row, index))}
                      </tbody>
                    </table>
                  </div>
                
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 text-sm bg-[#42001d0f] border-t border-[#ebbea6] px-4 py-3.5 rounded-b-lg">
                <ResetBackBtn onClick={handleReset} disabled={isSubmitting} />
                <SubmitBtn 
                  type="submit" 
                 
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default WorkflowConfig;