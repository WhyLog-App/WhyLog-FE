import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RootRedirect from "../components/routing/RootRedirect";
import { ROUTES } from "../constants/routes";
import AppLayout from "../layout/AppLayout";
import TeamLayout from "../layout/TeamLayout";
import {
  DecisionsPage,
  GitPage,
  HomePage,
  LoginPage,
  MeetingPage,
  MeetingRoutePage,
  NotFound,
  SettingsPage,
  SignupPage,
} from "../pages";

const allRoutes: RouteObject[] = [
  // 1. 루트 리다이렉트
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootRedirect />
      </ProtectedRoute>
    ),
  },

  // 2. 팀 기반 라우트 (nested)
  {
    path: "/team/:teamId",
    element: (
      <ProtectedRoute>
        <TeamLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "decisions",
        element: <DecisionsPage />,
      },
      {
        path: "meeting",
        element: <MeetingPage />,
      },
      {
        path: "meeting/:meetingId",
        element: <MeetingRoutePage />,
      },
      {
        path: "git",
        element: <GitPage />,
      },
    ],
  },

  // 3. 팀 독립적 라우트
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

  // 4. 인증 라우트
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <SignupPage />,
  },

  // 5. 404
  {
    path: "/*",
    element: <NotFound />,
  },
];

export default function Router() {
  const route = useRoutes(allRoutes);
  return route;
}
