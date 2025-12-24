import Api from "../api/api";
import endpoints from "../api/endpoints";


export const saveUMTService=(data)=>Api.post(endpoints.umtEndpoints.saveUMT,{obj:data})
export const saveUserService=(data)=>Api.post(endpoints.umtEndpoints.saveUser,{obj:data})
export const getRoleListService=(data)=>Api.get(endpoints.umtEndpoints.getRoleList,{params:{cipherText:data}})


export const saveRoleService=(data)=>Api.post(endpoints.umtEndpoints.saveRole,{obj:data})
export const roleListService=(data)=>Api.get(endpoints.umtEndpoints.roleList,{params:{cipherText:data}})
export const toggleRoleStatusService=(data)=>Api.get(endpoints.umtEndpoints.toggleRoleStatus,{params})












// SAI
export const getAllRolesService=(data)=>Api.get(endpoints.umtEndpoints.getAllRoles,{params:{cipherText:data}})
export const getAllMenuService=(data)=>Api.get(endpoints.umtEndpoints.getAllMenu,{params:{cipherText:data}})
export const saveRoleMenuMapService=(data)=>Api.post(endpoints.umtEndpoints.saveRoleMenuMap,{cipherText:data})

