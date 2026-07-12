import { Navigate, Outlet } from "react-router-dom";

const isLoggedIn = () => {
  return Boolean(localStorage.getItem("isLoggedIn") || localStorage.getItem("user") || localStorage.getItem("token"));
};

export const ProtectedRoute = () => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
