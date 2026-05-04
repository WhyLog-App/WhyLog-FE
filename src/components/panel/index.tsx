import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import DecisionPanel from "./decision/DecisionPanel";
import MeetingPanel from "./meeting/MeetingPanel";
import RepositoryPanel from "./repository/RepositoryPanel";

const Panel = () => {
  const { pathname } = useLocation();

  let content: ReactNode = null;
  if (/\/decisions(\/|$)/.test(pathname)) {
    content = <DecisionPanel />;
  } else if (/\/meeting(\/|$)/.test(pathname)) {
    content = <MeetingPanel />;
  } else if (/\/git(\/|$)/.test(pathname)) {
    content = <RepositoryPanel />;
  }

  if (!content) return null;

  return (
    <aside className="flex h-screen w-70 shrink-0 flex-col gap-4 overflow-hidden border-r border-solid border-(--color-border-default) bg-(--color-bg-surface) pt-10 pb-8 shadow-[0px_0px_2px_0px_rgba(40,41,61,0.04),0px_4px_8px_0px_rgba(96,97,112,0.16)]">
      {content}
    </aside>
  );
};

export default Panel;
