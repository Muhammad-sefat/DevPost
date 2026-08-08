"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname() || ""

  // Determine title and subtitle based on current route
  let title = "Today's Posts"
  let subtitle = "Monday, June 14 · Based on your activity"

  if (pathname.includes("/history")) {
    title = "Post History"
    subtitle = "Review your generated post history and drafts"
  } else if (pathname.includes("/settings")) {
    title = "Settings"
    subtitle = "Manage your profile, integrations, and preferences"
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col md:flex-row overflow-hidden">
      {/* Responsive Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-[240px] pb-16 md:pb-0 h-screen overflow-hidden">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
