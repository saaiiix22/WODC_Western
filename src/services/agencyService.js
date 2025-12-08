import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveAgencySerice =(data)=>Api.post(endpoints.agency.saveAgency,{obj:data})
export const getAgencyDetailsService=(data)=>Api.get(endpoints.agency.getAgencyDetails,{params:{cipherText:data}})
export const editAgencySerice=(data)=>Api.get(endpoints.agency.editAgency,{params:{cipherText:data}})
export const toggleAgencyStatus=(data)=>Api.get(endpoints.agency.toggleAgencyStatus,{params:{cipherText:data}})