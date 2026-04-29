import { useCallback, useEffect, useRef, useState } from "react";
import { WS_BASE_URL } from "@/constants/endpoint";
import { tokenStore } from "@/utils/tokenStore";
import type {
  InterimEntry,
  OutgoingMessageType,
  RoomParticipant,
  TranscriptEntry,
} from "../types";

interface UseMeetingSignalingOptions {
  meetingId: number | null;
  displayName: string;
}

// WebSocket frame 형태
interface SignalingFrame {
  type: string;
  meeting_id?: number;
  participants?: Array<{
    id?: string | number;
    member_id?: string | number;
    name?: string;
    self?: boolean;
  }>;
  from_member_id?: number;
  from_name?: string;
  member_id?: number;
  name?: string;
  text?: string;
  timestamp?: string;
}

/**
 * 회의 WebSocket signaling 채널 관리.
 * - 참가자 roster / join / leave
 * - 실시간 transcript (interim / final)
 * - 메세지 송신 (chat / audio_text / speech)
 */
export const useMeetingSignaling = ({
  meetingId,
  displayName,
}: UseMeetingSignalingOptions) => {
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [interimByMember, setInterimByMember] = useState<
    Record<string, InterimEntry>
  >({});

  const wsRef = useRef<WebSocket | null>(null);

  const sendMessage = useCallback((type: OutgoingMessageType, text: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify({ type, text }));
    return true;
  }, []);

  useEffect(() => {
    if (meetingId == null) return;
    if (!displayName) return;

    const accessToken = tokenStore.getToken();
    if (!accessToken) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    let cancelled = false;

    const wsUrl =
      `${WS_BASE_URL}/ws/meetings` +
      `?meetingId=${meetingId}` +
      `&accessToken=${encodeURIComponent(accessToken)}` +
      `&name=${encodeURIComponent(displayName)}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!cancelled) setIsConnected(true);
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as SignalingFrame;
        switch (msg.type) {
          case "connected":
          case "roster": {
            if (Array.isArray(msg.participants)) {
              setParticipants(
                msg.participants.map((p, idx) => ({
                  id: String(p.member_id ?? p.id ?? idx),
                  name: p.name ?? `참가자${idx + 1}`,
                  isSelf: p.self,
                })),
              );
            }
            break;
          }
          case "participant_joined": {
            if (msg.member_id != null) {
              setParticipants((prev) => {
                const id = String(msg.member_id);
                if (prev.some((p) => p.id === id)) return prev;
                return [
                  ...prev,
                  { id, name: msg.name ?? `참가자${prev.length + 1}` },
                ];
              });
            }
            break;
          }
          case "participant_left": {
            if (msg.member_id != null) {
              const leftId = String(msg.member_id);
              setParticipants((prev) => prev.filter((p) => p.id !== leftId));
              setInterimByMember((prev) => {
                const next = { ...prev };
                delete next[leftId];
                return next;
              });
            }
            break;
          }
          case "audio_text": {
            const key = String(msg.from_member_id ?? "unknown");
            setInterimByMember((prev) => ({
              ...prev,
              [key]: {
                memberId: msg.from_member_id ?? null,
                fromName: msg.from_name ?? "참가자",
                text: msg.text ?? "",
                timestamp: msg.timestamp ?? new Date().toISOString(),
              },
            }));
            break;
          }
          case "speech": {
            const key = String(msg.from_member_id ?? "unknown");
            setInterimByMember((prev) => {
              if (!(key in prev)) return prev;
              const next = { ...prev };
              delete next[key];
              return next;
            });
            setTranscripts((prev) => [
              ...prev,
              {
                id: `${key}-${msg.timestamp ?? Date.now()}-${prev.length}`,
                memberId: msg.from_member_id ?? null,
                fromName: msg.from_name ?? "참가자",
                text: msg.text ?? "",
                timestamp: msg.timestamp ?? new Date().toISOString(),
                isFinal: true,
              },
            ]);
            break;
          }
          case "meeting_ended": {
            setErrorMessage("회의가 종료되었습니다.");
            break;
          }
          default:
            break;
        }
      } catch {
        // ignore non-JSON frames
      }
    };

    ws.onerror = () => {
      if (!cancelled) setErrorMessage("WebSocket 연결 오류");
    };

    ws.onclose = () => {
      if (!cancelled) setIsConnected(false);
    };

    return () => {
      cancelled = true;
      try {
        ws.close();
      } catch {
        /* noop */
      }
      wsRef.current = null;
      setIsConnected(false);
      setTranscripts([]);
      setInterimByMember({});
    };
  }, [meetingId, displayName]);

  return {
    participants,
    isConnected,
    errorMessage,
    transcripts,
    interimByMember,
    sendMessage,
  };
};
