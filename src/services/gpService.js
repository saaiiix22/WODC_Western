import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getBlockThroughDistrictService = (data)=> Api.get(endpoints.gpEndpoints.getBlockThroughDistrict,{params:{cipherText:data}})
export const saveUpdateGpService=(data)=>Api.post(endpoints.gpEndpoints.saveUpdateGp,{obj:data})
export const getGpListService=(data)=>Api.get(endpoints.gpEndpoints.getGPlist,{params:{cipherText:data}})
export const editGpService=(data)=>Api.get(endpoints.gpEndpoints.editGp ,{params:{cipherText:data}})
export const toggleGpStatusService =(data)=>Api.get(endpoints.gpEndpoints.toggleStatus,{params:{cipherText:data}})
