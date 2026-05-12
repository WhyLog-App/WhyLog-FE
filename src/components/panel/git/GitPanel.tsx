import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import IconAddPlusSquare from "@/assets/icons/edit/ic_add_plus_square.svg?react";
import { Icon } from "@/components/common/Icon";
import { formatSyncDate } from "@/utils/date";
import GitTokenModal from "./GitTokenModal";
import GitPanelItem from "./GitPanelItem";
import { useRegisterGitHubToken } from "@/pages/git/hooks/useRegisterGitHubToken";
import { useCheckGitHubToken } from "@/pages/git/hooks/useCheckGitHubToken";
import { useGetRepositories } from "@/pages/git/hooks/useGetRepositories";
import RepositoryAddModal from "./RepositoryAddModal";
import useAddRepository from "@/pages/git/hooks/useAddRepository";
import { useCurrentTeam } from "@/hooks/useCurrentTeam";

interface GitItem {
  id: string;
  name: string;
  updatedAtText: string;
}

const GitPanel = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { registerGitHubToken, isPending, errorMessage } =
    useRegisterGitHubToken();

  const { data: tokenStatus, isLoading: isCheckingToken } =
    useCheckGitHubToken();

  const { teamId } = useCurrentTeam();

  const { data: repositories = [] } = useGetRepositories(teamId);

  const {
    addRepository,
    isPending: isAdding,
    errorMessage: addError,
  } = useAddRepository({
    onSuccess: () => {
      setIsRepoModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["repositories", teamId],
      });
    },
    onTokenExpired: () => {
      setIsRepoModalOpen(false);
      setIsTokenModalOpen(true);
    },
  });

  const gitItems: GitItem[] = useMemo(
    () =>
      repositories.map((repo) => ({
        id: String(repo.repository_id),
        name: repo.name,
        updatedAtText: formatSyncDate(repo.last_sync_date_time),
      })),
    [repositories],
  );

  const hasGitItems = gitItems.length > 0;

  useEffect(() => {
    if (selectedId === null && hasGitItems) {
      setSelectedId(gitItems[0]?.id ?? null);
    }
  }, [hasGitItems, gitItems, selectedId]);

  const handleAddButtonClick = () => {
    if (isCheckingToken) return;

    if (tokenStatus?.is_registered) {
      setIsRepoModalOpen(true);
    } else {
      setIsTokenModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between px-5">
        <h2 className="typo-h6 text-(--color-text-primary)">Repository</h2>
        <button
          type="button"
          className="cursor-pointer"
          aria-label="레포지토리 연동"
          onClick={handleAddButtonClick}
          disabled={isCheckingToken}
        >
          <Icon
            icon={IconAddPlusSquare}
            size={24}
            className="text-(--color-text-primary)"
          />
        </button>
      </div>

      <div className="h-px w-full bg-(--color-border-divider)" />

      {!hasGitItems && (
        <div className="flex w-full flex-1 flex-col items-center justify-center px-4">
          <div className="flex w-full flex-col items-start gap-2 text-center">
            <div className="typo-subtitle4 w-full text-(--color-text-secondary)">
              <p>연동된 레포지토리가</p>
              <p>없습니다</p>
            </div>
            <div className="typo-body6 w-full text-(--color-text-tertiary)">
              <p>GitHub 레포지토리를 연동하여</p>
              <p>커밋 이력을 분석해보세요</p>
            </div>
          </div>
        </div>
      )}

      {hasGitItems && (
        <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto px-4">
          {gitItems.map((item) => (
            <GitPanelItem
              key={item.id}
              name={item.name}
              updatedAtText={item.updatedAtText}
              isActive={item.id === selectedId}
              onClick={() => setSelectedId(item.id)}
            />
          ))}
        </div>
      )}

      {isTokenModalOpen && (
        <GitTokenModal
          onClose={() => setIsTokenModalOpen(false)}
          onRegister={registerGitHubToken}
          onNext={() => {
            setIsTokenModalOpen(false);
            setIsRepoModalOpen(true);
          }}
          isPending={isPending}
          errorMessage={errorMessage}
        />
      )}

      {isRepoModalOpen && (
        <RepositoryAddModal
          onClose={() => setIsRepoModalOpen(false)}
          onAdd={(payload) => {
            if (!teamId) return;
            addRepository(teamId, payload);
          }}
          isPending={isAdding}
          errorMessage={addError}
        />
      )}
    </>
  );
};

export default GitPanel;
