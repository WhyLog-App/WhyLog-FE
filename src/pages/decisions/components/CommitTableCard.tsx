import { useState } from "react";
import IconArrowsReload from "@/assets/icons/arrow/ic_arrows_reload.svg?react";
import IconAddPlus from "@/assets/icons/edit/ic_add_plus.svg?react";
import { Icon } from "@/components/common/Icon";
import type {
  ApplicationConnectedCommit,
  ApplicationRecommendedCommit,
} from "@/types/application";
import type { CommitTab, DecisionFooterStats } from "@/types/decision";
import GlassCard from "./GlassCard";

interface CommitTableCardProps {
  recommendedCommits: ApplicationRecommendedCommit[];
  linkedCommits: ApplicationConnectedCommit[];
  footerStats: DecisionFooterStats;
  className?: string;
}

const formatCommittedDate = (iso: string) => {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
};

const CommitHashBadge = ({ hash }: { hash: string }) => (
  <span
    title={hash}
    className="inline-flex items-center justify-center rounded bg-[#f5e5ff] px-3 py-0.5 font-mono text-[10px] leading-3.75 text-purple-700"
  >
    {hash.slice(0, 6)}
  </span>
);

const TabButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`cursor-pointer overflow-clip rounded-full px-4 py-0.5 typo-button-md transition-colors ${
      active
        ? "bg-blue-50 text-blue-700"
        : "text-(--color-text-secondary) hover:bg-(--color-action-hover)"
    }`}
  >
    {children}
  </button>
);

const CommitTableCard = ({
  recommendedCommits,
  linkedCommits,
  footerStats,
  className = "",
}: CommitTableCardProps) => {
  const [tab, setTab] = useState<CommitTab>("recommended");
  const rowCount =
    tab === "recommended" ? recommendedCommits.length : linkedCommits.length;

  return (
    <GlassCard className={`gap-5 px-5 py-7 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="typo-subtitle4 text-(--color-text-primary)">
          커밋 추천 결과
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="새로고침"
            className="flex size-5 cursor-pointer items-center justify-center rounded bg-(--color-bg-surface) text-(--color-text-secondary) hover:bg-(--color-action-hover)"
          >
            <Icon icon={IconArrowsReload} size={16} />
          </button>
          <button
            type="button"
            aria-label="추가"
            className="flex size-5 cursor-pointer items-center justify-center rounded bg-(--color-bg-surface) text-(--color-text-secondary) hover:bg-(--color-action-hover)"
          >
            <Icon icon={IconAddPlus} size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-1">
        <TabButton
          active={tab === "recommended"}
          onClick={() => setTab("recommended")}
        >
          추천 커밋
        </TabButton>
        <TabButton active={tab === "linked"} onClick={() => setTab("linked")}>
          연결된 커밋
        </TabButton>
      </div>

      <div className="scrollbar-thin w-full min-w-0 overflow-x-auto rounded-lg">
        <table className="w-full min-w-130 table-fixed border-collapse">
          <colgroup>
            <col className="w-[22%] min-w-30" />
            <col className="w-[14%] min-w-20" />
            <col className="w-auto" />
            <col className="w-[14%] min-w-18" />
            <col className="w-[12%] min-w-16" />
          </colgroup>
          <thead>
            <tr className="border-b border-(--color-border-default)">
              <th className="px-2 py-3 text-left typo-caption1 text-(--color-text-secondary) uppercase">
                Repository
              </th>
              <th className="px-2 py-3 text-left typo-caption1 text-(--color-text-secondary) uppercase">
                Commit
              </th>
              <th className="px-2 py-3 text-left typo-caption1 text-(--color-text-secondary) uppercase">
                Message
              </th>
              <th className="px-2 py-3 text-center typo-caption1 text-(--color-text-secondary) uppercase">
                {tab === "recommended" ? "추천 사유" : "커밋 일시"}
              </th>
              <th className="px-2 py-3 text-right typo-caption1 text-(--color-text-secondary) uppercase">
                연결
              </th>
            </tr>
          </thead>
          <tbody>
            {rowCount === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-2 py-6 text-center typo-body6 text-(--color-text-tertiary)"
                >
                  표시할 커밋이 없습니다
                </td>
              </tr>
            ) : tab === "recommended" ? (
              recommendedCommits.map((c, idx) => {
                const isLast = idx === recommendedCommits.length - 1;
                return (
                  <tr
                    key={`rec-${c.commit_id}-${c.commit_hash}`}
                    className={
                      isLast ? "border-b border-(--color-border-default)" : ""
                    }
                  >
                    <td className="h-11 px-2 py-2.5">
                      <p className="truncate typo-body5 text-(--color-text-primary)">
                        {c.repository_name}
                      </p>
                    </td>
                    <td className="h-11 px-2 py-2.5">
                      <CommitHashBadge hash={c.commit_hash} />
                    </td>
                    <td className="h-11 px-2 py-2.5">
                      <p className="truncate typo-subtitle5 text-(--color-text-primary)">
                        {c.message}
                      </p>
                    </td>
                    <td className="h-11 px-2 py-2.5 text-center">
                      <button
                        type="button"
                        title={c.reason}
                        className="cursor-pointer typo-button-sm text-(--color-text-brand) hover:underline"
                      >
                        사유 보기
                      </button>
                    </td>
                    <td className="h-11 px-2 py-2.5 text-right">
                      <button
                        type="button"
                        className="cursor-pointer rounded bg-(--color-bg-brand-subtle) px-3 py-0.5 typo-button-sm text-(--color-text-brand) hover:opacity-80"
                      >
                        연결
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              linkedCommits.map((c, idx) => {
                const isLast = idx === linkedCommits.length - 1;
                return (
                  <tr
                    key={`linked-${c.commit_hash}-${idx}`}
                    className={
                      isLast ? "border-b border-(--color-border-default)" : ""
                    }
                  >
                    <td className="h-11 px-2 py-2.5">
                      <p className="truncate typo-body5 text-(--color-text-primary)">
                        {c.repository_name}
                      </p>
                    </td>
                    <td className="h-11 px-2 py-2.5">
                      <CommitHashBadge hash={c.commit_hash} />
                    </td>
                    <td className="h-11 px-2 py-2.5">
                      <p className="truncate typo-subtitle5 text-(--color-text-primary)">
                        {c.message}
                      </p>
                    </td>
                    <td className="h-11 px-2 py-2.5 text-center">
                      <span className="typo-caption1 text-(--color-text-secondary)">
                        {formatCommittedDate(c.committed_date)}
                      </span>
                    </td>
                    <td className="h-11 px-2 py-2.5 text-right">
                      <button
                        type="button"
                        className="cursor-pointer rounded bg-(--color-bg-brand-subtle) px-3 py-0.5 typo-button-sm text-(--color-text-brand) hover:opacity-80"
                      >
                        해제
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex w-full items-start gap-5 typo-caption1 text-(--color-text-tertiary)">
        <div className="flex items-center gap-1">
          <span>근거 발언</span>
          <span className="font-bold typo-button-sm">
            {footerStats.evidence_utterance_count}개
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span>참여자 합의도</span>
          <span className="font-bold typo-button-sm">
            {footerStats.participant_consensus_label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span>결정 ↔ 구현 일치율</span>
          <span className="font-bold typo-button-sm">
            {footerStats.decision_implementation_match_rate}%
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

export default CommitTableCard;
