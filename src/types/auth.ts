export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type UserRole = "ROLE_USER" | "ROLE_ADMIN" | string;

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  memberId: number;
  email: string;
  role: UserRole;
}

export interface RefreshTokenResult {
  accessToken: string;
}
