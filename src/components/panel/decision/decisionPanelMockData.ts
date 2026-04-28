export const mockDecisionMeetings = [
  {
    id: "meeting-5",
    title: "서버 개발 팀 5차 회의",
    date: "2025.02.01",
    decisions: [],
  },
  {
    id: "meeting-4",
    title: "서버 개발 팀 4차 회의",
    date: "2025.01.25",
    decisions: [
      { id: "d-1", label: "Redis 키 정책 변경", status: "active" as const },
      { id: "d-2", label: "Redis 키 정책 변경", status: "warning" as const },
      { id: "d-3", label: "Redis 키 정책 변경", status: "default" as const },
    ],
  },
  {
    id: "meeting-3",
    title: "서버 개발 팀 3차 회의",
    date: "2025.01.20",
    decisions: [],
  },
  {
    id: "meeting-2",
    title: "서버 개발 팀 2차 회의",
    date: "2025.01.17",
    decisions: [],
  },
  {
    id: "meeting-1",
    title: "서버 개발 팀 1차 회의",
    date: "2025.01.15",
    decisions: [],
  },
];
