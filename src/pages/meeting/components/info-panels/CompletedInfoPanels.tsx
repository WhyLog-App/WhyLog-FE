import type { CompletedMeetingPanels } from "../../mocks/completedMeetingMock";
import InfoPanelCard from "./InfoPanelCard";

interface CompletedInfoPanelsProps {
  panels: CompletedMeetingPanels;
}

const CompletedInfoPanels = ({ panels }: CompletedInfoPanelsProps) => {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col gap-4 overflow-y-auto">
      <InfoPanelCard title="회의 기본 정보" items={panels.basicInfo} />
      <InfoPanelCard title="논의 주제" items={panels.topics} />
      <InfoPanelCard title="핵심 맥락" items={panels.context} />
      <InfoPanelCard title="최종 결정" items={panels.finalDecisions} />
      <InfoPanelCard title="결정 근거" items={panels.rationale} />
      <InfoPanelCard title="기타 언급" items={panels.misc} />
    </aside>
  );
};

export default CompletedInfoPanels;
