import { useState } from "react";
import { SidebarFooter } from "./components/SidebarFooter";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarNav } from "./components/SidebarNav";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`flex h-screen shrink-0 flex-col gap-6 overflow-hidden border-r border-solid border-border-divider bg-white px-4 pb-8 pt-6 transition-all duration-300
        ${isOpen ? "w-58" : "w-20"}
      `}
    >
      <SidebarHeader isOpen={isOpen} />
      <SidebarNav isOpen={isOpen} />
      <SidebarFooter isOpen={isOpen} />
    </aside>
  );
};

export default Sidebar;
