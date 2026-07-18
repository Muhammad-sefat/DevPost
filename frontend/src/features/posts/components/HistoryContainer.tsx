"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MOCK_HISTORY } from "../data/mock-posts"
import { TopBar } from "@/components/layout/TopBar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/EmptyState"
import { Clock, Calendar, ArrowRight, Filter } from "lucide-react"

export function HistoryContainer() {
  const router = useRouter()
  const history = MOCK_HISTORY

  const [monthFilter, setMonthFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")

  // Filter logic
  const filteredHistory = history.filter((item) => {
    const matchesMonth =
      monthFilter === "all" ||
      (monthFilter === "06" && item.date.startsWith("2025-06")) ||
      (monthFilter === "05" && item.date.startsWith("2025-05"))

    const matchesStatus =
      statusFilter === "all" ||
      item.status === statusFilter

    return matchesMonth && matchesStatus
  })

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <TopBar title="Post History" subtitle="Review your generated post history and drafts" />

      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto font-body">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-bg-surface border border-border p-4 rounded-xl font-mono text-center">
          <div className="border-r border-border/50 last:border-0 py-2">
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Total Posts</p>
            <h3 className="text-xl font-bold text-brand mt-1">28</h3>
          </div>
          <div className="border-r border-border/50 last:border-0 py-2">
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">This Month</p>
            <h3 className="text-xl font-bold text-success mt-1">12</h3>
          </div>
          <div className="py-2">
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Longest Streak</p>
            <h3 className="text-xl font-bold text-warning mt-1">14 days</h3>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-bg-surface/50 border border-border p-4 rounded-xl">
          {/* Status Tabs */}
          <div className="flex gap-1.5 w-full sm:w-auto">
            {["all", "posted", "skipped"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-2 rounded-lg transition-colors border-0 cursor-pointer ${
                  statusFilter === status
                    ? "bg-brand text-text-inverse"
                    : "bg-bg-elevated text-text-secondary hover:text-text-primary"
                }`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Month Dropdown Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <Filter className="h-3.5 w-3.5 text-text-secondary" />
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-bg-input border border-border text-xs text-text-primary p-2 h-9 rounded-lg focus:outline-none focus:border-brand min-w-[130px]"
            >
              <option value="all">All Months</option>
              <option value="06">June 2025</option>
              <option value="05">May 2025</option>
            </select>
          </div>
        </div>

        {/* Content Section */}
        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="bg-bg-surface border border-border hover:border-border-strong transition-colors p-5 rounded-xl flex flex-col justify-between h-56">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-text-secondary">{item.date}</span>
                    <Badge
                      variant={item.status === "posted" ? "success" : "warning"}
                      className="text-[9px] font-mono rounded font-semibold py-0.5 px-2 uppercase"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-primary leading-relaxed font-body line-clamp-4">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </CardContent>
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.tags.map((tag) => (
                    <Badge key={tag} className="font-mono text-[9px] bg-bg-elevated text-text-secondary border-border rounded px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Clock}
            title="No posts here yet"
            description="Adjust your filters or generate new suggestions based on your commits."
            actionLabel="Go to Today's Posts"
            onAction={() => router.push("/dashboard")}
          />
        )}
      </div>
    </div>
  )
}
