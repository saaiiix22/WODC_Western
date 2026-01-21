import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoutes from "../components/ProtectedRoutes";
import { routes } from "./routeConfig";
import Loader from "../components/common/Loader";
import ChangePassword from "../pages/UMT/ChangePassword";
import AddWorkFlowConfig from "../pages/grievance/AddWorkFlowConfig";
import PublicRoute from "../components/PublicRoute";

/* AUTH */
const Login = lazy(() => import("../pages/auth/Login"));

/* DASHBOARD */
const Dashboard = lazy(() => import("../pages/Dashboard"));

/* DEMOGRAPHY */
const GetDistrict = lazy(() =>
  import("../pages/demography/district/GetDistrict")
);
const Block = lazy(() => import("../pages/demography/Block"));
const GramPanchayatPage = lazy(() =>
  import("../pages/demography/GramPanchayatPage")
);
const Municipality = lazy(() =>
  import("../pages/demography/Municipality")
);
const Ward = lazy(() => import("../pages/demography/Ward"));
const VillagePage = lazy(() =>
  import("../pages/demography/VillagePage")
);
const ConstituencyPage = lazy(() =>
  import("../pages/demography/ConstituencyPage")
);

/* PROJECT */
const ProjectList = lazy(() => import("../pages/project/ProjectList"));
const Project = lazy(() => import("../pages/project/Project"));
const ProjectAgencyMilestone = lazy(() =>
  import("../pages/project/ProjectAgencyMilestone")
);
const WorkOrderGeneration = lazy(() =>
  import("../pages/project/WorkOrderGeneration")
);
const FundReleaseInfo = lazy(() =>
  import("../pages/project/FundReleaseInfo")
);
const BeneficiaryList = lazy(() =>
  import("../pages/project/BeneficiaryList")
);
const UCsubmission = lazy(() =>
  import("../pages/project/UCsubmission")
);
const EntireProjectDetails = lazy(() =>
  import("../pages/project/EntireProjectDetails")
);

/* MASTER */
const Proposal = lazy(() => import("../pages/demography/Proposal"));
const GIApage = lazy(() => import("../pages/demography/GIApage"));
const Milestone = lazy(() => import("../pages/master/Milestone"));
const Agency = lazy(() => import("../pages/master/Agency"));
const SectorPage = lazy(() => import("../pages/master/SectorPage"));
const VendorPage = lazy(() => import("../pages/master/VendorPage"));
const Beneficiary = lazy(() => import("../pages/master/Beneficiary"));
const SectorMilestoneMapping = lazy(() =>
  import("../pages/master/SectorMilestoneMapping")
);
const BankAccountConfig = lazy(() =>
  import("../pages/master/BankAccountConfig")
);

/* BUDGET */
const BudgetDetails = lazy(() =>
  import("../pages/budget/BudgetDetails")
);
const EditBudget = lazy(() => import("../pages/budget/EditBudget"));

/* UMT */
const ManageRole = lazy(() => import("../pages/UMT/ManageRole"));
const RoleMenuMap = lazy(() => import("../pages/UMT/RoleMenuMap"));
const AccessRole = lazy(() => import("../pages/UMT/AccessRole"));
const AddUser = lazy(() => import("../pages/UMT/AddUser"));
const UserProfilePage = lazy(() =>
  import("../pages/UMT/UserProfilePage")
);
const ConfigureAccess = lazy(() =>
  import("../pages/UMT/ConfigureAccess")
);
const UserList = lazy(() =>
  import("../pages/UMT/UserList")
);

/* BENEFICIARY */
const AddBeneficiary = lazy(() =>
  import("../pages/beneficiary/AddBeneficiary")
);

const Inspection = lazy(() =>
  import("../pages/inspection/Inspection")
);


const InspectionCalender = lazy(() =>
  import("../pages/inspection/InspectionCalender")
);

const GisMain = lazy(() =>
  import("../pages/project/gisMap/gisMain/GisMain")
);

const WorkflowConfig = lazy(() =>
  import("../pages/workflow/WorkflowConfig")
);

const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<PublicRoute/>}>
          <Route element={<AuthLayout />}>
            <Route path={routes.login.path} element={<Login />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path={routes.dashboard.path} element={<Dashboard />} />

            <Route path={routes.getDistrict.path} element={<GetDistrict />} />
            <Route path={routes.block.path} element={<Block />} />
            <Route path={routes.gramPanchayat.path} element={<GramPanchayatPage />} />
            <Route path={routes.municipality.path} element={<Municipality />} />
            <Route path={routes.ward.path} element={<Ward />} />
            <Route path={routes.village.path} element={<VillagePage />} />
            <Route path={routes.constituencyPage.path} element={<ConstituencyPage />} />

            <Route path={routes.projectList.path} element={<ProjectList />} />
            <Route path={routes.projectManagementPage.path} element={<Project />} />
            <Route path={routes.projectAgencyMilestone.path} element={<ProjectAgencyMilestone />} />
            <Route path={routes.workOrderGeneration.path} element={<WorkOrderGeneration />} />
            <Route path={routes.fundReleaseInfo.path} element={<FundReleaseInfo />} />
            <Route path={routes.beneficiaryList.path} element={<BeneficiaryList />} />
            <Route path={routes.ucSubmission.path} element={<UCsubmission />} />
            <Route path={routes.EntireProjectDetails.path} element={<EntireProjectDetails />} />

            <Route path={routes.proposalPage.path} element={<Proposal />} />
            <Route path={routes.giaPage.path} element={<GIApage />} />

            <Route path={routes.milestone.path} element={<Milestone />} />
            <Route path={routes.agency.path} element={<Agency />} />
            <Route path={routes.sectorPage.path} element={<SectorPage />} />
            <Route path={routes.vendorPage.path} element={<VendorPage />} />
            <Route path={routes.beneficiary.path} element={<Beneficiary />} />
            <Route path={routes.sectorMilestoneMapping.path} element={<SectorMilestoneMapping />} />
            <Route path={routes.bankAccoutConfig.path} element={<BankAccountConfig />} />

            <Route path={routes.budgetPage.path} element={<BudgetDetails />} />
            <Route path={routes.editBudgetPage.path} element={<EditBudget />} />

            <Route path={routes.manageRole.path} element={<ManageRole />} />
            <Route path={routes.roleMenuMapping.path} element={<RoleMenuMap />} />
            <Route path={routes.roleAccess.path} element={<AccessRole />} />
            <Route path={routes.addUser.path} element={<AddUser />} />
            <Route path={routes.userProfile.path} element={<UserProfilePage />} />
            <Route path={routes.configureAccess.path} element={<ConfigureAccess />} />
            <Route path={routes.userList.path} element={<UserList />} />
            <Route path={routes.changePassword.path} element={<ChangePassword />} />



            <Route path={routes.addBeneficiary.path} element={<AddBeneficiary />} />
            <Route path={routes.inspection.path} element={<Inspection />} />
            <Route path={routes.inspectionCalender.path} element={<InspectionCalender />} />
            {/* GRIEVANCE */}
            <Route path={routes.addWorkConfig.path} element={<AddWorkFlowConfig />} />
            <Route path={routes.gisMap.path} element={<GisMain />} />

           <Route path={routes.workflowConfig.path} element={<WorkflowConfig  />} />

          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
