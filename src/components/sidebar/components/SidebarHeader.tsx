import IconChevronDown from "@/assets/icons/arrow/ic_chevron_down.svg?react";
import IconMenuBurger from "@/assets/icons/menu/ic_menu_burger.svg?react";
import { Icon } from "@/components/common/Icon";

interface SidebarHeaderProps {
  isOpen: boolean;
}

export const SidebarHeader = ({ isOpen }: SidebarHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-12 shrink-0 items-center justify-center">
        <Icon icon={IconMenuBurger} size={20} className="h-[14px]" />
      </div>
      {isOpen && (
        <div className="flex items-center gap-1">
          <div className="size-[18px] rounded-sm bg-gray-400" />
          <span className="typo-subtitle3 whitespace-nowrap text-black">
            팀 명
          </span>
          <Icon icon={IconChevronDown} size={18} />
        </div>
      )}
    </div>
  );
};
