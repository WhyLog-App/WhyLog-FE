import type React from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";

const AppLayout = (props: { children?: React.ReactNode }) => {
  return (
    <div className="main">
      <Header />
      <main className="mx-auto max-w-screen-xl">{props.children}</main>
      <Footer />
    </div>
  );
};

export default AppLayout;
