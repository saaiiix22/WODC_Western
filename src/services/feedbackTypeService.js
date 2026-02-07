import Api from "../api/api";
import endpoints from "../api/endpoints";

export const validateFeedbackTypeName = (cipherText) => Api.get(endpoints.fbms.feedbackType.validateFeedbackTypeName, {params: {cipherText}});
export const saveFeedbackTypeService = (cipherText) => Api.post(endpoints.fbms.feedbackType.saveFeedbackType, cipherText, {headers: {'Content-Type': 'multipart/form-data',}});
export const editFeedbackTypeService = (cipherText) => Api.post(endpoints.fbms.feedbackType.updateFeedbackType, null, {params: { cipherText }});
export const feedbackTypeListService = () => Api.get(endpoints.fbms.feedbackType.feedbackTypeList);