import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import IconClock from "@/assets/icons/media/ic_clock.svg?react";
import IconCircleUser from "@/assets/icons/user/ic_circle_user.svg?react";
import { Icon } from "@/components/common/Icon";
import { useMeetings } from "@/contexts/MeetingsContext";
import LiveTranscriptPanel from "./components/LiveTranscriptPanel";
import MeetingControls from "./components/MeetingControls";
import ParticipantGrid from "./components/ParticipantGrid";
import { useElapsedTime } from "./hooks/useElapsedTime";

const InProgressPage = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getMeeting, endMeeting } = useMeetings();

  const meeting = meetingId ? getMeeting(meetingId) : undefined;
  const elapsed = useElapsedTime(meeting?.startedAt);

  useEffect(() => {
    if (meetingId && !meeting) {
      navigate("/meeting", { replace: true });
    }
  }, [meeting, meetingId, navigate]);

  if (!meeting) return null;

  // Dev helper: ?mockParticipants=4 to preview different grid sizes
  const mockCount = Number(searchParams.get("mockParticipants"));
  const participants =
    Number.isFinite(mockCount) && mockCount > 0
      ? meeting.participants.length === mockCount
        ? meeting.participants
        : Array.from({ length: mockCount }, (_, i) => ({
            id: `mp-${i}`,
            name:
              [
                "김개발",
                "이디자인",
                "박기획",
                "최테스트",
                "정서버",
                "강클라이",
              ][i] ?? `참가자${i + 1}`,
            isSelf: i === 0,
          }))
      : meeting.participants;

  const handleEnd = () => {
    endMeeting(meeting.id);
    navigate("/meeting");
  };

  return (
    <div className="flex h-full flex-col py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="typo-h5 text-(--color-text-primary)">{meeting.name}</h1>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1">
            <Icon icon={IconClock} size={16} className="text-green-700" />
            <span className="typo-body6 text-green-700">{elapsed}</span>
          </span>
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map((p) => (
              <span
                key={p.id}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-(--color-bg-surface) bg-light-500"
              >
                <Icon
                  icon={IconCircleUser}
                  size={20}
                  className="text-(--color-dark-100)"
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mt-10 flex flex-1 gap-6 overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center">
          <ParticipantGrid participants={participants} />
        </div>
        <LiveTranscriptPanel />
      </div>

      {/* Bottom controls */}
      <div className="mt-6 flex justify-center">
        <MeetingControls onEnd={handleEnd} />
      </div>
    </div>
  );
};

export default InProgressPage;
