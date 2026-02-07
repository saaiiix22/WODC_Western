import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveFeedbackQuestionsService = (cipherText) => Api.post(endpoints.fbms.feedbackQuestions.saveFeedbackQuestions, null, {params: { cipherText }});
export const editFeedbackQuestionsService = (cipherText) => Api.post(endpoints.fbms.feedbackQuestions.updateFeedbackQuestions, null, {params: { cipherText }});
export const feedbackQuestionsListService = () => Api.get(endpoints.fbms.feedbackQuestions.feedbackQuestionsList);
export const fetchFeedbackQuestionByTypeAndProjectService = (cipherText) => Api.post(endpoints.fbms.feedbackQuestions.fetchFeedbackQuestionByTypeAndProject, null, {params: { cipherText }});