import type { AxiosResponse } from "axios";
import ENDPOINT from "@/constants/endpoint";
import type { ApiResponse } from "@/types/auth";
import type {
  GitHubTokenRequest,
  GitHubTokenResult,
  AddRepositoryRequest,
  AddRepositoryResult,
  CheckGitHubTokenStatusResult,
  RepositoryItem,
} from "@/types/git";
import { http } from "@/utils/http";

export const registerGitHubToken = async (
  token: string,
): Promise<GitHubTokenResult> => {
  const payload: GitHubTokenRequest = {
    access_token: token,
  };

  const { data } = await http.post<
    GitHubTokenRequest,
    AxiosResponse<ApiResponse<GitHubTokenResult>>
  >(ENDPOINT.GIT.GITHUB_TOKEN, payload);

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
};

export const addRepository = async (
  teamId: number,
  payload: AddRepositoryRequest,
): Promise<AddRepositoryResult> => {
  const { data } = await http.post<
    AddRepositoryRequest,
    AxiosResponse<ApiResponse<AddRepositoryResult>>
  >(ENDPOINT.TEAMS.REPOSITORIES(teamId), payload);

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
};

export const checkGitHubTokenStatus =
  async (): Promise<CheckGitHubTokenStatusResult> => {
    const { data } = await http.get<
      void,
      AxiosResponse<ApiResponse<CheckGitHubTokenStatusResult>>
    >(ENDPOINT.GIT.GITHUB_TOKEN_STATUS);

    if (!data.isSuccess) {
      throw new Error(data.message);
    }

    return data.result;
  };

export const getRepositories = async (
  teamId: number,
): Promise<RepositoryItem[]> => {
  const { data } = await http.get<
    void,
    AxiosResponse<ApiResponse<RepositoryItem[]>>
  >(ENDPOINT.TEAMS.REPOSITORIES(teamId));

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
};
