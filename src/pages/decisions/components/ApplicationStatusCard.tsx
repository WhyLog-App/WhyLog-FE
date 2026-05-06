import IconCheckboxCheck from "@/assets/icons/warning/ic_checkbox_check.svg?react";
import { Icon } from "@/components/common/Icon";
import type { DecisionApplicationDetail } from "@/types/decision";
import GlassCard from "./GlassCard";

interface ApplicationStatusCardProps {
  commits: DecisionApplicationDetail[];
}

const CommitHashBadge = ({ hash }: { hash: string }) => (
  <span className="inline-flex items-center justify-center rounded bg-[#f5e5ff] px-3 py-0.5 font-mono text-[10px] leading-3.75 text-purple-700">
    {hash}
  </span>
);

const ApplicationStatusCard = ({ commits }: ApplicationStatusCardProps) => {
  return (
    <GlassCard className="h-51 gap-4 overflow-hidden px-4 py-5">
      <div className="flex items-center gap-1">
        <Icon
          icon={IconCheckboxCheck}
          size={16}
          className="text-(--color-text-primary)"
        />
        <p className="typo-body6 text-(--color-text-primary)">적용현황</p>
        <p className="typo-caption2 text-(--color-text-secondary)">
          ({commits.length})
        </p>
      </div>

      <ul className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {commits.map((c) => (
          <li
            key={`${c.application_id}-${c.commit_id}`}
            className="flex items-center gap-2"
          >
            <CommitHashBadge hash={c.commit_hash} />
            <p className="typo-body5 flex-1 truncate text-(--color-text-primary)">
              {c.message}
            </p>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
};

export default ApplicationStatusCard;
