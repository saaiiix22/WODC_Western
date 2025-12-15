import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveBankAccountConfigService=(data)=>Api.post(endpoints.bankAccounConfigEndpoints.saveBankAccountConfig,{obj:data})
export const getBankListService=(data)=>Api.get(endpoints.bankAccounConfigEndpoints.getBankList,{params:{cipherText:data}})
export const editBankDetailsService=(data)=>Api.get(endpoints.bankAccounConfigEndpoints.editBankDetails,{params:{cipherText:data}})
export const toggleBankStatusService=(data)=>Api.get(endpoints.bankAccounConfigEndpoints.toggleBankStatus,{params:{cipherText:data}})

