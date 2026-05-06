import type React from "react";
import Panel from "@/components/panel";
import Sidebar from "@/components/sidebar";

const APP_BACKGROUND =
  "linear-gradient(-19.8deg, rgba(208,240,244,0.5) 10.78%, rgba(232,228,248,0.5) 42.16%, rgba(216,228,252,0.5) 89.22%), linear-gradient(#ffffff,#ffffff)";

const AppLayout = (props: { children?: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Panel />
      <main
        className="flex-1 overflow-auto px-20 3xl:px-50"
        style={{ backgroundImage: APP_BACKGROUND }}
      >
        {props.children}
      </main>
    </div>
  );
};

export default AppLayout;
