import type React from "react";
import Panel from "@/components/panel";
import Sidebar from "@/components/sidebar";

const AppLayout = (props: { children?: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Panel />
      <main className="flex-1 overflow-auto px-20 3xl:px-50">
        {props.children}
      </main>
    </div>
  );
};

export default AppLayout;
