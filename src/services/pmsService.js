import Api from "../api/api";
import endpoints from "../api/endpoints";

export const  getMonthList=()=>Api.get(endpoints.pms.getMonthList)
export const getQuarterlyList =() =>Api.get(endpoints.pms.getQuarterlyList)
export const getPeriodTypeList=()=>Api.get(endpoints.pms.getPeriodTypeList)
export const getPerformanceKPIList=()=>Api.get(endpoints.pms.getPerformanceKPIList)
export const getProjectField=(data)=>Api.post(endpoints.pms.getProjectField,{obj:data}) 
export const pmsSaveAndUpdate = (data) => Api.get(endpoints.pms.pmsSaveAndUpdate, {params: data});
export const DistrictPerformanceRankingsSave = (finYear) => Api.get(endpoints.pms.DistrictPerformanceRankingsSave, {params: {finYear}});