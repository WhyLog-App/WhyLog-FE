export interface CreateMeetingRequest {
  name: string;
  start_date_time: string;
}

export interface CreateMeetingResult {
  meeting_id: number;
  name: string;
  start_date_time: string;
  members: number[] | null;
}

export interface EndMeetingResult {
  meeting_id: number;
  end_date_time: string;
}

export type MeetingStatus = "ONGOING" | "COMPLETED";

export interface MeetingListItem {
  meeting_id: number;
  name: string;
  status: MeetingStatus;
  elapse: string | null;
}

export interface MeetingMember {
  member_id: number;
  name: string;
  profile_image: string | null;
}

export interface MeetingDetail {
  meeting_id: number;
  name: string;
  start_date_time: string;
  end_date_time: string | null;
  duration: number | null;
  member_count: number;
  members: MeetingMember[];
}

export interface RtcTokenResult {
  meeting_id: number;
  room_name: string;
  server_url: string;
  token: string;
}
