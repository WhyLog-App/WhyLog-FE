const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);

const ENDPOINT = {
  TEST: `${API_BASE_URL}/test`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh-token`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
} as const;

export const ROUTES = {
  APP_ROOT: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  MEETING: "/meeting",
  MEETING_DETAIL: "/meeting/:meetingId",
} as const;

export default ENDPOINT;
