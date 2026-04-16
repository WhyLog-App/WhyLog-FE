import { useParams } from "react-router-dom";
import { useTeams } from "@/components/sidebar/hooks/useTeams";

export const useCurrentTeam = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: teams } = useTeams();

  const teamIdNum = teamId ? Number(teamId) : null;
  const currentTeam = teams?.find((t) => t.team_id === teamIdNum) ?? null;

  return {
    teamId: teamIdNum,
    currentTeam,
    isLoading: !teams,
  };
};
