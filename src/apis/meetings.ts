import ENDPOINT from "@/constants/endpoint";
import type { ApiResponse } from "@/types/auth";
import type {
  CreateMeetingRequest,
  CreateMeetingResult,
  EndMeetingResult,
  RtcTokenResult,
} from "@/types/meeting";
import { http } from "@/utils/http";

export const createMeeting = async (
  teamId: number,
  payload: CreateMeetingRequest,
): Promise<CreateMeetingResult> => {
  const { data } = await http.post<
    CreateMeetingRequest,
    { data: ApiResponse<CreateMeetingResult> }
  >(ENDPOINT.MEETINGS.CREATE(teamId), payload);
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
};

export const getRtcToken = async (
  meetingId: number,
): Promise<{ serverUrl: string; token: string; roomName: string }> => {
  const { data } = await http.get<
    unknown,
    { data: ApiResponse<RtcTokenResult> }
  >(ENDPOINT.MEETINGS.RTC_TOKEN(meetingId));
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return {
    serverUrl: data.result.server_url,
    token: data.result.token,
    roomName: data.result.room_name,
  };
};

export const endMeeting = async (
  meetingId: number,
): Promise<EndMeetingResult> => {
  const { data } = await http.patch<
    undefined,
    { data: ApiResponse<EndMeetingResult> }
  >(ENDPOINT.MEETINGS.END(meetingId));
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
};
