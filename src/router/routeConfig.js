export const routes = {
   // login: { path: "/login", label: "Login", protected: false },
   login: { path: "/", label: "Login", protected: false },

   dashboard: { path: "/dashboard", label: "Dashboard", protected: true },


   getDistrict: { path: "/get-district", label: "District Details", protected: true },
   block: { path: "/get-block", label: "Block Details", protected: true },
   gramPanchayat: { path: "/get-gp", label: "Gram Panchayat Details", protected: true },
   municipality: { path: "/get-municipality", label: "Municipality Details", protected: true },
   ward: { path: "/get-ward", label: "Ward Details", protected: true },
   village: { path: "/get-village", label: "Village Details", protected: true },
   constituencyPage: { path: "/get-constituency", label: "Constituency Details", protected: true },
   proposalPage: { path: "/get-proposal", label: "Proposal Details", protected: true },
   giaPage: { path: "/get-gia", label: "GIA Details", protected: true },
   budgetPage: { path: "/budget", label: "Budget Details", protected: true },
   editBudgetPage: { path: "/editbudget", label: "Edit Budget Details", protected: true },
   projectManagementPage: { path: "/project", label: "Project Details", protected: true },
   EntireProjectDetails: { path: "/entireProjectDetails", label: "Entire Project Details", protected: true },
   projectList: { path: "/project-list", label: "Project List", protected: true },
   milestone: { path: "/get-milestone", label: "Milestone Details", protected: true },
   agency: { path: "/get-agency", label: "Agency Details", protected: true },
   sectorPage: { path: "/get-sector", label: "Sector Details", protected: true },
   vendorPage: { path: "/get-vendor", label: "Vendor Details", protected: true },
   sectorMilestoneMapping: { path: "/get-sector-milestone", label: "Sector Milestone Mapping", protected: true },
   beneficiary: { path: "/get-beneficiary", label: "Beneficiary Details", protected: true },
   judictionMapConfiguration: { path: "/jurisdictionMapConfiguration", label: "Judiction Map Configuration", protected: true },
   districtConstituencyMap: { path: "/districtConstituencyMap", label: "Distrcit Constituency Map", protected: true },

   head: { path: "/head", label: "Head", protected: true },
   subhead: { path: "/subhead", label: "Sub Head", protected: true },



   manageRole: { path: "/get-manage-user", label: "Manage Role", protected: true },
   roleAccess: { path: "/get-role-access", label: "Role Access To Levels", protected: true },
   addUser: { path: "/addUser", label: "Add User", protected: true },
   userProfile: { path: "/userProfile", label: "User Profile", protected: true },
   roleMenuMapping: { path: "/roleMenuMapping", label: "Role Menu Mapping", protected: true },
   userList: { path: "/userList", label: "User List", protected: true },
   changePassword: { path: "/changePassword", label: "Change Password", protected: true },
   configureAccess: { path: "/configureAccess", label: "Configure Accesss", protected: true },
   projectAgencyMilestone: { path: "/projectAgencyMilestoneMapping", label: "Project Agency Milestone Mapping", protected: true },
   projectAgencyMilestoneList: { path: "/projectAgencyMilestoneList", label: "Project Agency Milestone List", protected: true },
   workOrderGeneration: { path: "/workOrderGeneration", label: "Work Order Generation", protected: true },

   addBeneficiary: { path: "/addBeneficiary", label: "Add Beneficiary", protected: true },
   bankAccoutConfig: { path: "/bankAccoutConfig", label: "Bank Account Configuration", protected: true },
   fundReleaseInfo: { path: "/fundReleaseInfo", label: "Fund Release Information", protected: true },
   beneficiaryList: { path: "/beneficiaryList", label: "Beneficiary List", protected: true },
   ucSubmission: { path: "/ucSubmission", label: "UC Submission", protected: true },

   inspection: { path: "/inspection", label: "Inspection", protected: true },
   inspectionCalender: { path: "/inspection-calendar", label: "Inspection Calender", protected: true },

   // GRIEVANCE
   addWorkConfig: { path: "/addWorkConfig", label: "Add Work Config", protected: true },
   gisMap: { path: "/project/gis/map", label: "Gis Map", protected: true },


   // Workflow
   workflowConfig: { path: "/get-workflow-config", label: "Workflow Config Page", protected: true },

   grievanceCategory: { path: "/grievanceCategory", label: "Grievance Category", protected: true },
   grievanceSubCategory: { path: "/grievanceSubCategory", label: "Grievance Sub-Category", protected: true },
   grievanceSlotConfiguration: { path: "/grievanceSlotConfiguration", label: "Grievance Slot Configuration", protected: true },
   addGrievance: { path: "/addGrievance/:id?", lebel: "Add-Grievance", protected: true },
   grievanceList: { path: "/grievanceList", lebel: "Grievance List", protected: true },

   grievanceRequestList: { path: "/grievanceRequestList", lebel: "Grievance Requested List", protected: true },
   addWorkFlowConfiguration: { path: "/addWorkFlowConfiguration", lebel: "Add WorkFlow ", protected: true },
   virtualGrievanceHearing: { path: "/virtualGrievanceHearing", lebel: "Virtual Grievance Hearing ", protected: true },

   virtualGrievanceHearingList:{path:"/grievanceHearingList",lebel:"Virtual Grievance Hearing  List",protected:true},

   assetTypeMaster: { path: "/assetTypeMaster", label: "Asset Type Master", protected: true },
   assetCategoryMaster: { path: "/assetCategoryMaster", label: "Asset Category Master", protected: true },
   viewAsset: { path: "/viewAssets", label: "View Asset", protected: true },
   createAsset: { path: "/createAsset", label: "Create Asset", protected: true },
   importExportAsset: { path: "/importExportAsset", label: "Import Export Asset", protected: true },


   addFeedbackType: { path: "/addFeedbackType", label: "Add Feedback Type", protected: true },
   addFeedbackQuestions: { path: "/addFeedbackQuestions", label: "Add Feedback Questions", protected: true },
   addFeedback: { path: "/addFeedback", label: "Add Feedback", protected: true },
   benificiaryWorkEntry :{ path: "/benificiaryWorkEntry", label: "Benificiary Work Entry", protected: true },
   feedbackListByStatus: { path: "/feedbackListByStatus", label: "Feedback List By Status", protected: true },
   performanceMonitoringSystem: { path: "/performanceMonitoringSystem", label: "Performance Monitoring System", protected: true },
   inspectionDetailsReport: { path: "/inspectionDetailsReport", label: "Inspection Details Report", protected: true },
   districtPerformanceRankings: { path: "/districtPerformanceRankings", label: "District Performance Rankings", protected: true },
   fundreconciliationreport: { path: "/fundReconciliationReport", label: "Fund Reconciliation Report", protected: true },
   benificiaryPayment: { path: "/benificiaryPayment", label: "Benificiary Payment", protected: true },


   myFilesDMS: { path: "/myFilesDMS", label: "My Files Tab DMS", protected: true },
   fileTabDMS: { path: "/fileTabDMS", label: "File Tab DMS", protected: true },

}