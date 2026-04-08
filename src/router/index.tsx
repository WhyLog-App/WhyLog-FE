import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { ROUTES } from "../constants/endpoint";
import App from "../pages/App";
import LoginPage from "../pages/login";
import NotFound from "../pages/notFound";

const allRoutes: RouteObject[] = [
  {
    path: ROUTES.APP_ROOT,
    element: <App />,
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
