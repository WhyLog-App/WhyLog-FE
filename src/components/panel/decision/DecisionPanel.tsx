import { useState } from "react";
import IconSearch from "@/assets/icons/interface/ic_search.svg?react";
import { Icon } from "@/components/common/Icon";
import DecisionMeetingCard from "./components/DecisionMeetingCard";
import { mockDecisionMeetings } from "./decisionPanelMockData";

type DecisionStatus = "active" | "warning" | "default";

interface DecisionItem {
  id: string;
  label: string;
  status: DecisionStatus;
}

interface DecisionMeetingItem {
  id: string;
  title: string;
  date: string;
  decisions: DecisionItem[];
}

const DecisionPanel = () => {
  const decisionMeetings: DecisionMeetingItem[] = mockDecisionMeetings;

  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(
    decisionMeetings.find((meeting) => meeting.decisions.length > 0)?.id ??
      null,
  );
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(
    decisionMeetings
      .find((meeting) => meeting.decisions.length > 0)
      ?.decisions.at(0)?.id ?? null,
  );

  const hasAnalyzedMeetings = decisionMeetings.length > 0;

  return (
    <>
      <div className="flex w-full items-center justify-between px-5">
        <h2 className="typo-h6 text-(--color-text-primary)">결정사항 목록</h2>
        <span className="typo-subtitle5 text-(--color-text-tertiary)">
          매칭
        </span>
      </div>

      <div className="h-px w-full bg-(--color-border-divider)" />

      {!hasAnalyzedMeetings ? (
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
            <span className="typo-subtitle5 text-(--color-text-disabled)">
              회의 이름으로 검색하세요...
            </span>
          </div>

          {decisionMeetings.map((meeting) => (
            <DecisionMeetingCard
              key={meeting.id}
              meeting={meeting}
              isExpanded={expandedMeetingId === meeting.id}
              selectedDecisionId={selectedDecisionId}
              onToggle={(meetingId) =>
                setExpandedMeetingId((prev) =>
                  prev === meetingId ? null : meetingId,
                )
              }
              onSelectDecision={setSelectedDecisionId}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default DecisionPanel;
