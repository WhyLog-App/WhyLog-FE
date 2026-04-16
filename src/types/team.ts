export interface CreateTeamRequest {
  name: string;
  // TODO: 백엔드 이미지 업로드 지원 시 추가
  // image?: File;
}

export interface CreateTeamResult {
  team_id: number;
  name: string;
  team_image?: string | null;
}

export interface Team {
  team_id: number;
  name: string;
  team_image: string | null;
}
