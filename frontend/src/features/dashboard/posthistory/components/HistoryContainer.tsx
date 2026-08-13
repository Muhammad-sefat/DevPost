"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/EmptyState"
import { Clock, Filter, Loader2, Calendar } from "lucide-react"
import { getPostHistoryApi, getPostStreaksApi, Post, PostStreaks } from "../../posttodays/api/posts.api"

export function HistoryContainer() {
  const router = useRouter()
  const [history, setHistory] = React.useState<Post[]>([])
  const [streaks, setStreaks] = React.useState<PostStreaks | null>(null)
  const [loading, setLoading] = React.useState(true)

  const [monthFilter, setMonthFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [historyRes, streaksRes] = await Promise.all([
          getPostHistoryApi(),
          getPostStreaksApi(),
        ])
        if (historyRes.success && historyRes.data) {
          setHistory(historyRes.data)
        }
        if (streaksRes.success && streaksRes.data) {
          setStreaks(streaksRes.data)
        }
      } catch (error) {
        console.error("Failed to load post history:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Dynamically generate unique month filters based on actual history dates
  const months = React.useMemo(() => {
    const list: { value: string; label: string }[] = []
    const seen = new Set<string>()
    history.forEach((item) => {
      if (!item.createdAt) return
      const date = new Date(item.createdAt)
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, "0")
      const key = `${year}-${month}`
      if (!seen.has(key)) {
        seen.add(key)
        const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
        list.push({ value: key, label })
      }
    })
    return list.sort((a, b) => b.value.localeCompare(a.value)) // Show latest months first
  }, [history])

  // Current Month Posts count
  const postsThisMonth = React.useMemo(() => {
    const currentYearMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    return history.filter(item => item.createdAt && item.createdAt.startsWith(currentYearMonth)).length
  }, [history])

  // Filter logic
  const filteredHistory = React.useMemo(() => {
    return history.filter((item) => {
      const dateStr = item.createdAt ? item.createdAt.split("T")[0] : ""
      const matchesMonth =
        monthFilter === "all" ||
        dateStr.startsWith(monthFilter)

      const matchesStatus =
        statusFilter === "all" ||
        item.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesMonth && matchesStatus
    })
  }, [history, monthFilter, statusFilter])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-brand mx-auto" />
          <p className="text-xs text-text-secondary">Loading post history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto font-body">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-bg-surface border border-border p-4 rounded-xl font-mono text-center">
          <div className="border-r border-border/50 last:border-0 py-2">
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Total Posts</p>
            <h3 className="text-xl font-bold text-brand mt-1">{streaks?.totalPosts ?? 0}</h3>
          </div>
          <div className="border-r border-border/50 last:border-0 py-2">
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">This Month</p>
            <h3 className="text-xl font-bold text-success mt-1">{postsThisMonth}</h3>
          </div>
          <div className="py-2">
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Active Streak</p>
            <h3 className="text-xl font-bold text-warning mt-1">{streaks?.currentStreak ?? 0} days 🔥</h3>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-bg-surface/50 border border-border p-4 rounded-xl">
          {/* Status Tabs */}
          <div className="flex gap-1.5 w-full sm:w-auto">
            {["all", "published", "draft"].map((status) => (
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
              className="bg-bg-input border border-border text-xs text-text-primary p-2 h-9 rounded-lg focus:outline-none focus:border-brand min-w-[150px]"
            >
              <option value="all">All Months</option>
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Section */}
        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHistory.map((item) => {
              const dateStr = item.createdAt ? item.createdAt.split("T")[0] : ""
              const tagsList = item.tags ? item.tags.split(",").filter(Boolean).map(t => t.trim()) : []
              return (
                <Card key={item.id} className="bg-bg-surface border border-border hover:border-border-strong transition-all duration-200 p-5 rounded-xl flex flex-col justify-between h-56 shadow-sm hover:shadow-md">
                  <CardContent className="p-0 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-text-secondary flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {dateStr}
                        </span>
                        <Badge
                          variant={item.status === "PUBLISHED" ? "success" : "warning"}
                          className="text-[9px] font-mono rounded font-semibold py-0.5 px-2 uppercase"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-bold text-text-primary line-clamp-1 mb-1">{item.title}</h4>
                      <p className="text-xs text-text-secondary leading-relaxed font-body line-clamp-4">
                        &ldquo;{item.content}&rdquo;
                      </p>
                    </div>
                  </CardContent>
                  <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-border/40">
                    <Badge className="font-mono text-[9px] bg-brand/10 text-brand border-brand/20 rounded px-1.5 py-0">
                      LinkedIn Post
                    </Badge>
                    {tagsList.map((tag) => (
                      <Badge key={tag} className="font-mono text-[9px] bg-bg-elevated text-text-secondary border-border rounded px-1.5 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )
            })}
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
