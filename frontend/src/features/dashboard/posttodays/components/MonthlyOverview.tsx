"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getPostHistoryApi, getPostStreaksApi } from "../../posttodays/api/posts.api"

export function MonthlyOverview() {
  const [data, setData] = React.useState<{ day: number; status: string }[]>([])
  const [streakStats, setStreakStats] = React.useState({ currentStreak: 0, totalPosted: 0 })
  const [hoveredDay, setHoveredDay] = React.useState<{ day: number; status: string } | null>(null)

  const monthName = React.useMemo(() => {
    return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }, [])

  React.useEffect(() => {
    const fetchStreakData = async () => {
      try {
        const [historyRes, streaksRes] = await Promise.all([
          getPostHistoryApi(),
          getPostStreaksApi()
        ])

        if (historyRes.success && historyRes.data) {
          const posts = historyRes.data
          const now = new Date()
          const year = now.getFullYear()
          const monthIndex = now.getMonth() // 0-indexed

          // Days in current month
          const totalDays = new Date(year, monthIndex + 1, 0).getDate()
          const todayDateStr = now.toISOString().split("T")[0]

          const daysData = Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1
            const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

            const isFuture = new Date(dateStr) > new Date(todayDateStr)
            const hasPosted = posts.some(
              (p) => p.createdAt && p.createdAt.split("T")[0] === dateStr && p.status === "PUBLISHED"
            )

            let status = "none"
            if (isFuture) {
              status = "future"
            } else if (hasPosted) {
              status = "posted"
            } else {
              // Mark as skipped if it's in the past and they didn't post
              status = "skipped"
            }

            return { day, status }
          })

          setData(daysData)
        }

        if (streaksRes.success && streaksRes.data) {
          setStreakStats({
            currentStreak: streaksRes.data.currentStreak,
            totalPosted: streaksRes.data.totalPosts
          })
        }
      } catch (error) {
        console.error("Failed to load consistency map:", error)
      }
    }

    fetchStreakData()
  }, [])

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

  const postedCount = React.useMemo(() => data.filter((d) => d.status === "posted").length, [data])
  const skippedCount = React.useMemo(() => data.filter((d) => d.status === "skipped").length, [data])

  return (
    <Card className="bg-bg-surface border-border p-5 rounded-xl shadow-lg relative">
      <CardContent className="p-0 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted">Consistency Calendar</h3>
            <h4 className="font-display font-bold text-base text-text-primary mt-1">{monthName}</h4>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-success flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              {postedCount} Posted
            </span>
            <span className="text-warning flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-warning" />
              {skippedCount} Skipped
            </span>
            <span className="text-text-primary flex items-center gap-1.5">
              <span>{streakStats.currentStreak} day streak 🔥</span>
            </span>
          </div>
        </div>

        {/* Days grid container */}
        <div className="relative">
          {/* Tooltip Overlay */}
          {hoveredDay && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-bg-elevated border border-border text-[10px] px-2 py-1 rounded font-mono text-text-primary shadow-xl z-10 whitespace-nowrap">
              {monthName.split(" ")[0]} {hoveredDay.day} ·{" "}
              <span
                className={cn(
                  hoveredDay.status === "posted" && "text-success font-semibold",
                  hoveredDay.status === "skipped" && "text-warning font-semibold",
                  hoveredDay.status === "none" && "text-text-secondary",
                  hoveredDay.status === "future" && "text-text-muted"
                )}
              >
                {hoveredDay.status.toUpperCase()}
              </span>
            </div>
          )}

          {/* Dynamic Month days grid */}
          <div className="flex flex-wrap gap-2.5 justify-start py-2">
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
