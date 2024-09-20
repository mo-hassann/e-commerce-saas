import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import React from "react";

type props = {
  children: React.ReactNode;
};

export default function DashBoardLayout({ children }: props) {
  return (
    <div className="flex h-full bg-muted">
      <Sidebar />
      <div className="size-full">
        <Header />
        {children}
      </div>
    </div>
  );
}
