import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveUpdateConstituency =(data)=>Api.post(endpoints.constituencyEnpoints.saveUpdateConstituency,{obj:data})
export const constituencyListService =(data)=>Api.get(endpoints.constituencyEnpoints.constituencyList,{params:{cipherText:data}})
export const constituencyTypeListService =(data)=>Api.get(endpoints.constituencyEnpoints.constituencyTypeList,{params:{cipherText:data}})
export const constituencyListByTypeService =(data)=>Api.get(endpoints.constituencyEnpoints.constituencyListByType,{params:{cipherText:data}})
export const toggleConstituencyStatusService =(data)=>Api.get(endpoints.constituencyEnpoints.toggleConstituencyStatus,{params:{cipherText:data}})
export const editConstituencyService =(data)=>Api.get(endpoints.constituencyEnpoints.editConstituency,{params:{cipherText:data}})