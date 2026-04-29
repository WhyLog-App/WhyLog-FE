import { useState } from "react";

interface AudioPlayerBarProps {
  durationSec: number;
  initialCurrentSec?: number;
}

const RewindIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);

const ForwardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 4v5h-5" />
  </svg>
);

const PlayIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 5v14l11-7L8 5z" />
  </svg>
);

const PauseIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

const AudioPlayerBar = ({
  durationSec,
  initialCurrentSec = 0,
}: AudioPlayerBarProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const progressPct =
    durationSec > 0
      ? Math.min(100, Math.round((initialCurrentSec / durationSec) * 100))
      : 0;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-bg-subtle)"
        aria-label="뒤로 감기"
      >
        <RewindIcon />
      </button>

      <button
        type="button"
        onClick={() => setIsPlaying((v) => !v)}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-(--color-primary-500) text-white hover:opacity-90"
        aria-label={isPlaying ? "일시정지" : "재생"}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button
        type="button"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-bg-subtle)"
        aria-label="앞으로 감기"
      >
        <ForwardIcon />
      </button>

      <div className="ml-2 flex-1">
        <div className="h-1.5 w-full rounded-full bg-(--color-bg-subtle)">
          <div
            className="h-full rounded-full bg-(--color-primary-500)"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerBar;
