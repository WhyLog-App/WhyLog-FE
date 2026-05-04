import GitHeader from "./GitHeader";
import CommitTable from "./CommitTable";
import IconChevronDownDuo from "@/assets/icons/arrow/ic_chevron_down_duo.svg?react";
import { Icon } from "@/components/common/Icon";
import type { GitCommitItem, GitRepositoryStats } from "../../../types/git";

interface GitListProps {
  repositoryName: string;
  stats: GitRepositoryStats;
  commits: GitCommitItem[];
}

const GitList = ({ repositoryName, stats, commits }: GitListProps) => {
  const visibleCommits = commits.slice(0, 6);

  return (
    <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-5">
      <GitHeader repositoryName={repositoryName} stats={stats} />

      <div className="overflow-hidden rounded-[16px] border border-white bg-[rgba(255,255,255,0.5)] px-5 pt-7 pb-7">
        <CommitTable commits={visibleCommits} />
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full px-4 py-1.5 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
        >
          <Icon icon={IconChevronDownDuo} size={16} className="text-current" />
          <span className="typo-body5 font-medium">더 불러오기</span>
        </button>
      </div>
    </div>
  );
};

export default GitList;
