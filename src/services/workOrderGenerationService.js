import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getDetailsByProjectAndMilestoneIdService = (data) => Api.get(endpoints.wordOrderGeneration.getDetailsByProjectAndMilestoneId, { params: { cipherText: data } })
export const saveWorOrderGenerationService = (data) => Api.post(endpoints.wordOrderGeneration.saveWorkOrder, data, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
})
export const getAllWorkOrderGenerationListService=(data)=>Api.get(endpoints.wordOrderGeneration.getAllWorkOrderData,{params:{cipherText:data}})
export const getCompleteMilestoneService = (data) => Api.get(endpoints.fundReleaseInfo.getCompleteMilestone,{params:{cipherText:data}})
export const saveFundReleasInfoServicePrimary=(data)=>Api.post(endpoints.fundReleaseInfo.saveFundReleasInfo,null,{params:{cipherText:data}})