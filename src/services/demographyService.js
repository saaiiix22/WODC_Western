import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveDistrictService =(data)=> Api.post(endpoints.getDistrict.saveDistrict,{obj:data})
export const districtList=(data)=>Api.get(endpoints.getDistrict.districtList,{params:{cipherText:data}})
export const getDistById=(data)=>Api.get(endpoints.getDistrict.getDistById,{params:{cipherText:data}})
export const updateStatus=(data)=>Api.get(endpoints.getDistrict.updateStatus,{params:{cipherText:data}})


export const getAllDists =(data)=> Api.get(endpoints.getDistrict.getAllDists,{params:{cipherText:data}})