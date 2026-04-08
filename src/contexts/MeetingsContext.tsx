import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface Participant {
  id: string;
  name: string;
  isSelf?: boolean;
}

export interface Meeting {
  id: string;
  name: string;
  startedAt: number;
  participants: Participant[];
  status: "in-progress" | "ended";
}

interface MeetingsContextValue {
  meetings: Meeting[];
  getMeeting: (id: string) => Meeting | undefined;
  startMeeting: (name: string, mockParticipants?: number) => string;
  endMeeting: (id: string) => void;
}

const STORAGE_KEY = "whylog:meetings";

const MOCK_NAMES = [
  "김개발",
  "이디자인",
  "박기획",
  "최테스트",
  "정서버",
  "강클라이",
];

const buildParticipants = (count: number): Participant[] => {
  const safeCount = Math.max(1, Math.min(count, MOCK_NAMES.length));
  return MOCK_NAMES.slice(0, safeCount).map((name, idx) => ({
    id: `p-${idx}`,
    name,
    isSelf: idx === 0,
  }));
};

const loadFromStorage = (): Meeting[] => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Meeting[];
  } catch {
    return [];
  }
};

const MeetingsContext = createContext<MeetingsContextValue | null>(null);

export const MeetingsProvider = ({ children }: { children: ReactNode }) => {
  const [meetings, setMeetings] = useState<Meeting[]>(() => loadFromStorage());

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    } catch {
      // ignore
    }
  }, [meetings]);

  const getMeeting = useCallback(
    (id: string) => meetings.find((m) => m.id === id),
    [meetings],
  );

  const startMeeting = useCallback(
    (name: string, mockParticipants = 2): string => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `m-${Date.now()}`;
      const meeting: Meeting = {
        id,
        name,
        startedAt: Date.now(),
        participants: buildParticipants(mockParticipants),
        status: "in-progress",
      };
      setMeetings((prev) => [meeting, ...prev]);
      return id;
    },
    [],
  );

  const endMeeting = useCallback((id: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "ended" } : m)),
    );
  }, []);

  const value = useMemo(
    () => ({ meetings, getMeeting, startMeeting, endMeeting }),
    [meetings, getMeeting, startMeeting, endMeeting],
  );

  return (
    <MeetingsContext.Provider value={value}>
      {children}
    </MeetingsContext.Provider>
  );
};

export const useMeetings = () => {
  const ctx = useContext(MeetingsContext);
  if (!ctx) throw new Error("useMeetings must be used within MeetingsProvider");
  return ctx;
};
