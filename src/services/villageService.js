import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getGpByBlockService=(data)=>Api.get(endpoints.villageEndpoints.getGpByBlock,{params:{cipherText:data}})
export const saveOrUpdateBlockService =(data)=>Api.post(endpoints.villageEndpoints.saveOrUpdateBlock,{obj:data})
export const getVillageListService=(data)=>Api.get(endpoints.villageEndpoints.getVillageList,{params:{cipherText:data}})
export const getVillageByVillageIdService=(data)=>Api.get(endpoints.villageEndpoints.getVillageByVillageId,{params:{cipherText:data}})
export const updateVillageStatusService=(data)=>Api.get(endpoints.villageEndpoints.updateVillageStatus,{params:{cipherText:data}})