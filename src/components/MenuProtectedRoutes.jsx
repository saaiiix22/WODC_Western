import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const MenuProtectedRoutes = () => {
  const { allPaths, isLoading } = useSelector(state => state.menu);
  
  const location = useLocation();

  if (isLoading || !allPaths.length) {
    return null;
  }

  const basePath = location.pathname
  // console.log(basePath);


  const allowed = allPaths.includes(basePath);

  if (!allowed) {
    return <Navigate to="/error" replace />;
  }

  return <Outlet />;
};

export default MenuProtectedRoutes;
