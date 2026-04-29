import { useParams } from "react-router-dom";
import type {
  MeetingAnalysis,
  MeetingHistory,
  MeetingMember,
} from "@/types/meeting";
import AudioPlayerBar from "./components/AudioPlayerBar";
import CompletedMeetingHeader from "./components/CompletedMeetingHeader";
import CompletedTranscript from "./components/CompletedTranscript";
import CompletedInfoPanels from "./components/info-panels/CompletedInfoPanels";
import { useMeetingAnalysis } from "./hooks/useMeetingAnalysis";
import { useMeetingAudio } from "./hooks/useMeetingAudio";
import { useMeetingDetail } from "./hooks/useMeetingDetail";
import { useMeetingHistory } from "./hooks/useMeetingHistory";
import type {
  CompletedMeetingPanels,
  CompletedTranscriptItem,
} from "./types/completed";
import { parseMeetingId } from "./utils/parseMeetingId";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

const formatStartText = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const w = WEEKDAY[d.getDay()];
  const hour24 = d.getHours();
  const isPm = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${w} ${isPm ? "오후" : "오전"} ${hour12}:${min}`;
};

const formatDurationText = (seconds: number | null | undefined) => {
  if (seconds == null || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
};

const buildPanels = (
  analysis: MeetingAnalysis | undefined,
): CompletedMeetingPanels => {
  if (!analysis || !analysis.is_analyzed) {
    return {
      basicInfo: [],
      topics: [],
      context: [],
      finalDecisions: [],
      rationale: [],
      misc: [],
    };
  }
  const basicInfo: string[] = [];
  if (analysis.meeting_title)
    basicInfo.push(`회의 제목 : ${analysis.meeting_title}`);
  if (analysis.meeting_purpose)
    basicInfo.push(`회의 목적 : ${analysis.meeting_purpose}`);
  const durationText = formatDurationText(analysis.audio_duration);
  if (durationText) basicInfo.push(`회의 시간 : ${durationText}`);
  return {
    basicInfo,
    topics: analysis.topics ?? [],
    context: analysis.core_context ?? [],
    finalDecisions: analysis.application_titles ?? [],
    rationale: analysis.application_reasons ?? [],
    misc: [],
  };
};

const buildTranscript = (
  history: MeetingHistory | undefined,
): CompletedTranscriptItem[] => {
  if (!history) return [];
  const memberMap = new Map<number, MeetingMember>();
  for (const p of history.participants) memberMap.set(p.member_id, p);
  return history.dialogues.map((d, idx) => {
    const m = memberMap.get(d.member_id);
    return {
      id: `${d.member_id}-${idx}`,
      name: m?.name ?? "알 수 없음",
      time: d.timestamp,
      text: d.content,
      profile_image: m?.profile_image ?? null,
    };
  });
};

const CompletedPage = () => {
  const { meetingId: meetingIdParam } = useParams<{ meetingId: string }>();
  const meetingId = parseMeetingId(meetingIdParam);

  const { data: detail } = useMeetingDetail(meetingId);
  const { data: history } = useMeetingHistory(meetingId);
  const { data: analysis } = useMeetingAnalysis(meetingId);
  const { data: audio } = useMeetingAudio(meetingId);

  const name = detail?.name ?? "";
  const startText = formatStartText(detail?.start_date_time);
  const durationText = formatDurationText(detail?.duration);
  const memberCount = detail?.member_count ?? 0;
  const members =
    detail?.members?.map((m) => ({
      name: m.name,
      profile_image: m.profile_image,
    })) ?? [];

  const transcript = buildTranscript(history);
  const panels = buildPanels(analysis);
  const isAnalyzing = !!analysis && !analysis.is_analyzed;

  return (
    <div className="flex h-full flex-col gap-6 py-10">
      <div className="flex flex-1 gap-6 overflow-hidden">
        <section className="flex flex-1 flex-col gap-5 overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) px-6 py-6">
          <CompletedMeetingHeader
            name={name}
            startText={startText}
            durationText={durationText}
            memberCount={memberCount}
            members={members}
          />
          <div className="h-px w-full shrink-0 bg-(--color-border-divider)" />
          <CompletedTranscript items={transcript} />
          <div className="shrink-0">
            <AudioPlayerBar
              durationSec={audio?.audio_duration ?? 0}
              audioUrl={audio?.audio_url ?? null}
            />
          </div>
        </section>

        <CompletedInfoPanels panels={panels} isAnalyzing={isAnalyzing} />
      </div>
    </div>
  );
};

export default CompletedPage;
