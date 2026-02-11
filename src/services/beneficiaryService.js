import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveBeneficiarySerice =(data)=>Api.post(endpoints.beneficiary.saveBeneficiary,{obj:data})
export const getBeneficiaryDetailsService=(data)=>Api.get(endpoints.beneficiary.getBeneficiaryDetails,{params:{cipherText:data}})
export const editBeneficiarySerice=(data)=>Api.get(endpoints.beneficiary.editBeneficiary,{params:{cipherText:data}})
export const toggleBeneficiaryStatus=(data)=>Api.get(endpoints.beneficiary.toggleBeneficiaryStatus,{params:{cipherText:data}})
export const getGenderService=()=>Api.get(endpoints.beneficiary.getGender)
export const empTypeService=()=>Api.get(endpoints.beneficiary.empType)

