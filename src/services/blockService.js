import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getAllDists =(data)=> Api.get(endpoints.block.getAllDists,{params:{cipherText:data}})

export const saveUpdateBlockService= (data)=> Api.post(endpoints.block.saveUpdateBlock,{obj:data})

export const getAllBlockListService=(data)=> Api.get(endpoints.block.getAllBlockList,{params:{cipherText:data}})
export const editBlockDataService =(data)=>Api.get(endpoints.block.editBlockData,{params:{cipherText:data}})
export const toggleBlockStatusService=(data)=>Api.get(endpoints.block.toggleBlockStatus,{params:{cipherText:data}})