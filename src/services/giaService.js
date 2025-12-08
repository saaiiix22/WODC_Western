import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveUpdateGIAtypeService =(data)=> Api.post(endpoints.giaEndpoints.saveGIAtype,{obj:data})
export const getGIAtypeList=(data)=>Api.get(endpoints.giaEndpoints.getGIAtypeList,{params:{cipherText:data}})
export const toggleGIAstatusService =(data)=>Api.get(endpoints.giaEndpoints.toggleGIAtypeStatus,{params:{cipherText:data}})
export const editGIAtypeService=(data)=>Api.get(endpoints.giaEndpoints.editGIAtype,{params:{cipherText:data}})