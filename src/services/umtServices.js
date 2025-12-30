import Api from "../api/api";
import endpoints from "../api/endpoints";

// ADD USER
export const saveAddUserService = (data) => Api.post(endpoints.umtEndpoints.saveUser, { obj: data })
export const saveUserService = (data) => Api.post(endpoints.umtEndpoints.saveUser, { obj: data })
export const getRoleListService = (data) => Api.get(endpoints.umtEndpoints.roleList, { params: { cipherText: data } })

//  ROLE USER
export const saveRoleService = (data) => Api.post(endpoints.umtEndpoints.saveRole, { obj: data })
export const editViewRoleService = (data) => Api.get(endpoints.umtEndpoints.editViewRole, { params:{cipherText:data}})
export const roleListService = (data) => Api.get(endpoints.umtEndpoints.roleList, { params: { cipherText: data } })
export const toggleRoleStatusService = (data) => Api.post(endpoints.umtEndpoints.toggleRoleStatus, null,{ params: { cipherText: data } })
export const getRoleInfoService = (data) => Api.post(endpoints.umtEndpoints.getRoleInfo, { obj: data })
// export const userListService=(data)=>Api.get(endpoints.umtEndpoints.userList,{params:{cipherText:data}})
export const saveRoleLevelMapService = (data) => Api.post(endpoints.umtEndpoints.saveRoleLevelMap, null, { params: data })

// USER LIST
export const userListService = (data) => Api.get(endpoints.umtEndpoints.userList, { params: data })
export const editUserService = (data) => Api.get(endpoints.umtEndpoints.editUser, { params: data })
export const toggleUserStatusService = (data) => Api.post(endpoints.umtEndpoints.toggleUserStatus, null, { params: data })
export const saveConfigAccessService = (data) => Api.post(endpoints.umtEndpoints.saveConfigAccess, null, { params: data })


// USER PROFILE PAGE
export const getProfileInfoService = () => Api.get(endpoints.umtEndpoints.getProfileInfo)
export const saveProfileService = (data) => Api.post(endpoints.umtEndpoints.saveProfile, data, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
})


// CHANGE PASSWORD
export const checkOldPasswordService = (data) => Api.get(endpoints.umtEndpoints.checkOldPassword,{params:{cipherText:data}})
export const changePasswordService = (data) => Api.post(endpoints.umtEndpoints.changePassword,null,{params:{cipherText:data}})




// CONFIGURE ACCESS
export const userSearchService = (data) => Api.get(endpoints.umtEndpoints.userSearch, { params: { cipherText: data } })
export const roleConfigListService = (data) => Api.get(endpoints.umtEndpoints.roleConfigList, { params: { cipherText: data } })
export const getAccessLevelConfigService = (data) => Api.get(endpoints.umtEndpoints.getAccessLevelConfig, { params: { cipherText: data } })
export const getConfigListService = (data) => Api.post(endpoints.umtEndpoints.getConfigList, null, { params: data })











// ROLE
export const getAllRolesService = (data) => Api.get(endpoints.umtEndpoints.getAllRoles, { params: { cipherText: data } })
export const getAllMenuService = (data) => Api.get(endpoints.umtEndpoints.getAllMenu, { params: { cipherText: data } })
export const saveRoleMenuMapService = (data) => Api.post(endpoints.umtEndpoints.saveRoleMenuMap, { obj: data })

