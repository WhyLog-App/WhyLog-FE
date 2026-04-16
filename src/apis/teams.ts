import type { AxiosResponse } from "axios";
import ENDPOINT from "@/constants/endpoint";
import type { ApiResponse } from "@/types/auth";
import type { CreateTeamResult, Team } from "@/types/team";
import { http } from "@/utils/http";

export const fetchTeams = async (): Promise<Team[]> => {
  const { data } = await http.get<ApiResponse<Team[]>>(ENDPOINT.TEAMS.LIST);
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
};

export const createTeam = async (
  name: string,
  image?: File,
): Promise<CreateTeamResult> => {
  const formData = new FormData();

  const requestBlob = new Blob([JSON.stringify({ name })], {
    type: "application/json",
  });
  formData.append("request", requestBlob);

  // image part: 이미지가 있을 때만 추가
  if (image) {
    formData.append("image", image);
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
