import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveBeneficiarySerice =(data)=>Api.post(endpoints.beneficiary.saveBeneficiary,{obj:data})
export const getBeneficiaryDetailsService=(data)=>Api.get(endpoints.beneficiary.getBeneficiaryDetails,{params:{cipherText:data}})
export const editBeneficiarySerice=(data)=>Api.get(endpoints.beneficiary.editBeneficiary,{params:{cipherText:data}})
export const toggleBeneficiaryStatus=(data)=>Api.get(endpoints.beneficiary.toggleBeneficiaryStatus,{params:{cipherText:data}})
export const getGenderService=()=>Api.get(endpoints.beneficiary.getGender)
export const empTypeService=()=>Api.get(endpoints.beneficiary.empType)
export const getListMoneyService=()=>Api.get(endpoints.beneficiary.paymentValue)
export const listofBenificiaryByEmpType=(data)=>Api.get(endpoints.beneficiary.benificiaryByEmpType,{params:{cipherText:data}})
export const saveBeneficiaryTrackingSerice =(data)=>Api.post(endpoints.beneficiary.saveBenTrack,{obj:data})
export const getListBenTrackService = (data) =>Api.get(endpoints.beneficiary.listBenTrack, { params: { cipherText: data } });
  //export const getListBenTrackDraftService=()=>Api.get(endpoints.beneficiary.listBenTrackDraft)


export const empIncomeService=()=>Api.get(endpoints.beneficiary.empIncome)
export const empEducationService=()=>Api.get(endpoints.beneficiary.empEducation)
export const empSkillService=()=>Api.get(endpoints.beneficiary.empSkill)

export const getFilteredBeneficiariesService=(data)=>Api.get(endpoints.beneficiary.getBeneficiaryDetailsbyFilter,{params:{cipherText:data}})
export const getListBenTrackDraftService = (data) => Api.get(endpoints.beneficiary.listBenTrackDraft, { params: { cipherText: data } });