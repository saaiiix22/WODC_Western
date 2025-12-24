export const routes = {
   // login: { path: "/login", label: "Login", protected: false },
   login: { path: "/", label: "Login", protected: false },

   dashboard: { path: "/dashboard", label: "Dashboard", protected: true },

   
   getDistrict:{path: "/get-district", label: "District Details", protected: true},
   block:{path: "/get-block", label: "Block Details", protected: true},
   gramPanchayat:{path: "/get-gp", label: "Gram Panchayat Details", protected: true},
   municipality:{path: "/get-municipality", label: "Municipality Details", protected: true},
   ward:{path: "/get-ward", label: "Ward Details", protected: true},
   village:{path: "/get-village", label: "Village Details", protected: true},
   constituencyPage:{path: "/get-constituency", label: "Constituency Details", protected: true},
   proposalPage:{path: "/get-proposal", label: "Proposal Details", protected: true},
   giaPage:{path: "/get-gia", label: "GIA Details", protected: true},
   budgetPage:{path: "/budget", label: "Budget Details", protected: true},
   editBudgetPage:{path: "/editbudget", label: "Edit Budget Details", protected: true},
   projectManagementPage:{path: "/project", label: "Project Details", protected: true},
   projectList:{path: "/project-list", label: "Project List", protected: true},
   milestone:{path: "/get-milestone", label: "Milestone Details", protected: true},
   agency:{path: "/get-agency", label: "Agency Details", protected: true},
   sectorPage:{path: "/get-sector", label: "Sector Details", protected: true},
   vendorPage:{path: "/get-vendor", label: "Vendor Details", protected: true},
   sectorMilestoneMapping:{path: "/get-sector-milestone", label: "Sector Milestone Mapping", protected: true},
   beneficiary:{path: "/get-beneficiary", label: "Beneficiary Details", protected: true},


   manageRole:{path: "/get-manage-user", label: "Manage Role", protected: true},
   roleAccess:{path: "/get-role-access", label: "Role Access To Levels", protected: true},
   addUser:{path: "/addUser", label: "Add User", protected: true},
   userProfile:{path: "/userProfile", label: "User Profile", protected: true},
   roleMenuMapping:{path: "/roleMenuMapping", label: "Role Menu Mapping", protected: true},
   configureAccess:{path: "/configureAccess", label: "Configure Accesss", protected: true},
   projectAgencyMilestone:{path: "/projectAgencyMilestoneMapping", label: "Project Agency Milestone Mapping", protected: true},
   workOrderGeneration:{path: "/workOrderGeneration", label: "Work Order Generation", protected: true},
   
   addBeneficiary:{path: "/addBeneficiary", label: "Add Beneficiary", protected: true},
   bankAccoutConfig:{path: "/bankAccoutConfig", label: "Bank Account Configuration", protected: true},
   fundReleaseInfo:{path: "/fundReleaseInfo", label: "Fund Release Information", protected: true},
   beneficiaryList:{path: "/beneficiaryList", label: "Beneficiary List", protected: true},
   ucSubmission:{path: "/ucSubmission", label: "UC Submission", protected: true},


}