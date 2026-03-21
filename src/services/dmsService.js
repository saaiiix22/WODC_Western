import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getDMSModuleList = () => Api.get(endpoints.DMS.DMSModuleList)
export const createDMSFolder = (data) => Api.post(endpoints.DMS.DMSCreateFolder, data)
export const fetchFileAndFolderList = (data) => Api.get(endpoints.DMS.fetchFileAndFolderList, data)
export const toggleBookmark = (data) => Api.get(endpoints.DMS.toggleBookmark, data)
export const DMSUploadFile = (data) => Api.post(endpoints.DMS.DMSUploadFile, data)
export const DMSDownloadFile = (data) =>
  Api.get(endpoints.DMS.folderDownload, {
    params: data,
    responseType: "blob",
  });

export const DMSDeleteFolderOrFile = (folderOrFileLink) => {
  return Api.post(
    endpoints.DMS.folderDelete,
    null,
    {
      params: { folderOrFileLink },
    }
  );
};

export const getBookmarkList = (params) =>
  Api.get(endpoints.DMS.bookMarkList, { params });

export const getShareWithMeTabList = (params) =>
  Api.get(endpoints.DMS.sharewithMeTabList, { params });

export const getPublicFolderTabList = (params) =>
  Api.get(endpoints.DMS.publicFolderTabList, { params });

export const getTrashFolderTabList = (params) =>
  Api.get(endpoints.DMS.trashFolderTabList, { params });

export const recoverTrashFolderOrFiles = (folderOrFileLink) => {
  return Api.post(
    endpoints.DMS.recoverFolderOrFile,
    null,
    {
      params: { folderOrFileLink },
    }
  );
};

export const generateAPIKeys = (folderOrFileLink, actions) =>
  Api.get(endpoints.DMS.generateAPIkey, {
    params: {
      folderOrFileLink,
      actions,
    },
  });

export const loadTableData = (shareEntityCode, folderOrFileLink, scope) =>
  Api.get(endpoints.DMS.loadTableData, {
    params: {
      shareEntityCode,
      folderOrFileLink,
      scope,
    },
  });


export const shareTheTableData = (data) =>
  Api.post(endpoints.DMS.shareTheTableData, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });