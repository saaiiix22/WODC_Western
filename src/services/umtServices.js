import Api from "../api/api";
import endpoints from "../api/endpoints";


export const saveUMTService=(data)=>Api.post(endpoints.umtEndpoints.saveUMT,{obj:data})
export const saveUserService=(data)=>Api.post(endpoints.umtEndpoints.saveUser,{obj:data})
export const getRoleListService=(data)=>Api.get(endpoints.umtEndpoints.getRoleList,{params:{cipherText:data}})


export const saveRoleService=(data)=>Api.post(endpoints.umtEndpoints.saveRole,{obj:data})
export const roleListService=(data)=>Api.get(endpoints.umtEndpoints.roleList,{params:{cipherText:data}})
export const toggleRoleStatusService=(data)=>Api.get(endpoints.umtEndpoints.toggleRoleStatus,{params})