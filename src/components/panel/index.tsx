import { useLocation } from "react-router-dom";
import MeetingPanel from "./meeting/MeetingPanel";
import RepositoryPanel from "./repository/RepositoryPanel";

const Panel = () => {
  const { pathname } = useLocation();

  const renderContent = () => {
    if (/\/meeting(\/|$)/.test(pathname)) {
      return <MeetingPanel />;
    }
    if (pathname.startsWith("/git")) {
      return <RepositoryPanel />;
    }
    return null;
  };

  return (
    <aside className="flex h-screen w-70 shrink-0 flex-col gap-4 overflow-hidden border-r border-solid border-(--color-border-default) bg-(--color-bg-surface) pt-10 pb-8 shadow-[0px_0px_2px_0px_rgba(40,41,61,0.04),0px_4px_8px_0px_rgba(96,97,112,0.16)]">
      {renderContent()}
    </aside>
  );
};

export default Panel;
