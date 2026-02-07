import Api from "../api/api";
import endpoints from "../api/endpoints";

export const fetchFeedbackTypeListService = (data) => Api.get(endpoints.fbms.fbmsCommon.fetchFeedbackType);
export const fetchProjectDetailsListService = (data) => Api.get(endpoints.fbms.fbmsCommon.fetchProjectDetails);