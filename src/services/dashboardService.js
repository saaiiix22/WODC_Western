import { data } from "react-router-dom";
import Api from "../api/api";
import endpoints from "../api/endpoints";



export const getDashboardCategoriesService=(data)=>Api.get(endpoints.budget.getFinancialYear,{params:{cipherText:data}})
