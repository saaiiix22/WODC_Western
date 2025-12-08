import Api from "../api/api";
import endpoints from "../api/endpoints";

export const loginService = (data) => Api.post(endpoints.auth.login,{obj:data})
export const logoutService = (data) => Api.post(endpoints.auth.logout,data)

export const MenuList = () =>  apiClient.get(endpoints.menu.getMenuList)

export const UserProfileDetails= () => apiClient.get(endpoints.menu.UserDetails)