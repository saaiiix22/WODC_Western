const endpoints = {
    auth: {
        login: '/login',
        logout: '/logout',
    },
    menu: {
        getMenuList: '/admin/menu/list',
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
        constituencyTypeList: '/cmn/get-all-constituencies-type-list',
        constituencyListByType: '/cmn/get-constituency-list-by-constituency-type',
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

        getUpdatedBankList: '/mst/get-distinct-bank-list',
        getBankConfigByBankId: '/mst/get-bankconfig-list-by-bankid'
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
        // maxBudget: '/fund/budget-by-finyear-giatype',
        maxBudget: '/fund/budget-by-giatypeyear-bankconfig-ids',


        getProjectList: '/project/get-project-list',
        getMilestone: '/project/get-milestone-list-by-projectid',
        getBudgetByProject: '/project/get-total-fund-by-projectid',
        saveProjectAgencyMilestone: '/project/save-update-project-agency-milestone',
        getAllProjectMapById: '/project/project-agency-milestone-list-by-projectid',
        projectAlllookUpValue: '/cmn/get-all-lookup-value',
        getMilestoneByProjectId: '/project/get-milestone-list-by-projectid',


        getProjectAgencyMilestoneMapDetails: "/project/get-projagymlst-by-projectid-and-mlstnid",
        // getBeneficiaryDetails:"/mst/get-beneficiary-list-by-districtid",
        getBeneficiaryDetails: "/mst/get-beneficiary-list",
        saveUpdateAgencyMilestone: "/project/save-or-update-milestone-beneficiary",
        saveBeneficaryByExcel: "/excel/save-benefic-temp-data-by-excel",
        saveTempBenList: "/excel/save-or-update-temp-beneficiary-list",


        getBeneficiaryByIds: "/project/get-beneficiary-ids-by-id",
        getProjectByFinYear: "/project/get-project-list-by-finyear",
        getUpdatedFuncDetails: "/fund/bank-by-finyear-giatype",
        getBankConfigProject: "/fund/bank-config-by-finyear-giatype-bankid",


        getTemplateFile: "/excel/download-beneficiary-template",
        getEntireProjectDetails: '/project/get-all-details-by-projectid'

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
    bankAccounConfigEndpoints: {
        saveBankAccountConfig: '/mst/save-or-update-bank-config',
        getBankList: '/mst/get-bank-config-list',
        editBankDetails: '/mst/get-bankconfig-by-bankconfigid',
        toggleBankStatus: '/mst/toggle-bankconfig-status-by-bankconfigid'
    },
    wordOrderGeneration: {
        saveWorkOrder: '/order/save-or-update-work-order',
        getDetailsByProjectAndMilestoneId: '/project/get-all-details-by-projectid-and-mlstnid',
        getAllWorkOrderData: '/order/get-work-order-list'
    },
    fundReleaseInfo: {
        getCompleteMilestone: "/project/get-cmplmilestone-list-by-projectid",
        saveFundReleasInfo: "/order/save-or-update-fund-release-info"
    },
    ucSubmission: {
        getUCdetails: "/project/get-uc-details-by-projectid-and-mlstnid",
        saveUCdetails: "/order/save-or-update-uc-details-info"
    },
    umtEndpoints: {

        saveRole: '/admin/role/save',
        editViewRole: '/admin/role/edit',
        roleList: '/admin/role/list',
        toggleRoleStatus: '/admin/role/is-active',
        getRoleInfo: "/admin/role/roleLevelMap",

        saveUser: '/save',
        // userList:"/get-all-users",
        userList: "/user/list",
        saveRoleLevelMap: "/admin/role/roleLevelMap/addNupdate",
        editUser: '/user/edit',
        toggleUserStatus: '/user/is-active',

        userSearch: '/admin/user/search',
        roleConfigList: '/admin/role/byUser',
        getAccessLevelConfig: '/admin/acl/byRole',
        getConfigList: "admin/acl/config/list",
        saveConfigAccess: "/admin/acl/config/save",

        getProfileInfo: "/user/profile",
        saveProfile: '/update/user/profile',
        checkOldPassword: "/user/check-password",
        changePassword: "/change/password",


        getAllRoles: "/admin/role/list",
        getAllMenu: "/admin/menu/get-menus-for-role-map",
        saveRoleMenuMap: "/admin/menu/role-menu-map"
    },
    inspection: {
        saveInspection: "/inspection-scheduling/save-or-update-inspection-scheduling",
        updateInspection: "/inspection-scheduling/get-inspection-scheduling-by-id",
        getAllInspection: "/inspection-scheduling/get-inspection-scheduling-list",
        getAllInspectionByCategory: "/inspection-scheduling/get-inspection-scheduling-list-by-iscomplete",
    },

    workflow: {
        moduleList: "/workflow/workflow-module-list",
        actionTypeList: "/workflow/workflow-action-list",
        statusList: "/workflow/workflow-status-list",
        stageForwardedRuleListByModule: "/workflow/stage-forwarded-rule-list-by-module",
        saveOrUpdateWorkflow: "/workflow/save-or-update-workflow",
    },

    gisdata: {
        gisProjectData: "/dashboard/get-gis-projects-overview",
        gisFyear: "/mst/get-financial-year-list",
        gisMapPinIcon: "/cmn/get-base64-from-path",
    },

    judictionMapConfig: {
        judictionMapConfigList: "/cmn/get-all-judiction-list",
        getDistrictListByConstituencyType: "/cmn/get-district-list-by-constituency-id",
        getConstituencyName: "/cmn/get-constituency-list-by-constituency-type",
        saveDistConsMap: '/mst/save-or-update-constituency-district-mapping',

        saveJurisdictionConfig: "/mst/save-or-update-judiction-configuration",
        getJurisdictionConfigByConsId:'/mst/get-jurisdiction-configuration-by-constituency-id'

    }
}
export default endpoints 