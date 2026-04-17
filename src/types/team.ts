export interface CreateTeamRequest {
  name: string;
  image?: File;
}

export interface CreateTeamResult {
  team_id: number;
  name: string;
  team_image?: string | null;
  image_url?: string | null;
}

export interface Team {
  team_id: number;
  name: string;
  team_image: string | null;
}
