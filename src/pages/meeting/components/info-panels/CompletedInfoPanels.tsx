import type { CompletedMeetingPanels } from "../../types/completed";
import InfoPanelCard from "./InfoPanelCard";

interface CompletedInfoPanelsProps {
  panels: CompletedMeetingPanels;
  isAnalyzing?: boolean;
}

const ANALYZING_PLACEHOLDER = ["분석 중입니다..."];

const CompletedInfoPanels = ({
  panels,
  isAnalyzing = false,
}: CompletedInfoPanelsProps) => {
  const fill = (items: string[]) =>
    isAnalyzing && items.length === 0 ? ANALYZING_PLACEHOLDER : items;

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col gap-4 overflow-y-auto">
      <InfoPanelCard title="회의 기본 정보" items={fill(panels.basicInfo)} />
      <InfoPanelCard title="논의 주제" items={fill(panels.topics)} />
      <InfoPanelCard title="핵심 맥락" items={fill(panels.context)} />
      <InfoPanelCard title="최종 결정" items={fill(panels.finalDecisions)} />
      <InfoPanelCard title="결정 근거" items={fill(panels.rationale)} />
      <InfoPanelCard title="기타 언급" items={fill(panels.misc)} />
    </aside>
  );
};

export default CompletedInfoPanels;
