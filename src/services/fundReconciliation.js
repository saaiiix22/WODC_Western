import Api from "../api/api";
import endpoints from "../api/endpoints";

export const getFundReconciliationAccount = () => Api.get(endpoints.fundReconciliationReport.fundReconciliationAccount);
export const submitFundReconciliationReport = (params) =>
  Api.get(endpoints.fundReconciliationReport.fundReconciliationSubmit, {
    params
  });

