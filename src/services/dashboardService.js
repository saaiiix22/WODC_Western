import { data } from "react-router-dom";
import Api from "../api/api";
import endpoints from "../api/endpoints";



export const getDashboardCategoriesService=(data)=>Api.get(endpoints.budget.getFinancialYear,{params:{cipherText:data}})
export const notificationsService=()=>Api.get(endpoints.dashboard.notifications)
export const getAllCardsDataService=()=>Api.get(endpoints.dashboard.getAllCardsData)
export const getDistrictWiseFundDataService=()=>Api.get(endpoints.dashboard.districtWiseFundData)
export const getDistrictWiseWorkStatusService=()=>Api.get(endpoints.dashboard.districtWiseWorkStatus)
export const getDelayedProjectsService=()=>Api.get(endpoints.dashboard.delayedProjects)
export const getProjectSummaryService=()=>Api.get(endpoints.dashboard.projectSummary)