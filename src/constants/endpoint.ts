const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);

const ENDPOINT = {
  TEST: `${API_BASE_URL}/test`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh-token`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  TEAMS: {
    LIST: `${API_BASE_URL}/api/members/teams`,
    CREATE: `${API_BASE_URL}/api/teams`,
    INVITE: (teamId: number) =>
      `${API_BASE_URL}/api/teams/${teamId}/invitations`,
  },
  MEMBERS: {
    PROFILE_IMAGE: `${API_BASE_URL}/api/members/profile-image`,
  },
  MEETINGS: {
    CREATE: (teamId: number) => `${API_BASE_URL}/api/teams/${teamId}/meetings`,
    LIST: (teamId: number) => `${API_BASE_URL}/api/teams/${teamId}/meetings`,
    DETAIL: (meetingId: number) => `${API_BASE_URL}/api/meetings/${meetingId}`,
    RTC_TOKEN: (meetingId: number) =>
      `${API_BASE_URL}/api/meetings/${meetingId}/rtc-token`,
    END: (meetingId: number) => `${API_BASE_URL}/api/meetings/${meetingId}/end`,
    ANALYSIS: (meetingId: number) =>
      `${API_BASE_URL}/api/meetings/${meetingId}/analysis`,
    AUDIO: (meetingId: number) =>
      `${API_BASE_URL}/api/meetings/${meetingId}/audio`,
    HISTORY: (meetingId: number) =>
      `${API_BASE_URL}/api/meetings/${meetingId}/history`,
  },
} as const;

export const WS_BASE_URL = API_BASE_URL.replace(/^http/i, "ws");

export default ENDPOINT;
