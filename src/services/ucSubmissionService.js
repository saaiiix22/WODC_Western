import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getUCdetailsService =(data)=>Api.get(endpoints.ucSubmission.getUCdetails,{params:{cipherText:data}})