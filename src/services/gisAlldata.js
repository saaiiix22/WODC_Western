import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveGisData =(data)=> Api.post(endpoints.gisdata.gisProjectData,{obj:data})
export const getFyearList =(data)=> Api.get(endpoints.gisdata.gisFyear,{params:{cipherText:data}})
export const getMapPinPath =(data)=> Api.get(endpoints.gisdata.gisMapPinIcon,{params:{cipherText:data}})