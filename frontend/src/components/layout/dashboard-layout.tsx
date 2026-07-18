"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { CommonNavbar } from "@/components/shared/common-navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <CommonNavbar />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
