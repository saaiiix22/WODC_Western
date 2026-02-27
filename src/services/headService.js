import Api from "../api/api";
import endpoints from "../api/endpoints";

// Head Services

export const saveUpdateHeadService = (data) => Api.post(endpoints.head.saveUpdateHead, { obj: data });

export const getAllHeadListService = (data) => Api.get(endpoints.head.getAllHeadList, { params: { cipherText: data } });

export const editHeadDataService = (data) => Api.get(endpoints.head.getHeadById, { params: { cipherText: data } });

export const toggleHeadStatusService = (data) => Api.get(endpoints.head.toggleHeadStatus, { params: { cipherText: data } });

export const getSubHeadsByHeadIdlist = (data) => Api.get(endpoints.subHead.getAllSubHeadList, { params: { cipherText: data } });

// SubHead Services

export const saveUpdateSubHeadService = (data) => Api.post(endpoints.subHead.saveUpdateSubHead, { obj: data });

export const getAllSubHeadListService = (data) => Api.get(endpoints.subHead.getAllSubHeadList, { params: { cipherText: data } });

export const editSubHeadDataService = (data) => Api.get(endpoints.subHead.getSubHeadById, { params: { cipherText: data } });

export const toggleSubHeadStatusService = (data) => Api.get(endpoints.subHead.toggleSubHeadStatus, { params: { cipherText: data } });