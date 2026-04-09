import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { ROUTES } from "../constants/routes";
import AppLayout from "../layout/AppLayout";
import {
  DecisionsPage,
  GitPage,
  HomePage,
  InProgressPage,
  LoginPage,
  MeetingPage,
  NotFound,
  SettingsPage,
  SignupPage,
} from "../pages";

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
    path: ROUTES.SIGNUP,
    element: <SignupPage />,
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
