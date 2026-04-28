import IconClock from "@/assets/icons/media/ic_clock.svg?react";
import IconGit from "@/assets/icons/media/ic_git.svg?react";
import { Icon } from "@/components/common/Icon";

interface RepositoryPanelItemProps {
  name: string;
  updatedAtText: string;
  isActive?: boolean;
  onClick?: () => void;
}

const RepositoryPanelItem = ({
  name,
  updatedAtText,
  isActive = false,
  onClick,
}: RepositoryPanelItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center justify-between rounded-lg p-3 ${
        isActive
          ? "bg-(--color-action-active)"
          : "bg-(--color-bg-surface) hover:bg-(--color-action-hover)"
      }`}
    >
      <span className="flex items-center gap-0.5">
        <Icon icon={IconGit} size={16} className="text-(--color-text-primary)" />
        <span className="typo-subtitle5 text-(--color-text-primary)">{name}</span>
      </span>

      <span className="flex items-center gap-0.5">
        <Icon icon={IconClock} size={12} className="text-(--color-text-tertiary)" />
        <span className="typo-caption2 text-(--color-text-tertiary)">
          {updatedAtText}
        </span>
      </span>
    </button>
  );
};

export default RepositoryPanelItem;
