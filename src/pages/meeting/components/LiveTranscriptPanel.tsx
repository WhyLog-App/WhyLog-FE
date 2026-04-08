import IconBell from "@/assets/icons/communication/ic_bell.svg?react";
import { Icon } from "@/components/common/Icon";

interface TranscriptItem {
  speaker: string;
  time: string;
  text: string;
}

const MOCK_TRANSCRIPT: TranscriptItem[] = [
  {
    speaker: "김개발",
    time: "12:29",
    text: "마이페이지 API는 RESTful 방식으로 구현하는 게 어떨까요?",
  },
  {
    speaker: "이디자인",
    time: "12:45",
    text: "UI/UX 디자인 피드백을 수집할 수 있는 간단한 설문조사를 만들죠.",
  },
  {
    speaker: "박테스트",
    time: "13:10",
    text: "각 기능의 테스트 케이스를 명확히 문서화해야 합니다.",
  },
  {
    speaker: "최기획",
    time: "13:35",
    text: "새로운 기능의 사용자 경험을 개선하기 위해 A/B 테스트를 진행하자.",
  },
  {
    speaker: "홍개발",
    time: "14:00",
    text: "API 호출의 성능을 모니터링할 수 있는 대시보드를 개발하자.",
  },
];

const LiveTranscriptPanel = () => {
  return (
    <aside className="flex h-full w-90 shrink-0 flex-col gap-4 overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) px-5 py-5">
      <div className="flex items-center gap-2">
        <Icon
          icon={IconBell}
          size={20}
          className="text-(--color-text-primary)"
        />
        <h3 className="typo-subtitle5 text-(--color-text-primary)">
          실시간 음성인식
        </h3>
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {MOCK_TRANSCRIPT.map((item) => (
          <div
            key={`${item.speaker}-${item.time}`}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <span className="typo-subtitle5 text-(--color-primary-500)">
                {item.speaker}
              </span>
              <span className="typo-caption1 text-(--color-text-tertiary)">
                {item.time}
              </span>
            </div>
            <p className="typo-body6 text-(--color-text-secondary)">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LiveTranscriptPanel;
