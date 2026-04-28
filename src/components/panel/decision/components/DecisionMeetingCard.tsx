import IconChevronUp from "@/assets/icons/arrow/ic_chevron_up.svg?react";
import { Icon } from "@/components/common/Icon";
import DecisionItemRow from "./DecisionItemRow";

interface DecisionItem {
  id: string;
  label: string;
  status: "active" | "warning" | "default";
}

interface DecisionMeetingItem {
  id: string;
  title: string;
  date: string;
  decisions: DecisionItem[];
}

interface DecisionMeetingCardProps {
  meeting: DecisionMeetingItem;
  isExpanded: boolean;
  selectedDecisionId: string | null;
  onToggle: (meetingId: string) => void;
  onSelectDecision: (decisionId: string) => void;
}

const DecisionMeetingCard = ({
  meeting,
  isExpanded,
  selectedDecisionId,
  onToggle,
  onSelectDecision,
}: DecisionMeetingCardProps) => {
  const hasDecisions = meeting.decisions.length > 0;

  return (
    <div
      className={
        isExpanded && hasDecisions
          ? "overflow-hidden rounded-lg border border-solid border-(--color-border-default)"
          : "rounded-lg bg-(--color-bg-surface)"
      }
    >
      <button
        type="button"
        disabled={!hasDecisions}
        className={`flex w-full flex-col gap-2 rounded-lg px-4 py-3 text-left ${
          !hasDecisions
            ? "cursor-default"
            : "cursor-pointer hover:bg-(--color-action-hover)"
        }`}
        onClick={() => {
          if (!hasDecisions) return;
          onToggle(meeting.id);
        }}
      >
        <div className="flex items-center justify-between">
          <span className="typo-subtitle5 text-(--color-text-primary)">
            {meeting.title}
          </span>
          {hasDecisions && (
            <Icon
              icon={IconChevronUp}
              size={16}
              className={`text-(--color-text-primary) transition-transform ${
                isExpanded ? "rotate-0" : "rotate-180"
              }`}
            />
          )}
        </div>
        <span className="typo-caption1 font-normal text-(--color-text-tertiary)">
          {meeting.date}
        </span>
      </button>

      {isExpanded && hasDecisions && (
        <div className="flex flex-col">
          {meeting.decisions.map((decision) => (
            <DecisionItemRow
              key={decision.id}
              id={decision.id}
              label={decision.label}
              status={decision.status}
              isActive={selectedDecisionId === decision.id}
              onClick={onSelectDecision}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DecisionMeetingCard;
