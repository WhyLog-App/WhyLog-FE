import ENDPOINT from "@/constants/endpoint";
import type {
  ApiResponse,
  LoginRequest,
  LoginResult,
  RefreshTokenResult,
} from "@/types/auth";
import { http } from "@/utils/http";

export const login = async (payload: LoginRequest): Promise<LoginResult> => {
  const { data } = await http.post<
    LoginRequest,
    { data: ApiResponse<LoginResult> }
  >(ENDPOINT.AUTH.LOGIN, payload);
  return data.result;
};

export const refreshAccessToken = async (): Promise<string> => {
  const { data } = await http.post<
    undefined,
    { data: ApiResponse<RefreshTokenResult> }
  >(ENDPOINT.AUTH.REFRESH_TOKEN);
  return data.result.access_token;
};

export const logout = async (): Promise<void> => {
  await http.post(ENDPOINT.AUTH.LOGOUT);
};
