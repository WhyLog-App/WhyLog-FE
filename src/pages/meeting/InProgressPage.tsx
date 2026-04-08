import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { endMeeting } from "@/apis/meetings";
import IconClock from "@/assets/icons/media/ic_clock.svg?react";
import IconCircleUser from "@/assets/icons/user/ic_circle_user.svg?react";
import { Icon } from "@/components/common/Icon";
import LiveTranscriptPanel from "./components/LiveTranscriptPanel";
import MeetingControls from "./components/MeetingControls";
import ParticipantGrid from "./components/ParticipantGrid";
import { useElapsedTime } from "./hooks/useElapsedTime";
import { useMeetingDetail } from "./hooks/useMeetingDetail";
import { useMeetingRoom } from "./hooks/useMeetingRoom";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";

const formatStartDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const InProgressPage = () => {
  const { meetingId: meetingIdParam } = useParams<{ meetingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const meetingId = meetingIdParam ? Number(meetingIdParam) : null;
  const { data: meetingDetail } = useMeetingDetail(meetingId);
  const meetingName =
    meetingDetail?.name ??
    (location.state as { name?: string } | null)?.name ??
    "회의";
  const meetingStart = meetingDetail?.startDateTime
    ? formatStartDateTime(meetingDetail.startDateTime)
    : null;
  const memberCount = meetingDetail?.memberCount ?? 0;
  const startedAt = useRef(new Date()).current;
  const elapsed = useElapsedTime(startedAt);

  const {
    participants,
    isWsConnected,
    isRoomConnected,
    errorMessage,
    transcripts,
    interimByMember,
    sendMessage,
  } = useMeetingRoom({
    meetingId,
    displayName: "나",
  });

  const { isSupported: isSpeechSupported } = useSpeechRecognition({
    enabled: isWsConnected,
    onInterim: (text) => sendMessage("audio_text", text),
    onFinal: (text) => sendMessage("speech", text),
  });

  const endMutation = useMutation({
    mutationFn: (id: number) => endMeeting(id),
    onSuccess: () => navigate("/"),
    onError: () => navigate("/"),
  });

  if (meetingId == null) {
    return null;
  }

  const displayParticipants =
    participants.length > 0
      ? participants
      : [{ id: "self", name: "나", isSelf: true }];

  const handleEnd = () => {
    if (meetingId != null) {
      endMutation.mutate(meetingId);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex h-full flex-col py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="typo-h5 text-(--color-text-primary)">{meetingName}</h1>
          {meetingStart && (
            <span className="typo-caption text-(--color-text-tertiary)">
              {meetingStart}
              {memberCount > 0 ? ` · 참여자 ${memberCount}명` : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1">
            <Icon icon={IconClock} size={16} className="text-green-700" />
            <span className="typo-body6 text-green-700">{elapsed}</span>
          </span>
          <span className="typo-caption text-(--color-text-tertiary)">
            WS {isWsConnected ? "✓" : "…"} · RTC {isRoomConnected ? "✓" : "…"}
          </span>
          <div className="flex -space-x-2">
            {displayParticipants.slice(0, 3).map((p) => (
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

      {errorMessage && (
        <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Body */}
      <div className="mt-10 flex flex-1 gap-6 overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center">
          <ParticipantGrid participants={displayParticipants} />
        </div>
        <LiveTranscriptPanel
          transcripts={transcripts}
          interimByMember={interimByMember}
          isSupported={isSpeechSupported}
        />
      </div>

      {/* Bottom controls */}
      <div className="mt-6 flex justify-center">
        <MeetingControls onEnd={handleEnd} />
      </div>
    </div>
  );
};

export default InProgressPage;
