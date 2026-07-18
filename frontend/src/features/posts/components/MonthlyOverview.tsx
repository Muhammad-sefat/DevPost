"use client"

import * as React from "react"
import { MOCK_MONTHLY } from "../data/mock-posts"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function MonthlyOverview() {
  const data = MOCK_MONTHLY
  const [hoveredDay, setHoveredDay] = React.useState<{ day: number; status: string } | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted":
        return "bg-success hover:scale-110"
      case "skipped":
        return "bg-warning hover:scale-110"
      case "none":
        return "bg-bg-elevated hover:bg-bg-elevated/80 hover:scale-110"
      case "future":
        return "bg-bg-elevated/30 cursor-not-allowed"
      default:
        return "bg-bg-elevated"
    }
  }

  return (
    <Card className="bg-bg-surface border-border p-5 rounded-xl shadow-lg relative">
      <CardContent className="p-0 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted">Contribution Map</h3>
            <h4 className="font-display font-bold text-base text-text-primary mt-1">June 2025</h4>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-success flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              12 Posted
            </span>
            <span className="text-warning flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-warning" />
              8 Skipped
            </span>
            <span className="text-text-primary flex items-center gap-1.5">
              <span>8 day streak 🔥</span>
            </span>
          </div>
        </div>

        {/* Days grid container */}
        <div className="relative">
          {/* Tooltip Overlay */}
          {hoveredDay && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-bg-elevated border border-border text-[10px] px-2 py-1 rounded font-mono text-text-primary shadow-xl z-10 whitespace-nowrap">
              June {hoveredDay.day} · <span className={cn(
                hoveredDay.status === "posted" && "text-success font-semibold",
                hoveredDay.status === "skipped" && "text-warning font-semibold",
                hoveredDay.status === "none" && "text-text-secondary",
                hoveredDay.status === "future" && "text-text-muted"
              )}>{hoveredDay.status.toUpperCase()}</span>
            </div>
          )}

          {/* 30-day grid */}
          <div className="flex flex-wrap gap-2.5 justify-between py-2">
            {data.map((item) => (
              <div
                key={item.day}
                className={cn(
                  "h-8 w-8 rounded transition-all duration-200 cursor-pointer flex items-center justify-center text-[10px] font-mono text-text-muted",
                  getStatusColor(item.status)
                )}
                onMouseEnter={() => setHoveredDay({ day: item.day, status: item.status })}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {item.day}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
