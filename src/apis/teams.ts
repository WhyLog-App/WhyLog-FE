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
  const formData = new FormData();

  const requestBlob = new Blob([JSON.stringify({ name: payload.name })], {
    type: "application/json",
  });
  formData.append("request", requestBlob);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const { data } = await http.post<
    FormData,
    AxiosResponse<ApiResponse<CreateTeamResult>>
  >(ENDPOINT.TEAMS.CREATE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
};
