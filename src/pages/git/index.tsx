import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmptyStateCard from "@/components/common/EmptyStateCard";
import { useCurrentTeam } from "@/hooks/useCurrentTeam";
import type {
  GitCommitItem,
  GitRepositoryStats,
  RepositoryCommitItem,
} from "@/types/git";
import { formatCommitDate } from "@/utils/date";
import { parseRouteId } from "@/utils/parseRouteId";
import GitList from "./components/GitList";
import { useGetRepositories } from "./hooks/useGetRepositories";
import { useGetRepositoryCommits } from "./hooks/useGetRepositoryCommits";

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

  const selectedRepository = useMemo(
    () =>
      repositories.find(
        (repository) => repository.repository_id === routeRepositoryId,
      ),
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

  if (!repositoryId) {
    return (
      <div className="flex min-h-full w-full items-center justify-center p-8">
        <EmptyStateCard page="Git" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col py-[60px]">
      <GitList
        repositoryName={selectedRepository?.name ?? "Repository"}
        stats={stats}
        commits={commits}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onCommitClick={(commit) => {
          if (!repositoryId) return;
          void navigate(
            `/team/${teamId}/git/${repositoryId}/${encodeURIComponent(commit.hash)}`,
          );
        }}
        onLoadMore={() => {
          void fetchNextPage();
        }}
      />
    </div>
  );
}

export default GitPage;
