import { useQuery } from "@tanstack/react-query";
import { listMeetings } from "@/apis/meetings";
import type { MeetingListItem } from "@/types/meeting";

// TODO: teamId를 로그인 응답/팀 컨텍스트에서 가져오도록 교체
const TEMP_TEAM_ID = 3;

export const MEETING_LIST_QUERY_KEY = ["meetings"] as const;

export const useMeetingList = () => {
  const ongoingQuery = useQuery<MeetingListItem[]>({
    queryKey: [...MEETING_LIST_QUERY_KEY, TEMP_TEAM_ID, "ONGOING"],
    queryFn: () => listMeetings(TEMP_TEAM_ID, "ONGOING"),
  });

  const completedQuery = useQuery<MeetingListItem[]>({
    queryKey: [...MEETING_LIST_QUERY_KEY, TEMP_TEAM_ID, "COMPLETED"],
    queryFn: () => listMeetings(TEMP_TEAM_ID, "COMPLETED"),
  });

  return {
    ongoing: ongoingQuery.data ?? [],
    completed: completedQuery.data ?? [],
    isLoading: ongoingQuery.isLoading || completedQuery.isLoading,
    isError: ongoingQuery.isError || completedQuery.isError,
  };
};
