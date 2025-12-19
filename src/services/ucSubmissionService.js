import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getUCdetailsService = (data) => Api.get(endpoints.ucSubmission.getUCdetails, { params: { cipherText: data } })
export const saveUCdetailsService = (data) => Api.post(endpoints.ucSubmission.saveUCdetails, data, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
})