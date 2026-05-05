import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IconSearch from "@/assets/icons/interface/ic_search.svg?react";
import { Icon } from "@/components/common/Icon";
import { useCurrentTeam } from "@/hooks/useCurrentTeam";
import { useDecisions } from "./hooks/useDecisions";

const DecisionPanel = () => {
  const navigate = useNavigate();
  const { teamId } = useCurrentTeam();
  const { decisionId: activeDecisionIdParam } = useParams<{
    decisionId?: string;
  }>();
  const activeDecisionId = activeDecisionIdParam
    ? Number(activeDecisionIdParam)
    : null;
  const { data, isLoading, isError } = useDecisions(teamId);

  const [keyword, setKeyword] = useState("");

  const decisions = useMemo(() => {
    const list = data ?? [];
    if (!keyword.trim()) return list;
    const lower = keyword.trim().toLowerCase();
    return list.filter((d) => d.name.toLowerCase().includes(lower));
  }, [data, keyword]);

  const hasDecisions = decisions.length > 0;

  return (
    <>
      <div className="flex w-full items-center justify-between px-5">
        <h2 className="typo-h6 text-(--color-text-primary)">결정사항 목록</h2>
        <span className="typo-subtitle5 text-(--color-text-tertiary)">
          매칭
        </span>
      </div>

      <div className="h-px w-full bg-(--color-border-divider)" />

      {isLoading ? (
        <div className="flex w-full flex-1 items-center justify-center px-4 typo-subtitle5 text-(--color-text-tertiary)">
          불러오는 중...
        </div>
      ) : isError ? (
        <div className="flex w-full flex-1 items-center justify-center px-4 typo-subtitle5 text-(--color-text-tertiary)">
          결정사항을 불러오지 못했습니다
        </div>
      ) : !hasDecisions && !keyword ? (
        <div className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="typo-subtitle4 text-(--color-text-secondary)">
            아직 분석된 회의가
            <br />
            없습니다
          </div>
          <div className="mt-2 typo-body6 text-(--color-text-tertiary)">
            음성 회의를 진행하거나 녹음 파일을 업로드하면
            <br />
            결정사항이 자동으로 추출됩니다
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto px-4">
          <div className="flex w-full items-center gap-2 rounded-lg bg-(--color-bg-subtle) p-3">
            <Icon
              icon={IconSearch}
              size={24}
              className="shrink-0 text-(--color-text-brand)"
            />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="회의 이름으로 검색하세요..."
              className="w-full bg-transparent typo-subtitle5 text-(--color-text-primary) placeholder:text-(--color-text-disabled) focus:outline-none"
            />
          </div>

          {decisions.map((decision) => {
            const isActive = activeDecisionId === decision.decision_id;
            return (
              <button
                key={decision.decision_id}
                type="button"
                onClick={() =>
                  teamId &&
                  navigate(
                    `/team/${teamId}/decisions/${decision.decision_id}`,
                  )
                }
                aria-pressed={isActive}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-left ${
                  isActive
                    ? "bg-(--color-action-active)"
                    : "bg-(--color-bg-surface) hover:bg-(--color-action-hover)"
                }`}
              >
                <span
                  className={`typo-subtitle5 ${
                    isActive
                      ? "text-(--color-text-brand)"
                      : "text-(--color-text-primary)"
                  }`}
                >
                  {decision.name}
                </span>
                <span className="typo-caption1 text-(--color-text-tertiary)">
                  {decision.application_count}
                </span>
              </button>
            );
          })}

          {!hasDecisions && keyword && (
            <div className="flex w-full flex-1 items-center justify-center py-8 typo-subtitle5 text-(--color-text-tertiary)">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DecisionPanel;
