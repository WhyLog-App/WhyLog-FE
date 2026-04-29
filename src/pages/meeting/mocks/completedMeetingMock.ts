export interface CompletedTranscriptItem {
  id: string;
  name: string;
  time: string;
  text: string;
  profile_image: string | null;
}

export interface CompletedMeetingPanels {
  basicInfo: string[];
  topics: string[];
  context: string[];
  finalDecisions: string[];
  rationale: string[];
  misc: string[];
}

export interface CompletedMeetingMock {
  meeting_id: number;
  name: string;
  start_text: string;
  duration_text: string;
  member_count: number;
  members: { name: string; profile_image: string | null }[];
  transcript: CompletedTranscriptItem[];
  panels: CompletedMeetingPanels;
  audio: { duration_sec: number; current_sec: number };
}

export const completedMeetingMock: CompletedMeetingMock = {
  meeting_id: 0,
  name: "서버 개발 팀 1차 회의",
  start_text: "2026.01.30 일 오후 5:30",
  duration_text: "1시간 20분",
  member_count: 4,
  members: [
    { name: "김준용", profile_image: null },
    { name: "유진", profile_image: null },
    { name: "조윤지", profile_image: null },
    { name: "유상완", profile_image: null },
  ],
  transcript: [
    {
      id: "t1",
      name: "김준용",
      time: "00:10",
      text: "안녕하세요~",
      profile_image: null,
    },
    {
      id: "t2",
      name: "유진",
      time: "00:15",
      text: "안녕하세요~",
      profile_image: null,
    },
    {
      id: "t3",
      name: "김준용",
      time: "00:22",
      text: "유저의 폴 더 안 쓰는 거?",
      profile_image: null,
    },
    {
      id: "t4",
      name: "조윤지",
      time: "00:30",
      text: "개인한거네요!",
      profile_image: null,
    },
    {
      id: "t5",
      name: "조윤지",
      time: "00:30",
      text: "레포트",
      profile_image: null,
    },
    {
      id: "t6",
      name: "유상완",
      time: "25:40",
      text: "파일합니다",
      profile_image: null,
    },
    {
      id: "t7",
      name: "유상완",
      time: "26:40",
      text: "파일플레이더플레이트아너플레이플랫플레이리플레이니플레이플레이트플레이더플레이리플레이트플레이니플레이플레이더플레이더",
      profile_image: null,
    },
    {
      id: "t8",
      name: "유상완",
      time: "29:40",
      text: "사실 안 하죠요 ㅋ",
      profile_image: null,
    },
  ],
  panels: {
    basicInfo: [
      "회의 제목 : 양말 시스템 데이터를 정할 결정",
      "회의 목적 : 기술 스택 시스템을 학습할 및 김영진 문제 해결",
      "회의 시간 : 1시간 30분",
    ],
    topics: [
      "양말 연습 예기체에서 변경 여부",
      "Redis Pub/Sub vs Kafka 기반 연동",
      "라우팅 레이시 복적 방식성",
      "모범일의 복잡 철질성",
    ],
    context: [
      "Redis Pub/Sub 구조는 데이터 전송 기능이 충분함",
      "Kafka 도입 시 학습 복잡도는 비용 증가",
      "실시간성 만족을 운용에 매월 효율적 데에 추가 사항",
    ],
    finalDecisions: [
      "양말 연습 예기체에서 Kafka를 사용합니다.",
      "기준 Redis Pub/Sub 구조는 단계적으로 제거합니다.",
    ],
    rationale: [
      "데이터 내구성을 확보하여 손실에서 Kafka가 필수로 여겨질 가진",
      "트래픽 증가에 대한 수평 확장이 용이함",
      "문제 발생 우려 확인단계에, 여대법 필할의 위대한 구조",
    ],
    misc: ["Redis Streams 기반 개선안"],
  },
  audio: { duration_sec: 4800, current_sec: 1800 },
};
