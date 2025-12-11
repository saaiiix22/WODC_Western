const endpoints = {
    auth: {
        login: '/login',
        logout: '/logout',
    },
    menu: {
        getMenuList: '/admin/menu/get-menus-for-role-map',
        UserDetails: '/admin/role/getCurrentRole',
    },
    getDistrict: {
        saveDistrict: '/mst/save-n-update-district-details',
        districtList: '/mst/get-district-list',
        getDistById: '/mst/get-district-by-id',
        updateStatus: '/mst/toggle-status-district-by-districtid',
    },
    block: {
        getAllDists: "/mst/get-district-list",
        saveUpdateBlock: "/mst/save-n-update-block-details",
        getAllBlockList: '/mst/get-block-list',
        editBlockData: "/mst/get-block-by-id",
        toggleBlockStatus: "/mst/toggle-status-block-by-blockId"
    },
    gpEndpoints: {
        getBlockThroughDistrict: '/cmn/get-block-by-distid',
        saveUpdateGp: "/mst/save-n-update-gp-details",
        getGPlist: "/mst/get-gp-list",
        editGp: "/mst/get-gp-by-id",
        toggleStatus: "/mst/toggle-status-gp-by-gpId"
    },
    municipalityEndpoints: {
        saveUpdateMunicipality: '/mst/save-or-update-municipality',
        getMunicipalityList: '/mst/get-municipality-list',
        editMunicipality: '/mst/get-municipality-by-municipalityid',
        toggleMunicipalityStatus: '/mst/toggle-municipality-status-by-municipalityid',
    },
    wardEndpoints: {
        getMunicipalityViaDistricts: '/cmn/get-municipality-list-by-districtid',
        saveUpdateWard: '/mst/save-or-update-ward',
        wardList: '/mst/get-ward-list',
        editWardList: '/mst/get-ward-by-wardid',
        toggleWardStatus: '/mst/toggle-ward-status-by-wardid',
    },
    villageEndpoints: {
        getGpByBlock: '/cmn/get-gp-by-blockid',
        saveOrUpdateBlock: '/mst/save-or-update-village',
        getVillageList: '/mst/get-village-list',
        getVillageByVillageId: '/mst/get-village-by-villageid',
        updateVillageStatus: '/mst/toggle-village-status-by-villageid'
    },
    constituencyEnpoints: {
        saveUpdateConstituency: '/mst/save-or-update-constituency',
        constituencyList: '/mst/get-constituency-list',
        toggleConstituencyStatus: '/mst/toggle-constituency-status-by-constituencyid',
        editConstituency: '/mst/get-constituency-by-constituencyid'
    },
    proposal: {
        saveUpdateProposal: '/mst/save-or-update-proposal',
        proposalList: '/mst/get-proposal-list',
        editProposalList: '/mst/get-proposal-by-proposalid',
        toggleProposalStatus: '/mst/toggle-proposal-status-by-proposalid'
    },
    giaEndpoints: {
        saveGIAtype: '/mst/save-n-update-gia-type-details',
        getGIAtypeList: '/mst/get-gia-type-list',
        editGIAtype: '/mst/get-gia-type-by-id',
        toggleGIAtypeStatus: '/mst/toggle-status-gia-type-by-id'
    },
    budget: {
        getFinancialYear: '/mst/get-financial-year-list',
        getBankNames: '/mst/list-bank-master',
        saveUpdateBudget: '/fund/save-or-update-budget',
    },
    editBudget: {
        getBudgetByFinancialYear: '/fund/get-budget-list'
    },
    project: {
        getVillageThroughGp: '/cmn/get-village-list-by-gpid',
        getWardByMunicipality: '/cmn/get-ward-list-by-municipalityid',
        getConsThroughDist: '/cmn/get-constituency-list-by-districtid',
        getProposalByDist: '/cmn/get-proposal-list-by-districtid',
        getSector: '/mst/list-sector-subsector',
        getSubsector: '/cmn/get-sub-sector-by-sector-id',
        // getFavourANDmodeOfTransfer:'/cmn/get-lookup-mode-and-favourof',
        saveProject: '/project/save-or-update-project',
        getAllProject: '/project/get-project-list',
        takeAction: '/project/take-action-against-project',
        getProjectDetails: '/project/get-project-by-projectid',
        generateProjectCode: '/project/get-project-code',
        totalBudget: '/fund/budget-total',
        maxBudget: '/fund/budget-by-finyear-giatype',

        getProjectList: '/project/get-project-list',
        getMilestone: '/project/get-milestone-list-by-projectid',
        getBudgetByProject: '/project/get-total-fund-by-projectid',
        saveProjectAgencyMilestone: '/project/save-update-project-agency-milestone',
        getAllProjectMapById: '/project/project-agency-milestone-list-by-projectid',
        projectAlllookUpValue: '/cmn/get-all-lookup-value',
        getMilestoneByProjectId:'/project/get-milestone-list-by-projectid',
        

        getProjectAgencyMilestoneMapDetails:"/project/get-projagymlst-by-projectid-and-mlstnid",
        getBeneficiaryDetails:"/mst/get-beneficiary-list-by-districtid",
        saveUpdateAgencyMilestone:"/project/save-or-update-milestone-beneficiary",
        getBeneficiaryByIds:"/project/get-beneficiary-ids-by-id"

    },
    milesStone: {
        saveMilesStone: '/mst/save-n-update-milestone-details',
        getMilesStoneList: "/mst/get-milestone-list",
        editMilestone: '/mst/get-milestone-by-id',
        toggleMilestoneStatus: '/mst/toggle-status-milestone-by-milestoneid',
    },
    agency: {
        saveAgency: '/mst/manage-agency-bank-details',
        getAgencyDetails: '/mst/list-agency-bank-details',
        editAgency: '/mst/edit-agency-bank-details',
        toggleAgencyStatus: '/mst/active-inactive-agency-bank-details'
    },
    beneficiary: {
        saveBeneficiary: '/mst/save-n-update-beneficiary-details',
        getBeneficiaryDetails: '/mst/get-beneficiary-list',
        editBeneficiary: '/mst/get-beneficiary-by-id',
        toggleBeneficiaryStatus: '/mst/toggle-status-beneficiary-by-id'
    },
    sectorPage: {
        saveSector: '/mst/manage-sector-subsector',
        getAllSectorList: '/mst/list-sector-subsector',
        editSector: '/mst/edit-sector-subsector',
        toggleSectorStatus: '/mst/active-inactive-subsector'
    },
    vendor: {
        saveVendorDetails: '/mst/manage-vendor-bank-details',
        getVendorData: '/mst/list-vendor-bank-details',
        editVendor: '/mst/edit-vendor-bank-details',
        toggleVendorStatus: '/mst/active-inactive-vendor-bank-details'
    },
    sectorMilestoneMap: {
        saveSectorMilestoneMap: '/mst/save-n-update-sector-milestone-map',
        getMilestoneBySector: '/mst/get-milestones-by-sectorid'
    },
    umtEndpoints: {
        saveRole: '/admin/role/save',
        roleList: '/admin/role/list',
        toggleRoleStatus: '/is-active',
    }
}
export default endpoints 