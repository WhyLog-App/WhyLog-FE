import { useState } from "react";
import IconCloseLg from "@/assets/icons/menu/ic_close_lg.svg?react";
import { Icon } from "@/components/common/Icon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLayout } from "@/layout/AppLayout/LayoutContext";
import { SidebarFooter } from "./components/SidebarFooter";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarNav } from "./components/SidebarNav";

const Sidebar = () => {
  const [hoverOpen, setHoverOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { isSidebarOpen, closeSidebar } = useLayout();

  // 모바일 드로어는 항상 확장 상태로 텍스트를 노출하고, 데스크톱은 hover로 토글
  const isExpanded = isDesktop ? hoverOpen : true;

  return (
    <aside
      id="app-sidebar"
      onMouseEnter={isDesktop ? () => setHoverOpen(true) : undefined}
      onMouseLeave={isDesktop ? () => setHoverOpen(false) : undefined}
      className={`fixed inset-y-0 left-0 z-40 flex h-screen w-58 shrink-0 flex-col gap-6 overflow-hidden border-r border-solid border-border-divider bg-white px-4 pb-8 pt-6 transition-all duration-300 lg:static lg:z-auto lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${hoverOpen ? "lg:w-58" : "lg:w-20"}
      `}
    >
      <button
        type="button"
        onClick={closeSidebar}
        aria-label="닫기"
        className="absolute right-3 top-3 flex size-9 cursor-pointer items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-action-hover lg:hidden"
      >
        <Icon icon={IconCloseLg} size={20} />
      </button>
      <SidebarHeader isOpen={isExpanded} />
      <SidebarNav isOpen={isExpanded} />
      <SidebarFooter isOpen={isExpanded} />
    </aside>
  );
};

export default Sidebar;
