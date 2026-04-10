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
  TEAMS: {
    LIST: `${API_BASE_URL}/api/teams`,
    CREATE: `${API_BASE_URL}/api/teams`,
  },
  MEETINGS: {
    CREATE: (teamId: number) => `${API_BASE_URL}/api/teams/${teamId}/meetings`,
    LIST: (teamId: number) => `${API_BASE_URL}/api/teams/${teamId}/meetings`,
    DETAIL: (meetingId: number) => `${API_BASE_URL}/api/meetings/${meetingId}`,
    RTC_TOKEN: (meetingId: number) =>
      `${API_BASE_URL}/api/meetings/${meetingId}/rtc-token`,
    END: (meetingId: number) => `${API_BASE_URL}/api/meetings/${meetingId}/end`,
  },
} as const;

export const WS_BASE_URL = API_BASE_URL.replace(/^http/i, "ws");

export default ENDPOINT;
