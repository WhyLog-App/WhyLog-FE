import { useQuery } from "@tanstack/react-query";
import { listMeetings } from "@/apis/meetings";
import type { MeetingListItem } from "@/types/meeting";

export const MEETING_LIST_QUERY_KEY = ["meetings"] as const;

export const useMeetingList = (teamId: number | null) => {
  const ongoingQuery = useQuery<MeetingListItem[]>({
    queryKey: [...MEETING_LIST_QUERY_KEY, teamId, "ONGOING"],
    queryFn: () => {
      if (!teamId) throw new Error("Team ID is required");
      return listMeetings(teamId, "ONGOING");
    },
    enabled: !!teamId,
  });

  const completedQuery = useQuery<MeetingListItem[]>({
    queryKey: [...MEETING_LIST_QUERY_KEY, teamId, "COMPLETED"],
    queryFn: () => {
      if (!teamId) throw new Error("Team ID is required");
      return listMeetings(teamId, "COMPLETED");
    },
    enabled: !!teamId,
  });

  return {
    ongoing: ongoingQuery.data ?? [],
    completed: completedQuery.data ?? [],
    isLoading: ongoingQuery.isLoading || completedQuery.isLoading,
    isError: ongoingQuery.isError || completedQuery.isError,
  };
};
