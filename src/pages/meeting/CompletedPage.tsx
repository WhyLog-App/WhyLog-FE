import { useParams } from "react-router-dom";
import AudioPlayerBar from "./components/AudioPlayerBar";
import CompletedMeetingHeader from "./components/CompletedMeetingHeader";
import CompletedTranscript from "./components/CompletedTranscript";
import CompletedInfoPanels from "./components/info-panels/CompletedInfoPanels";
import { useMeetingDetail } from "./hooks/useMeetingDetail";
import { completedMeetingMock } from "./mocks/completedMeetingMock";
import { parseMeetingId } from "./utils/parseMeetingId";

const CompletedPage = () => {
  const { meetingId: meetingIdParam } = useParams<{ meetingId: string }>();
  const meetingId = parseMeetingId(meetingIdParam);
  const { data: detail } = useMeetingDetail(meetingId);

  const name = detail?.name ?? completedMeetingMock.name;

  return (
    <div className="flex h-full flex-col gap-6 py-10">
      <div className="flex flex-1 gap-6 overflow-hidden">
        <section className="flex flex-1 flex-col gap-5 overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) px-6 py-6">
          <CompletedMeetingHeader
            name={name}
            startText={completedMeetingMock.start_text}
            durationText={completedMeetingMock.duration_text}
            memberCount={completedMeetingMock.member_count}
            members={completedMeetingMock.members}
          />
          <div className="h-px w-full shrink-0 bg-(--color-border-divider)" />
          <CompletedTranscript items={completedMeetingMock.transcript} />
          <div className="shrink-0">
            <AudioPlayerBar
              durationSec={completedMeetingMock.audio.duration_sec}
              initialCurrentSec={completedMeetingMock.audio.current_sec}
            />
          </div>
        </section>

        <CompletedInfoPanels panels={completedMeetingMock.panels} />
      </div>
    </div>
  );
};

export default CompletedPage;
