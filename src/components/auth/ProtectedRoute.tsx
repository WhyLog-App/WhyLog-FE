import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/endpoint";

interface ProtectedRouteProps {
  children: ReactElement;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
