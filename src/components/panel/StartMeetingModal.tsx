import { useState } from "react";
import IconCloseMd from "@/assets/icons/menu/ic_close_md.svg?react";
import { Icon } from "@/components/common/Icon";

interface StartMeetingModalProps {
  onClose: () => void;
  onStart: (meetingName: string) => void;
}

const StartMeetingModal = ({ onClose, onStart }: StartMeetingModalProps) => {
  const [meetingName, setMeetingName] = useState("");

  const handleStart = () => {
    if (meetingName.trim()) {
      onStart(meetingName.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dim Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-(--color-overlay-dim)"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      />

      {/* Modal */}
      <div className="relative flex w-110 flex-col gap-7 overflow-hidden rounded-3xl border border-(--color-border-default) bg-(--color-bg-subtle) px-9 pt-8 pb-9 shadow-[0px_2px_8px_0px_rgba(40,41,61,0.08),0px_20px_32px_0px_rgba(96,97,112,0.24)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="typo-h5 text-(--color-text-primary)">회의 시작하기</h3>
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center rounded-lg py-1"
            onClick={onClose}
          >
            <Icon
              icon={IconCloseMd}
              size={24}
              className="text-(--color-text-primary)"
            />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="meeting-name"
            className="typo-label text-(--color-text-secondary)"
          >
            회의 이름
          </label>
          <input
            id="meeting-name"
            type="text"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="회의 이름을 입력하세요"
            className="typo-body6 h-11 w-full rounded-full border border-white bg-white/50 px-4 py-3 text-(--color-text-primary) placeholder:text-(--color-text-tertiary) focus:outline-none"
          />
        </div>

        {/* Button Group */}
        <div className="flex gap-3">
          <button
            type="button"
            className="typo-button-md flex flex-1 cursor-pointer items-center justify-center rounded-xl border-[1.5px] border-white bg-white/50 px-7 py-3.5 text-(--color-text-secondary)"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="typo-button-md flex flex-1 cursor-pointer items-center justify-center rounded-xl px-7 py-3.5 text-(--color-text-inverse) shadow-[0px_4px_12px_0px_rgba(30,91,232,0.2)]"
            style={{
              backgroundImage:
                "linear-gradient(147deg, #5b8def 15.47%, #0063f7 84.42%)",
            }}
            onClick={handleStart}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMeetingModal;
