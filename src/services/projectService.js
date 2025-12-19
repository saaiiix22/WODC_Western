
import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getVillageThroughGpService = (data) => Api.get(endpoints.project.getVillageThroughGp, { params: { cipherText: data } })
export const getWardByMunicipalityService = (data) => Api.get(endpoints.project.getWardByMunicipality, { params: { cipherText: data } })
export const getConsThroughDistService = (data) => Api.get(endpoints.project.getConsThroughDist, { params: { cipherText: data } })
export const getProposalByDistService = (data) => Api.get(endpoints.project.getProposalByDist, { params: { cipherText: data } })
export const getSectorService = (data) => Api.get(endpoints.project.getSector, { params: { cipherText: data } })
export const getSubsectorService = (data) => Api.get(endpoints.project.getSubsector, { params: { cipherText: data } })
// export const getFavourANDmodeOfTransferService=(data)=>Api.get(endpoints.project.getFavourANDmodeOfTransfer,{params:{cipherText:data}})


export const saveProjectService = (data) => Api.post(endpoints.project.saveProject, { obj: data })
export const getAllProjectService = (data) => Api.get(endpoints.project.getAllProject, { params: { cipherText: data } })
export const takeActionProjectService = (data) => Api.get(endpoints.project.takeAction, { params: { cipherText: data } })
export const getProjectDetailsByProjectIdService = (data) => Api.get(endpoints.project.getProjectDetails, { params: { cipherText: data } })
export const generateProjectCodeService = (data) => Api.get(endpoints.project.generateProjectCode, { params: { cipherText: data } })
export const totalBudgetService = () => Api.get(endpoints.project.totalBudget)

export const maxBudgetService = (data) => Api.get(endpoints.project.maxBudget, { params: { cipherText: data } })
export const getProjectListService = (data) => Api.get(endpoints.project.getProjectList, { params: { cipherText: data } })
export const getMilestoneService = (data) => Api.get(endpoints.project.getMilestone, { params: { cipherText: data } })
export const getBudgetByProjectService = (data) => Api.get(endpoints.project.getBudgetByProject, { params: { cipherText: data } })
export const saveProjectAgencyMilestoneService = (data) => Api.post(endpoints.project.saveProjectAgencyMilestone, { obj: data })
export const getProjectMapByProjectIdService = (data) => Api.get(endpoints.project.getAllProjectMapById, { params: { cipherText: data } })
export const projectAlllookUpValueService = (data) => Api.get(endpoints.project.projectAlllookUpValue, { params: { cipherText: data } })
export const getMilestoneByProjectIdService = (data) => Api.get(endpoints.project.getMilestoneByProjectId, { params: { cipherText: data } })
export const getProjectAgencyMilestoneMapDetailsService = (data) => Api.get(endpoints.project.getProjectAgencyMilestoneMapDetails, { params: { cipherText: data } })
export const getBeneficaryDetailsServiceInProject = (data) => Api.get(endpoints.project.getBeneficiaryDetails, { params: { cipherText: data } })
export const saveUpdateAgencyMilestoneService = (data) => Api.post(endpoints.project.saveUpdateAgencyMilestone, { obj: data })
export const saveBeneficaryByExcelService = (data) => Api.post(endpoints.project.saveBeneficaryByExcel, data, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
})



export const getBeneficiaryByIdsService = (data) => Api.get(endpoints.project.getBeneficiaryByIds, { params: { cipherText: data } })
export const getProjectByFinYearService = (data) => Api.get(endpoints.project.getProjectByFinYear, { params: { cipherText: data } })
export const getUpdatedFuncDetailsService = (data) => Api.get(endpoints.project.getUpdatedFuncDetails, { params: { cipherText: data } })
export const getBankConfigProjectService = (data) => Api.get(endpoints.project.getBankConfigProject, { params: { cipherText: data } })



export const getTemplateFileService = () => Api.get(endpoints.project.getTemplateFile, {
    responseType: "blob",
})