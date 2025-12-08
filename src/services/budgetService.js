import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getFinancialYearService =(data)=>Api.get(endpoints.budget.getFinancialYear,{params:{cipherText:data}})
export const getBankNamesService =(data)=>Api.get(endpoints.budget.getBankNames,{params:{cipherText:data}})
export const saveUpdateBudgetService=(data)=>Api.post(endpoints.budget.saveUpdateBudget,{obj:data})

export const getBudgetByFinancialYearService=(data)=>Api.get(endpoints.editBudget.getBudgetByFinancialYear,{params:{cipherText:data}})