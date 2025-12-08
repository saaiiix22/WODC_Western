import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {isTokenValid} from '../utils/authUtils'

const ProtectedRoutes = () => {
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = token && isTokenValid(token);
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;