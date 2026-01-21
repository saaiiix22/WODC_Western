import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveInspectionSerice =(data)=>Api.post(endpoints.inspection.saveInspection,{obj:data})
export const getInspectionDetailsService=(data)=>Api.get(endpoints.inspection.getAllInspectionByCategory,{params:{cipherText:data}})
export const getAllInspectionByCategoryService=(data)=>Api.get(endpoints.inspection.getAllInspectionByCategory,{params:{cipherText:data}})


export const getInspectionCalendarDataService=(data)=>Api.post(endpoints.inspection.getInspectionCalendarData,{obj:data})
export const getInspectionByDateService=(data)=>Api.post(endpoints.inspection.getInspectionByDate,{obj:data})


export const getInspectionByIdService=(data)=>Api.get(endpoints.inspection.getInspectionById,{params:{cipherText:data}})

