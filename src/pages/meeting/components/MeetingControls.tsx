import IconHeadphones from "@/assets/icons/media/ic_headphones.svg?react";
import IconMic from "@/assets/icons/media/ic_mic.svg?react";
import IconCloseMd from "@/assets/icons/menu/ic_close_md.svg?react";
import { Icon } from "@/components/common/Icon";

interface MeetingControlsProps {
  onEnd: () => void;
}

const MeetingControls = ({ onEnd }: MeetingControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-(--color-bg-surface) shadow-[0px_2px_8px_0px_rgba(40,41,61,0.08)]"
      >
        <Icon
          icon={IconHeadphones}
          size={20}
          className="text-(--color-text-primary)"
        />
      </button>
      <button
        type="button"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-(--color-bg-surface) shadow-[0px_2px_8px_0px_rgba(40,41,61,0.08)]"
      >
        <Icon
          icon={IconMic}
          size={20}
          className="text-(--color-text-primary)"
        />
      </button>
      <button
        type="button"
        onClick={onEnd}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-(--color-red-500) shadow-[0px_2px_8px_0px_rgba(40,41,61,0.08)]"
      >
        <Icon
          icon={IconCloseMd}
          size={20}
          className="text-(--color-text-inverse)"
        />
      </button>
    </div>
  );
};

export default MeetingControls;
