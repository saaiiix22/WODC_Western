import Api from "../api/api";
import endpoints from "../api/endpoints";

export const judictionMapConfigService = () => Api.get(endpoints.judictionMapConfig.judictionMapConfigList)
export const districtListByConstituencyTypeService = (data) => Api.get(endpoints.judictionMapConfig.getDistrictListByConstituencyType, {params: { cipherText: data }})
export const getConstituencyNameService=(data)=>Api.get(endpoints.judictionMapConfig.getConstituencyName,{params:{cipherText:data}})

export const saveDistConsMapService=(data)=>Api.post(endpoints.judictionMapConfig.saveDistConsMap,{obj:data})
export const saveJurisdictionConfig=(data)=>Api.post(endpoints.judictionMapConfig.saveJurisdictionConfig,{obj:data})


