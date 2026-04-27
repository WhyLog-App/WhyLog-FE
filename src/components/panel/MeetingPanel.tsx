import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconAddPlusSquare from "@/assets/icons/edit/ic_add_plus_square.svg?react";
import IconSearch from "@/assets/icons/interface/ic_search.svg?react";
import { Icon } from "@/components/common/Icon";
import { useCurrentTeam } from "@/hooks/useCurrentTeam";
import { useCreateMeeting } from "@/pages/meeting/hooks/useCreateMeeting";
import { useMeetingList } from "@/pages/meeting/hooks/useMeetingList";
import MeetingPanelItem from "./MeetingPanelItem";
import StartMeetingModal from "./StartMeetingModal";

const MeetingPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { teamId } = useCurrentTeam();
  const { createMeeting, isPending } = useCreateMeeting(teamId);
  const {
    ongoing: ongoingMeetings,
    completed: completedMeetings,
    isLoading,
    isError,
  } = useMeetingList(teamId);

  const ongoingMeeting = ongoingMeetings[0];

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

      {/* Ongoing meeting section */}
      {ongoingMeeting && teamId && (
        <div className="flex w-full shrink-0 flex-col items-center px-4">
          <MeetingPanelItem
            title={ongoingMeeting.name}
            isLive
            elapsedTime={ongoingMeeting.elapse ?? "00:00:00"}
            onClick={() =>
              navigate(`/team/${teamId}/meeting/${ongoingMeeting.meetingId}`)
            }
          />
        </div>
      )}

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
        {isLoading && (
          <span className="typo-body6 text-(--color-text-tertiary) px-2">
            불러오는 중...
          </span>
        )}
        {isError && (
          <span className="typo-body6 text-(--color-text-tertiary) px-2">
            회의 목록을 불러오지 못했습니다.
          </span>
        )}
        {!isLoading && !isError && completedMeetings.length === 0 && (
          <span className="typo-body6 text-(--color-text-tertiary) px-2">
            완료된 회의가 없습니다.
          </span>
        )}
        {completedMeetings.map((meeting) => (
          <MeetingPanelItem
            key={meeting.meetingId}
            title={meeting.name}
            onClick={() =>
              teamId && navigate(`/team/${teamId}/meeting/${meeting.meetingId}`)
            }
          />
        ))}
      </div>

      {isModalOpen && (
        <StartMeetingModal
          onClose={() => setIsModalOpen(false)}
          onStart={(meetingName) => createMeeting(meetingName)}
          isPending={isPending}
        />
      )}
    </>
  );
};

export default MeetingPanel;
