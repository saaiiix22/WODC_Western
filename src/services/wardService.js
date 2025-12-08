import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getMunicipalityViaDistrictsService =(data)=>Api.get(endpoints.wardEndpoints.getMunicipalityViaDistricts,{params:{cipherText:data}})
export const saveUpdateWardService =(data)=>Api.post(endpoints.wardEndpoints.saveUpdateWard,{obj:data})
export const wardListService=(data)=>Api.get(endpoints.wardEndpoints.wardList,{params:{cipherText:data}})
export const editWardListService = (data)=>Api.get(endpoints.wardEndpoints.editWardList,{params:{cipherText:data}})
export const toggleWardStatusService =(data)=>Api.get(endpoints.wardEndpoints.toggleWardStatus,{params:{cipherText:data}})