import { Navigate, Outlet } from "react-router-dom";

const isLoggedIn = () => {
  return Boolean(localStorage.getItem("isLoggedIn") || localStorage.getItem("user") || localStorage.getItem("token"));
};

export const PublicRoute = () => {
  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
