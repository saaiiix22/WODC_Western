import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveUpdateAssetsTypeService = (data) =>
  Api.post(endpoints.assetsTypeMaster.saveUpdateAssetsType, { obj: data });
export const getAssetsTypeListService = () =>
  Api.get(endpoints.assetsTypeMaster.getAssetsTypeList);
export const getAssetsTypeByIdService = (cipherText) =>
  Api.get(endpoints.assetsTypeMaster.getAssetsTypeById, {
    params: { cipherText },
  });

export const saveUpdateAssetsCategoryService = (data) =>
  Api.post(endpoints.assetsCategoryMaster.saveUpdateAssetsCategory, {
    obj: data,
  });
export const getAssetsCategoryListService = () =>
  Api.get(endpoints.assetsCategoryMaster.getAssetsCategoryList);
export const getAssetsCategoryByIdService = (cipherText) =>
  Api.get(endpoints.assetsCategoryMaster.getAssetsCategoryById, {
    params: { cipherText },
  });

export const saveUpdateAssetsService = (data) =>
  Api.post(endpoints.assetsMaster.saveUpdateAssetsMaster, { obj: data });
export const getAssetsListService = (cipherText) =>
  Api.get(endpoints.assetsMaster.getAssetsMasterList, {
    params: { cipherText },
  });
export const getAssetsByIdService = (assetsId) =>
  Api.get(endpoints.assetsMaster.getAssetsMasterById, { params: { assetsId } });
export const getAssetsLookupValuesService = (lookupCode) =>
  Api.get(endpoints.assetsMaster.getAssetsLookupValues, {
    params: { lookupCode },
  });

export const downloadAssetService = () =>
  Api.get(endpoints.assetsTypeMaster.downloadExcel, {
    responseType: "blob",
  });

export const uploadAssetExcelService = (formData) =>
  Api.post(endpoints.assetsMaster.uploadExcel, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
