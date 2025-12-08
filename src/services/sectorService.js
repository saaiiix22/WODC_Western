import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveSectorService =(data)=>Api.post(endpoints.sectorPage.saveSector,{obj:data})
export const getAllSectorListService=(data)=>Api.get(endpoints.sectorPage.getAllSectorList,{params:{cipherText:data}})
export const editSectorService =(data)=>Api.get(endpoints.sectorPage.editSector,{params:{cipherText:data}})
export const toggleSectorStatusService=(data)=>Api.get(endpoints.sectorPage.toggleSectorStatus,{params:{cipherText:data}})


export const saveSectorMilestoneMapService=(data)=>Api.post(endpoints.sectorMilestoneMap.saveSectorMilestoneMap,{obj:data})
export const getMilestoneBySectorService =(data)=>Api.get(endpoints.sectorMilestoneMap.getMilestoneBySector,{params:{cipherText:data}})