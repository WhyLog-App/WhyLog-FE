import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useCurrentTeam } from "@/hooks/useCurrentTeam";
import type { MeetingListItem } from "@/types/meeting";
import CompletedPage from "./CompletedPage";
import { useMeetingDetail } from "./hooks/useMeetingDetail";
import { MEETING_LIST_QUERY_KEY } from "./hooks/useMeetingList";
import InProgressPage from "./InProgressPage";

const parseMeetingId = (raw: string | undefined): number | null => {
  if (!raw) return null;
  const num = Number(raw);
  return Number.isNaN(num) ? null : num;
};

const MeetingRoutePage = () => {
  const { meetingId: meetingIdParam } = useParams<{ meetingId: string }>();
  const meetingId = parseMeetingId(meetingIdParam);
  const { teamId } = useCurrentTeam();

  const queryClient = useQueryClient();

  // 1) 사이드바가 이미 로드해 둔 캐시에서 status 확인
  const cachedOngoing =
    teamId != null
      ? queryClient.getQueryData<MeetingListItem[]>([
          ...MEETING_LIST_QUERY_KEY,
          teamId,
          "ONGOING",
        ])
      : undefined;
  const cachedCompleted =
    teamId != null
      ? queryClient.getQueryData<MeetingListItem[]>([
          ...MEETING_LIST_QUERY_KEY,
          teamId,
          "COMPLETED",
        ])
      : undefined;

  const inOngoing =
    cachedOngoing?.some((m) => m.meeting_id === meetingId) ?? false;
  const inCompleted =
    cachedCompleted?.some((m) => m.meeting_id === meetingId) ?? false;

  // 2) fallback: meeting detail의 end_date_time
  const { data: detail } = useMeetingDetail(meetingId);

  if (inOngoing) return <InProgressPage />;
  if (inCompleted) return <CompletedPage />;

  if (detail) {
    return detail.end_date_time ? <CompletedPage /> : <InProgressPage />;
  }

  return null;
};

export default MeetingRoutePage;
