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
  access_token: string;
  refresh_token: string;
  member_id: number;
  email: string;
  role: UserRole;
}

export interface RefreshTokenResult {
  access_token: string;
}
