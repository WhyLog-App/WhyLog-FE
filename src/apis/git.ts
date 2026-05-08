import type { AxiosResponse } from "axios";
import ENDPOINT from "@/constants/endpoint";
import type { ApiResponse } from "@/types/auth";
import type { GitHubTokenRequest, GitHubTokenResult } from "@/types/git";
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
