import { useEffect, useMemo } from "react";
import GitList from "./components/GitList";
import { useCurrentTeam } from "@/hooks/useCurrentTeam";
import { useGetRepositories } from "./hooks/useGetRepositories";
import { useGetRepositoryCommits } from "./hooks/useGetRepositoryCommits";
import { useParams, useNavigate } from "react-router-dom";
import { parseRouteId } from "@/utils/parseRouteId";
import { formatCommitDate } from "@/utils/date";
import type {
  GitCommitItem,
  GitRepositoryStats,
  RepositoryCommitItem,
} from "@/types/git";

const mapCommitItem = (commit: RepositoryCommitItem): GitCommitItem => {
  const hasConnectedApplication = commit.connected_application !== null;

  return {
    id: String(commit.commit_id),
    hash: commit.hash,
    message: commit.message,
    decisionText: commit.connected_application?.name ?? "",
    decisionType: hasConnectedApplication ? "success" : "neutral",
    authorName: commit.author_name,
    dateText: formatCommitDate(commit.date_time),
    changesAdded: commit.added_lines,
    changesRemoved: commit.deleted_lines,
  };
};

function GitPage() {
  const { teamId } = useCurrentTeam();
  const params = useParams<{ repositoryId?: string }>();
  const navigate = useNavigate();
  const { data: repositories = [] } = useGetRepositories(teamId);

  const routeRepositoryId = parseRouteId(params.repositoryId);

  useEffect(() => {
    if (!params.repositoryId && repositories.length > 0) {
      void navigate(`/team/${teamId}/git/${repositories[0].repository_id}`, {
        replace: true,
      });
    }
  }, [params.repositoryId, repositories, teamId, navigate]);

  const selectedRepository = useMemo(
    () =>
      repositories.find(
        (repository) => repository.repository_id === routeRepositoryId,
      ) ?? repositories[0],
    [repositories, routeRepositoryId],
  );

  const repositoryId = selectedRepository?.repository_id ?? null;

  const {
    data: commitPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetRepositoryCommits(repositoryId);

  const commits = useMemo(
    () =>
      commitPages?.pages.flatMap((page) =>
        page.commit_dtolist.map(mapCommitItem),
      ) ?? [],
    [commitPages],
  );

  const stats: GitRepositoryStats = useMemo(
    () => ({
      commits: commits.length,
      connected: commits.filter((commit) => commit.decisionType !== "neutral")
        .length,
      disconnected: commits.filter(
        (commit) => commit.decisionType === "neutral",
      ).length,
    }),
    [commits],
  );

  return (
    <div className="flex w-full flex-col py-[60px]">
      <GitList
        repositoryName={selectedRepository?.name ?? "Repository"}
        stats={stats}
        commits={commits}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => {
          void fetchNextPage();
        }}
      />
    </div>
  );
}

export default GitPage;
