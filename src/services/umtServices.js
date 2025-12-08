import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveUMTService=(data)=>Api.post(endpoints.umtEndpoints.saveUMT,{obj:data})

export const saveUserService=(data)=>Api.post(endpoints.umtEndpoints.saveUser,{obj:data})
export const getRoleListService=(data)=>Api.get(endpoints.umtEndpoints.getRoleList,{params:{cipherText:data}})