import { useState } from "react";
import IconAddPlusSquare from "@/assets/icons/edit/ic_add_plus_square.svg?react";
import IconSearch from "@/assets/icons/interface/ic_search.svg?react";
import { Icon } from "@/components/common/Icon";
import MeetingPanelItem from "./MeetingPanelItem";
import StartMeetingModal from "./StartMeetingModal";

const MOCK_MEETINGS = [
  { id: 1, title: "서버 개발 팀 2차 회의", date: "2025.01.20", badgeCount: 3 },
  { id: 2, title: "기획-디자인 회의", date: "2025.01.17", badgeCount: 5 },
  { id: 3, title: "서버 개발 팀 1차 회의", date: "2025.01.15", badgeCount: 5 },
  { id: 4, title: "팀 전체 1차 회의", date: "2025.01.15", badgeCount: 5 },
];

const MeetingPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="flex w-full items-center justify-between px-5">
        <h2 className="typo-h6 text-(--color-text-primary)">회의 목록</h2>
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Icon
            icon={IconAddPlusSquare}
            size={24}
            className="text-(--color-text-primary)"
          />
        </button>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-(--color-border-divider)" />

      {/* Live meeting section */}
      <div className="flex w-full shrink-0 flex-col items-center px-4">
        <MeetingPanelItem
          title="진행 중인 회의"
          isLive
          elapsedTime="00:18:21"
        />
      </div>

      {/* Search + meeting list */}
      <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto px-4">
        {/* Search bar */}
        <div className="flex w-full items-center gap-2 rounded-lg bg-(--color-bg-subtle) p-3">
          <Icon
            icon={IconSearch}
            size={24}
            className="shrink-0 text-(--color-text-disabled)"
          />
          <span className="typo-subtitle5 text-(--color-text-disabled)">
            회의 이름으로 검색하세요...
          </span>
        </div>

        {/* Meeting list */}
        {MOCK_MEETINGS.map((meeting) => (
          <MeetingPanelItem
            key={meeting.id}
            title={meeting.title}
            date={meeting.date}
            badgeCount={meeting.badgeCount}
          />
        ))}
      </div>

      {isModalOpen && (
        <StartMeetingModal
          onClose={() => setIsModalOpen(false)}
          onStart={(meetingName) => {
            console.log("회의 시작:", meetingName);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default MeetingPanel;
