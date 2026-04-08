import { type RemoteParticipant, Room, RoomEvent } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { getRtcToken } from "@/apis/meetings";
import { WS_BASE_URL } from "@/constants/endpoint";
import { tokenStore } from "@/utils/tokenStore";

export interface RoomParticipant {
  id: string;
  name: string;
  isSelf?: boolean;
}

interface UseMeetingRoomOptions {
  meetingId: number | null;
  displayName: string;
}

export const useMeetingRoom = ({
  meetingId,
  displayName,
}: UseMeetingRoomOptions) => {
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [isRoomConnected, setIsRoomConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const roomRef = useRef<Room | null>(null);

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
        const msg = JSON.parse(ev.data);
        if (msg.type === "connected" || msg.type === "roster") {
          if (Array.isArray(msg.participants)) {
            setParticipants(
              msg.participants.map(
                (
                  p: { id?: string | number; name?: string; self?: boolean },
                  idx: number,
                ) => ({
                  id: String(p.id ?? idx),
                  name: p.name ?? `참가자${idx + 1}`,
                  isSelf: p.self,
                }),
              ),
            );
          }
        }
        // chat / audio_text / speech / participant_joined / left / meeting_ended
        // 는 이번 최소 동작 범위 밖
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
      setParticipants((prev) => [
        ...prev,
        { id: p.identity, name: p.name || p.identity },
      ]);
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
    };
  }, [meetingId, displayName]);

  return {
    participants,
    isWsConnected,
    isRoomConnected,
    errorMessage,
  };
};
