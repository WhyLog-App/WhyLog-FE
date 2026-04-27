import {
  type RemoteParticipant,
  type RemoteTrack,
  Room,
  RoomEvent,
  Track,
  TrackEvent,
} from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRtcToken } from "@/apis/meetings";
import type { RoomParticipant as MeetingParticipant } from "../types";

interface UseLiveKitRoomOptions {
  meetingId: number | null;
}

/**
 * LiveKit SFU(Room) 연결 및 미디어 트랙 제어.
 * - Room 입장 / 퇴장
 * - 참가자 join / leave 이벤트
 * - 마이크 mute/unmute
 * - 원격 audio output volume 제어
 */
export const useLiveKitRoom = ({ meetingId }: UseLiveKitRoomOptions) => {
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isAudioOutputEnabled, setIsAudioOutputEnabled] = useState(true);

  const roomRef = useRef<Room | null>(null);
  // 신규 참가자 입장 시 최신 듣기 상태를 참조하기 위한 ref
  const isAudioOutputEnabledRef = useRef(true);

  const setMicrophoneEnabled = useCallback(async (enabled: boolean) => {
    const room = roomRef.current;
    if (!room) {
      setIsMicEnabled(enabled);
      return;
    }
    try {
      await room.localParticipant.setMicrophoneEnabled(enabled);
      setIsMicEnabled(enabled);
    } catch {
      /* mic 권한 거부 등 실패 시 상태 변경 안 함 */
    }
  }, []);

  const setAudioOutputEnabled = useCallback((enabled: boolean) => {
    isAudioOutputEnabledRef.current = enabled;
    setIsAudioOutputEnabled(enabled);
    const room = roomRef.current;
    if (!room) return;
    room.remoteParticipants.forEach((p) => {
      p.audioTrackPublications.forEach((pub) => {
        const track = pub.track;
        if (!track) return;
        track.attachedElements.forEach((el) => {
          el.volume = enabled ? 1 : 0;
        });
      });
    });
  }, []);

  useEffect(() => {
    if (meetingId == null) return;

    let cancelled = false;
    const room = new Room();
    roomRef.current = room;

    room.on(RoomEvent.ParticipantConnected, (p: RemoteParticipant) => {
      setParticipants((prev) => {
        if (prev.some((x) => x.id === p.identity)) return prev;
        return [...prev, { id: p.identity, name: p.name || p.identity }];
      });
    });
    room.on(RoomEvent.ParticipantDisconnected, (p: RemoteParticipant) => {
      setParticipants((prev) => prev.filter((x) => x.id !== p.identity));
    });

    // 새 audio track 구독 시 현재 듣기 상태(volume) 적용
    room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
      if (track.kind !== Track.Kind.Audio) return;
      const applyVolume = (el: HTMLMediaElement) => {
        el.volume = isAudioOutputEnabledRef.current ? 1 : 0;
      };
      track.attachedElements.forEach(applyVolume);
      track.on(TrackEvent.ElementAttached, applyVolume);
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
        setIsConnected(true);
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
      room.disconnect().catch(() => {
        /* noop */
      });
      roomRef.current = null;
      setIsConnected(false);
      setParticipants([]);
    };
  }, [meetingId]);

  return {
    participants,
    isConnected,
    errorMessage,
    isMicEnabled,
    isAudioOutputEnabled,
    setMicrophoneEnabled,
    setAudioOutputEnabled,
  };
};
