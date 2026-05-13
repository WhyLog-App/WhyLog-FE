import ENDPOINT from "@/constants/endpoint";
import type {
  ApplicationConnectedCommitsResult,
  ApplicationDetail,
  ApplicationRecommendedCommit,
} from "@/types/application";
import type { ApiResponse } from "@/types/auth";
import { http } from "@/utils/http";

export const getApplicationDetail = async (
  applicationId: number,
): Promise<ApplicationDetail> => {
  const { data } = await http.get<
    unknown,
    { data: ApiResponse<ApplicationDetail> }
  >(ENDPOINT.APPLICATIONS.DETAIL(applicationId));
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
};

export const getRecommendedCommits = async (
  applicationId: number,
): Promise<ApplicationRecommendedCommit[]> => {
  const { data } = await http.get<
    unknown,
    { data: ApiResponse<ApplicationRecommendedCommit[]> }
  >(ENDPOINT.APPLICATIONS.RECOMMENDED_COMMITS(applicationId));
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
};

export const getConnectedCommits = async (
  applicationId: number,
): Promise<ApplicationConnectedCommitsResult> => {
  const { data } = await http.get<
    unknown,
    { data: ApiResponse<ApplicationConnectedCommitsResult> }
  >(ENDPOINT.APPLICATIONS.CONNECTED_COMMITS(applicationId));
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
};
