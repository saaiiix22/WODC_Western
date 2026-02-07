import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveFeedbackService =  (cipherText) => Api.post(endpoints.fbms.feedback.saveFeedback, null,{ params: { cipherText } });
export const getFeedbackService = (cipherText) =>Api.post(endpoints.fbms.feedback.getFeedbackById, null,{ params: { cipherText } });
export const feedbackStatusListService = () =>Api.get(endpoints.fbms.feedback.feedbackStatusList);
export const feedbackQuestionsByProjectAndFeedbackTypeService = (cipherText) =>
  Api.get(endpoints.fbms.feedback.feedbackQuestionsByProjectAndFeedbackType,{  params: { cipherText }});
