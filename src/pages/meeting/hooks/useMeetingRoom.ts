import { type RemoteParticipant, Room, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRtcToken } from "@/apis/meetings";
import { WS_BASE_URL } from "@/constants/endpoint";
import { tokenStore } from "@/utils/tokenStore";

export interface RoomParticipant {
  id: string;
  name: string;
  isSelf?: boolean;
}

export interface TranscriptEntry {
  id: string;
  memberId: number | null;
  fromName: string;
  text: string;
  timestamp: string;
  isFinal: boolean;
}

export interface InterimEntry {
  memberId: number | null;
  fromName: string;
  text: string;
  timestamp: string;
}

interface UseMeetingRoomOptions {
  meetingId: number | null;
  displayName: string;
}

type OutgoingMessageType = "chat" | "audio_text" | "speech";

export const useMeetingRoom = ({
  meetingId,
  displayName,
}: UseMeetingRoomOptions) => {
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [isRoomConnected, setIsRoomConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [interimByMember, setInterimByMember] = useState<
    Record<string, InterimEntry>
  >({});

  const wsRef = useRef<WebSocket | null>(null);
  const roomRef = useRef<Room | null>(null);

  const sendMessage = useCallback((type: OutgoingMessageType, text: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify({ type, text }));
    return true;
  }, []);

  useEffect(() => {
    if (meetingId == null) return;

    const accessToken = tokenStore.getToken();
    if (!accessToken) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    let cancelled = false;

    // 1) WebSocket 연결 (회의 입장)
    const wsUrl =
      `${WS_BASE_URL}/ws/meetings` +
      `?meetingId=${meetingId}` +
      `&accessToken=${encodeURIComponent(accessToken)}` +
      `&name=${encodeURIComponent(displayName)}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!cancelled) setIsWsConnected(true);
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as {
          type: string;
          participants?: Array<{
            id?: string | number;
            memberId?: string | number;
            name?: string;
            self?: boolean;
          }>;
          fromMemberId?: number;
          fromName?: string;
          memberId?: number;
          name?: string;
          text?: string;
          timestamp?: string;
        };
        switch (msg.type) {
          case "connected":
          case "roster": {
            if (Array.isArray(msg.participants)) {
              setParticipants(
                msg.participants.map((p, idx) => ({
                  id: String(p.memberId ?? p.id ?? idx),
                  name: p.name ?? `참가자${idx + 1}`,
                  isSelf: p.self,
                })),
              );
            }
            break;
          }
          case "participant_joined": {
            if (msg.memberId != null) {
              setParticipants((prev) => {
                const id = String(msg.memberId);
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
            if (msg.memberId != null) {
              const leftId = String(msg.memberId);
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
            const key = String(msg.fromMemberId ?? "unknown");
            setInterimByMember((prev) => ({
              ...prev,
              [key]: {
                memberId: msg.fromMemberId ?? null,
                fromName: msg.fromName ?? "참가자",
                text: msg.text ?? "",
                timestamp: msg.timestamp ?? new Date().toISOString(),
              },
            }));
            break;
          }
          case "speech": {
            const key = String(msg.fromMemberId ?? "unknown");
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
                memberId: msg.fromMemberId ?? null,
                fromName: msg.fromName ?? "참가자",
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
      if (!cancelled) setIsWsConnected(false);
    };

    // 2) LiveKit SFU 연결
    const room = new Room();
    roomRef.current = room;

    room.on(RoomEvent.ParticipantConnected, (p: RemoteParticipant) => {
      setParticipants((prev) => {
        // 중복 체크: WebSocket과 LiveKit 양쪽에서 참가자 관리 시 중복 방지
        if (prev.some((x) => x.id === p.identity)) return prev;
        return [...prev, { id: p.identity, name: p.name || p.identity }];
      });
    });
    room.on(RoomEvent.ParticipantDisconnected, (p: RemoteParticipant) => {
      setParticipants((prev) => prev.filter((x) => x.id !== p.identity));
    });

    (async () => {
      try {
        const { serverUrl, token } = await getRtcToken(meetingId);
        if (cancelled) return;
        await room.connect(serverUrl, token);
        if (cancelled) {
          await room.disconnect();
          return;
        }
        setIsRoomConnected(true);
        await room.localParticipant.setMicrophoneEnabled(true);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : "회의방 연결 실패",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        ws.close();
      } catch {
        /* noop */
      }
      room.disconnect().catch(() => {
        /* noop */
      });
      wsRef.current = null;
      roomRef.current = null;
      setIsWsConnected(false);
      setIsRoomConnected(false);
      setTranscripts([]);
      setInterimByMember({});
    };
  }, [meetingId, displayName]);

  return {
    participants,
    isWsConnected,
    isRoomConnected,
    errorMessage,
    transcripts,
    interimByMember,
    sendMessage,
  };
};
