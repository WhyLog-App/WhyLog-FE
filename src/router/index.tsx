import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { ROUTES } from "../constants/endpoint";
import AppLayout from "../layout/AppLayout";
import DecisionsPage from "../pages/decisions";
import GitPage from "../pages/git";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import MeetingPage from "../pages/meeting";
import InProgressPage from "../pages/meeting/InProgressPage";
import NotFound from "../pages/notFound";
import SettingsPage from "../pages/settings";

const allRoutes: RouteObject[] = [
  {
    path: ROUTES.APP_ROOT,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <HomePage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DECISIONS,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <DecisionsPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MEETING,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <MeetingPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MEETING_DETAIL,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <InProgressPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.GIT,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <GitPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <SettingsPage />
        </AppLayout>
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
