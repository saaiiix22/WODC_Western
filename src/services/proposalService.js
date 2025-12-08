import Api from "../api/api";
import endpoints from "../api/endpoints";

export const saveUpdateProposalService =(data)=>Api.post(endpoints.proposal.saveUpdateProposal,{obj:data})
export const proposalListService =(data)=>Api.get(endpoints.proposal.proposalList,{params:{cipherText:data}})
export const editProposalListService=(data) =>Api.get(endpoints.proposal.editProposalList,{params:{cipherText:data}})
export const toggleProposalStatusService=(data)=>Api.get(endpoints.proposal.toggleProposalStatus,{params:{cipherText:data}})