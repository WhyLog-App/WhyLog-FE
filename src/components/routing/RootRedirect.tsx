import { Navigate } from "react-router-dom";
import { useTeams } from "@/components/sidebar/hooks/useTeams";

const RootRedirect = () => {
  const { data: teams, isLoading } = useTeams();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return <Navigate to="/onboarding/create-team" replace />;
  }

  return <Navigate to={`/team/${teams[0].team_id}`} replace />;
};

export default RootRedirect;
