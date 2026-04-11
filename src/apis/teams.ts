import type { AxiosResponse } from "axios";
import ENDPOINT from "@/constants/endpoint";
import type { ApiResponse } from "@/types/auth";
import type { CreateTeamRequest, CreateTeamResult, Team } from "@/types/team";
import { http } from "@/utils/http";

export const fetchTeams = async (): Promise<Team[]> => {
  const { data } = await http.get<ApiResponse<Team[]>>(ENDPOINT.TEAMS.LIST);
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
};

export const createTeam = async (
  payload: CreateTeamRequest,
): Promise<CreateTeamResult> => {
  const { data } = await http.post<
    CreateTeamRequest,
    AxiosResponse<ApiResponse<CreateTeamResult>>
  >(ENDPOINT.TEAMS.CREATE, payload);
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
};
