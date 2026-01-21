import Api from "../api/api";
import endpoints from "../api/endpoints";


export const getWorkflowRuleListService = (data) => Api.get(endpoints.workflow.stageForwardedRuleListByModule,{params:{cipherText:data}});

export const saveOrUpdateWorkflowService = (data) => Api.post(endpoints.workflow.saveOrUpdateWorkflow,{ obj: data });

export const getWorkflowModuleService = () => Api.get(endpoints.workflow.moduleList);

export const getActionTypeService = () => Api.get(endpoints.workflow.actionTypeList);

export const getWorkflowStatusService = () => Api.get(endpoints.workflow.statusList);


