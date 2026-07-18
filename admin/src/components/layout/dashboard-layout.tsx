"use client"

import { ReactNode } from "react"
import { Sidebar } from "./Sidebar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col md:flex-row overflow-hidden">
      {/* Responsive Navigation Sidebar */}
      <Sidebar />

      {/* Main Content offset */}
      <div className="flex-1 flex flex-col md:pl-[240px] pb-16 md:pb-0 overflow-x-hidden min-h-screen">
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
}
