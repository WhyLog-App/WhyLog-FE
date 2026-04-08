import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { ROUTES } from "../constants/endpoint";
import App from "../pages/App";
import LoginPage from "../pages/login";
import NotFound from "../pages/notFound";

const allRoutes: RouteObject[] = [
  {
    path: ROUTES.APP_ROOT,
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: "/*",
    element: <NotFound />,
  },
];

export default function Router() {
  const route = useRoutes(allRoutes);
  return route;
}
