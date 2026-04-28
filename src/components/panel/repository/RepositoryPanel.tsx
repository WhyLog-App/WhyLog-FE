import { useState } from "react";
import IconAddPlusSquare from "@/assets/icons/edit/ic_add_plus_square.svg?react";
import { Icon } from "@/components/common/Icon";
import RepositoryPanelItem from "./RepositoryPanelItem";

interface RepositoryItem {
  id: string;
  name: string;
  updatedAtText: string;
}

const mockRepositories: RepositoryItem[] = [
  { id: "repo-1", name: "Capston-Server", updatedAtText: "14 mins ago" },
  { id: "repo-2", name: "Capston-AI", updatedAtText: "35 mins ago" },
  { id: "repo-3", name: "Capston-Web", updatedAtText: "1 hour ago" },
];

const RepositoryPanel = () => {
  const [selectedId, setSelectedId] = useState<string | null>(
    mockRepositories[0]?.id ?? null,
  );

  const hasRepositories = mockRepositories.length > 0;

  return (
    <>
      <div className="flex w-full items-center justify-between px-5">
        <h2 className="typo-h6 text-(--color-text-primary)">Repository</h2>
        <button
          type="button"
          className="cursor-pointer"
          aria-label="레포지토리 연동"
        >
          <Icon
            icon={IconAddPlusSquare}
            size={24}
            className="text-(--color-text-primary)"
          />
        </button>
      </div>

      <div className="h-px w-full bg-(--color-border-divider)" />

      {!hasRepositories && (
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

      {hasRepositories && (
        <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto px-4">
          {mockRepositories.map((repo) => (
            <RepositoryPanelItem
              key={repo.id}
              name={repo.name}
              updatedAtText={repo.updatedAtText}
              isActive={repo.id === selectedId}
              onClick={() => setSelectedId(repo.id)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default RepositoryPanel;
