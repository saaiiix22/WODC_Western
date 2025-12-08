import Api from "../api/api";
import endpoints from "../api/endpoints";

export const loginService = (data) => Api.post(endpoints.auth.login,{obj:data})
export const logoutService = (data) => Api.post(endpoints.auth.logout,data)

export const MenuList = (data) =>  Api.get(endpoints.menu.getMenuList,{params:{cipherText:data}})

export const UserProfileDetails= () => Api.get(endpoints.menu.UserDetails)