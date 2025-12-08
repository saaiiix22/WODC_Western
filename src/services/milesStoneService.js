import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveMilesStoneService=(data)=>Api.post(endpoints.milesStone.saveMilesStone,{obj:data})
export const getMilesStoneListService=(data)=>Api.get(endpoints.milesStone.getMilesStoneList,{params:{cipherText:data}})
export const editMilestoneService=(data)=>Api.get(endpoints.milesStone.editMilestone,{params:{cipherText:data}})
export const toggleMilestoneStatusService=(data)=>Api.get(endpoints.milesStone.toggleMilestoneStatus,{params:{cipherText:data}})
