import ENDPOINT from "@/constants/endpoint";
import type { ApiResponse } from "@/types/auth";
import type { CreateTeamRequest, CreateTeamResult } from "@/types/team";
import { http } from "@/utils/http";

export const createTeam = async (
  payload: CreateTeamRequest,
): Promise<CreateTeamResult> => {
  const { data } = await http.post<
    CreateTeamRequest,
    { data: ApiResponse<CreateTeamResult> }
  >(ENDPOINT.TEAMS.CREATE, payload);
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
};
