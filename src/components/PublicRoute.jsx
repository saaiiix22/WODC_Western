import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { isTokenValid } from "../utils/authUtils";

const PublicRoute = () => {
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = token && isTokenValid(token);

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
