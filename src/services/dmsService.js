import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getDMSModuleList =  () => Api.get(endpoints.DMS.DMSModuleList)
export const createDMSFolder = (data) => Api.post(endpoints.DMS.DMSCreateFolder, data)
export const fetchFileAndFolderList = (data) => Api.get(endpoints.DMS.fetchFileAndFolderList, data) 