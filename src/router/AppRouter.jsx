import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { routes } from "./routeConfig";
import ProtectedRoutes from "../components/ProtectedRoutes";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../layouts/MainLayout";
import GetDistrict from "../pages/demography/district/GetDistrict";
import Block from "../pages/demography/Block";
import GramPanchayatPage from "../pages/demography/GramPanchayatPage";
import Municipality from "../pages/demography/Municipality";
import Ward from "../pages/demography/Ward";
import VillagePage from "../pages/demography/VillagePage";
import ConstituencyPage from "../pages/demography/ConstituencyPage";
import Proposal from "../pages/demography/Proposal";
import BudgetDetails from "../pages/budget/BudgetDetails";
import GIApage from "../pages/demography/GIApage";
import EditBudget from "../pages/budget/EditBudget";
import Project from "../pages/project/Project";
import ProjectList from "../pages/project/ProjectList";
import Milestone from "../pages/master/Milestone";
import Agency from "../pages/master/Agency";
import SectorPage from "../pages/master/SectorPage";
import VendorPage from "../pages/master/VendorPage";
import SectorMilestoneMapping from "../pages/master/SectorMilestoneMapping";
import ManageRole from "../pages/UMT/ManageRole";
import AccessRole from "../pages/UMT/AccessRole";
import AddUser from "../pages/UMT/AddUser";
import UserProfilePage from "../pages/UMT/UserProfilePage";
import Beneficiary from "../pages/master/Beneficiary";
import RoleMenuMap from "../pages/UMT/RoleMenuMap";
import ProjectAgencyMilestone from "../pages/project/ProjectAgencyMilestone";

const AppRouter = () => {
  return (
    <div>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={routes.login.path} element={<Login />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path={routes.dashboard.path} element={<Dashboard />} />

            {/* DEOGRAPHY */}
            <Route path={routes.getDistrict.path} element={<GetDistrict />} />
            <Route path={routes.block.path} element={<Block />} />
            <Route path={routes.gramPanchayat.path} element={<GramPanchayatPage />} />
            <Route path={routes.municipality.path} element={<Municipality />} />
            <Route path={routes.ward.path} element={<Ward />} />
            <Route path={routes.village.path} element={<VillagePage />} />
            <Route path={routes.constituencyPage.path} element={<ConstituencyPage />} />

            {/* PROJECT  */}
            <Route path={routes.projectList.path} element={<ProjectList />} />
            <Route path={routes.projectManagementPage.path} element={<Project />} />
            <Route path={routes.projectAgencyMilestone.path} element={<ProjectAgencyMilestone />} />

            {/* MASTER */}
            <Route path={routes.proposalPage.path} element={<Proposal />} />
            <Route path={routes.giaPage.path} element={<GIApage />} />
            <Route path={routes.milestone.path} element={<Milestone />} />
            <Route path={routes.agency.path} element={<Agency />} />
            <Route path={routes.sectorPage.path} element={<SectorPage />} />
            <Route path={routes.vendorPage.path} element={<VendorPage />} />
            <Route path={routes.beneficiary.path} element={<Beneficiary/>} />
            <Route path={routes.sectorMilestoneMapping.path} element={<SectorMilestoneMapping />} />
            
            {/* BUDGET */}
            <Route path={routes.budgetPage.path} element={<BudgetDetails />} />
            <Route path={routes.editBudgetPage.path} element={<EditBudget />} />
            
            {/* UMT - USER MANAGEMENT */}
            <Route path={routes.manageRole.path} element={<ManageRole />} />
            <Route path={routes.roleMenuMapping.path} element={<RoleMenuMap/>} />
            <Route path={routes.roleAccess.path} element={<AccessRole />} />
            <Route path={routes.addUser.path} element={<AddUser />} />
            <Route path={routes.userProfile.path} element={<UserProfilePage />} />


          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default AppRouter;
