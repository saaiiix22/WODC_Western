import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";


const MenuProtectedRoutes = () => {
  const { menuData, isLoading } = useSelector(state => state.menu);
  const location = useLocation();

 
  

  const isRouteAllowed = (menus, path) => {
    return menus?.some(menu =>
      (menu?.link && menu.link !== "#" && menu.link === path) ||
      menu?.subMenu?.some(sub => sub?.link === path)
    );
  };



  if (isLoading || !menuData.length) {
    return null;
  }

  const allowed = isRouteAllowed(menuData, location.pathname);

  if (!allowed) {
    return <Navigate to="/error" replace />;
  }

  return <Outlet />;
};

export default MenuProtectedRoutes;
