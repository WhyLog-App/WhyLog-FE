import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentTeam } from "@/hooks/useCurrentTeam";
import { useGetRepositories } from "./hooks/useGetRepositories";
import { parseRouteId } from "@/utils/parseRouteId";
import GlassCard from "@/pages/decisions/components/GlassCard";
import CommitHeader from "./components/CommitHeader";
import CommitFileList from "./components/CommitFileList";
import CommitMeta from "./components/CommitMeta";
import { useGetCommitDetail } from "./hooks/useGetCommitDetail";
import { mapCommitDetail } from "./mapCommitDetail";

const CommitDetailPage = () => {
  const { teamId } = useCurrentTeam();
  const params = useParams<{ repositoryId?: string; commitHash?: string }>();
  const navigate = useNavigate();

  const repositoryId = parseRouteId(params.repositoryId);
  const { data: repositories = [] } = useGetRepositories(teamId);
  const selectedRepository = useMemo(
    () => repositories.find((repository) => repository.repository_id === repositoryId),
    [repositoryId, repositories],
  );

  useEffect(() => {
    if (repositories.length > 0 && !selectedRepository) {
      void navigate(`/team/${teamId}/git`, { replace: true });
    }
  }, [repositories, selectedRepository, navigate, teamId]);

  const { data: commitDetailData } = useGetCommitDetail(
    selectedRepository?.repository_id ?? null,
    params.commitHash,
  );

  const detail = useMemo(
    () =>
      mapCommitDetail(
        selectedRepository?.name ?? "Repository",
        commitDetailData,
        params.commitHash ?? "",
      ),
    [commitDetailData, params.commitHash, selectedRepository?.name],
  );

  const goBack = () => {
    if (selectedRepository?.repository_id) {
      void navigate(`/team/${teamId}/git/${selectedRepository.repository_id}`);
      return;
    }
    void navigate(`/team/${teamId}/git`);
  };

  return (
    <div className="flex w-full flex-col py-[60px]">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-5">
        <div className="flex flex-col gap-5">
          <CommitHeader detail={detail} onBack={goBack} />
          <CommitMeta detail={detail} />
        </div>

        <GlassCard className="gap-5 px-5 py-7">
          <p className="typo-caption1 text-(--color-text-secondary)">
            변경된 파일
          </p>

          <CommitFileList files={detail.files} />
        </GlassCard>
      </div>
    </div>
  );
};

export default CommitDetailPage;
