import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveInspectionSerice = (data) => Api.post(endpoints.inspection.saveInspection, { obj: data })
export const getInspectionDetailsService = (data) => Api.get(endpoints.inspection.getAllInspection, { params: { cipherText: data } })
export const getAllInspectionByCategoryService = (data) => Api.get(endpoints.inspection.getAllInspectionByCategory, { params: { cipherText: data } })


export const getInspectionCalendarDataService = (data) => Api.post(endpoints.inspection.getInspectionCalendarData, { obj: data })
export const getInspectionByDateService = (data) => Api.post(endpoints.inspection.getInspectionByDate, { obj: data })
export const getInspectionByIdService = (data) => Api.get(endpoints.inspection.getInspectionById, { params: { cipherText: data } })
export const saveInspectionByStatuservice = (data) => Api.post(endpoints.inspection.approveInspection, { obj: data })

export const getLookUpForInspectionService = () => Api.get(endpoints.inspection.getByLookUpInspection)

export const getLookUpForInspectionPhaseService = () => Api.get(endpoints.inspection.getByLookUpInspectionPhase)

export const getInspectionPhaseByProjectAndMilestoneService = (data) => Api.get(endpoints.inspection.getInspectionInfoByProjMlstn, { params: { cipherText: data } })
export const inspectionTabService =(data)=>Api.get(endpoints.inspection.inspectionTable,{params:{cipherText:data}})