import { useLocation, useNavigate, useParams } from "react-router-dom";
import LiveTranscriptPanel from "./components/LiveTranscriptPanel";
import MeetingControls from "./components/MeetingControls";
import MeetingHeader from "./components/MeetingHeader";
import ParticipantGrid from "./components/ParticipantGrid";
import { useElapsedTime } from "./hooks/useElapsedTime";
import { useEndMeeting } from "./hooks/useEndMeeting";
import { useLocalSpeechFallback } from "./hooks/useLocalSpeechFallback";
import { useMeetingDetail } from "./hooks/useMeetingDetail";
import { useMeetingRoom } from "./hooks/useMeetingRoom";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";

const formatStartDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const parseMeetingId = (raw: string | undefined): number | null => {
  if (!raw) return null;
  const num = Number(raw);
  return Number.isNaN(num) ? null : num;
};

const parseStartTimestamp = (iso: string | undefined): number | undefined => {
  if (!iso) return undefined;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? undefined : t;
};

const InProgressPage = () => {
  const { meetingId: meetingIdParam } = useParams<{ meetingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const meetingId = parseMeetingId(meetingIdParam);
  const { data: meetingDetail } = useMeetingDetail(meetingId);

  const meetingName =
    meetingDetail?.name ??
    (location.state as { name?: string } | null)?.name ??
    "회의";
  const meetingStart = meetingDetail?.start_date_time
    ? formatStartDateTime(meetingDetail.start_date_time)
    : null;
  const memberCount = meetingDetail?.member_count ?? 0;

  const startedAt = parseStartTimestamp(meetingDetail?.start_date_time);
  const elapsed = useElapsedTime(startedAt);

  const {
    participants,
    isWsConnected,
    isRoomConnected,
    errorMessage,
    transcripts,
    interimByMember,
    sendMessage,
    isMicEnabled,
    isAudioOutputEnabled,
    setMicrophoneEnabled,
    setAudioOutputEnabled,
  } = useMeetingRoom({
    meetingId,
    displayName: "나",
  });

  const { handleInterim, handleFinal, mergeTranscripts, mergeInterim } =
    useLocalSpeechFallback({
      isWsConnected,
      isMicEnabled,
      sendMessage,
    });

  const { isSupported: isSpeechSupported } = useSpeechRecognition({
    enabled: isMicEnabled, // 마이크 음소거 시 음성 인식도 정지
    onInterim: handleInterim,
    onFinal: handleFinal,
  });

  const { endMeeting, errorMessage: endErrorMessage } = useEndMeeting();

  if (meetingId == null) {
    return null;
  }

  const displayParticipants =
    participants.length > 0
      ? participants
      : [{ id: "self", name: "나", isSelf: true }];

  const handleEnd = () => {
    if (meetingId != null) endMeeting(meetingId);
    else navigate("/");
  };

  return (
    <div className="flex h-full flex-col py-10">
      <MeetingHeader
        meetingName={meetingName}
        meetingStart={meetingStart}
        memberCount={memberCount}
        elapsed={elapsed}
        isWsConnected={isWsConnected}
        isRoomConnected={isRoomConnected}
        participants={displayParticipants}
      />

      {(errorMessage || endErrorMessage) && (
        <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage ?? endErrorMessage}
        </div>
      )}

      <div className="mt-10 flex flex-1 gap-6 overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center">
          <ParticipantGrid participants={displayParticipants} />
        </div>
        <LiveTranscriptPanel
          transcripts={mergeTranscripts(transcripts)}
          interimByMember={mergeInterim(interimByMember)}
          isSupported={isSpeechSupported}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <MeetingControls
          onEnd={handleEnd}
          isMicEnabled={isMicEnabled}
          isAudioOutputEnabled={isAudioOutputEnabled}
          onToggleMic={() => setMicrophoneEnabled(!isMicEnabled)}
          onToggleAudioOutput={() =>
            setAudioOutputEnabled(!isAudioOutputEnabled)
          }
        />
      </div>
    </div>
  );
};

export default InProgressPage;
