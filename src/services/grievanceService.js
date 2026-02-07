import Api from "../api/api";
import endpoints from "../api/endpoints";


// export const saveUpdateGrievanceService = (encData) =>
//   Api.post(
//     endpoints.grievanceCategory.savegrievance,
//     {
//       encData: encData
//     },
//     {
//       headers: {
//         "Content-Type": "application/json"
//       }
//     }
//   );

export const editGrievanceService=(data)=>Api.get(endpoints.grievanceCategory.editgrievance ,{params:{cipherText:data}})

export const saveUpdateGrievanceService=(data)=>Api.post(endpoints.grievanceCategory.savegrievance,{obj:data})
export const getCategoryListService=()=>Api.get(endpoints.grievanceCategory.getAllgrievance)


export const saveUpdateSubGrievanceService=(data)=>Api.post(endpoints.grievanceSubCategory.saveSubCategory,{obj:data})
export const getSubCategoryListService=()=>Api.get(endpoints.grievanceSubCategory.getAllSubCategory)
export const editSubCategoryService=(data)=>Api.get(endpoints.grievanceSubCategory.editSubCategory ,{params:{cipherText:data}})

export const getRoleTypeListService=()=>Api.get(endpoints.grievanceSubCategory.getRoleTypeList)

export const saveUpdateGrievanceConfigSlotService=(data)=>Api.post(endpoints.grievanceConfigSlot.saveGrievanceSlotConfig,data)
export const editGrievanceSlotConfigService=(data)=>Api.get(endpoints.grievanceConfigSlot.editGrievanceSlotConfig ,{params:{cipherText:data}})
export const getGrievanceSlotConfigListService=(data)=>Api.get(endpoints.grievanceConfigSlot.getAllGrievanceSlotConfig,{params:{encData:data}})

export const getSlotListService=()=>Api.get(endpoints.grievanceConfigSlot.getallConfigSlot)
export const checkVirtualGrievanceSlotExistService = (payload) => Api.get(endpoints.grievanceSlot.checkSlotExist,{ params: { cipherText: payload } } );
  

// export const saveAndUpdateMondatyGrievanceHearing=(data)=>Api.post(endpoints.grievanceHearing.saveGrievanceHearing,data)
export const saveAndUpdateMondatyGrievanceHearing = (formData) =>
    Api.post(
      endpoints.grievanceHearing.saveGrievanceHearing,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    export const getHearingListService=()=>Api.get(endpoints.grievanceHearing.getAllHearingList)
