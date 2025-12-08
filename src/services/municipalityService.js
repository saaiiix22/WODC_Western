import { data } from "react-router-dom";
import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveUpdateMunicipalityService = (data) => Api.post(endpoints.municipalityEndpoints.saveUpdateMunicipality,{obj:data})
export const getMunicipalityListService = (data)=> Api.get(endpoints.municipalityEndpoints.getMunicipalityList,{params:{cipherText:data}})
export const editMunicipality =(data)=>Api.get(endpoints.municipalityEndpoints.editMunicipality,{params:{cipherText:data}})
export const toggleMunicipalityStatusService =(data)=>Api.get(endpoints.municipalityEndpoints.toggleMunicipalityStatus,{params:{cipherText:data}})