import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/endpoint";

interface ProtectedRouteProps {
  children: ReactElement;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

export default ProtectedRoute;
