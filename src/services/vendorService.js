import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveVendorDetailsService=(data)=>Api.post(endpoints.vendor.saveVendorDetails,{obj:data})
export const getVendorDataService=(data)=>Api.get(endpoints.vendor.getVendorData,{params:{cipherText:data}})
export const editVendorService=(data)=>Api.get(endpoints.vendor.editVendor,{params:{cipherText:data}})
export const toggleVendorStatusService=(data)=>Api.get(endpoints.vendor.toggleVendorStatus,{params:{cipherText:data}})
export const checkVendorBankDetailsService=(data)=>Api.get(endpoints.vendor.checkVendorBankDetails,{params:{cipherText:data}})