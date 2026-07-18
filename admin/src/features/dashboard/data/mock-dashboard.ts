export interface MockAdminStat {
  label: string
  value: string | number
  change: string
  trend: "up" | "down" | "neutral"
}

export interface MockRecentAction {
  id: string
  user: string
  action: string
  time: string
  type: "info" | "success" | "warning" | "error"
}

export const MOCK_ADMIN_STATS: MockAdminStat[] = [
  { label: "Total Registered Users", value: 124, change: "+12% this week", trend: "up" },
  { label: "Active Users Today", value: 45, change: "+8% vs yesterday", trend: "up" },
  { label: "AI Posts Suggested (Week)", value: 582, change: "+24% vs last week", trend: "up" },
  { label: "Claude API Expenses (June)", value: "$42.50", change: "-4% cost optimization", trend: "down" },
]

export const MOCK_RECENT_ACTIONS: MockRecentAction[] = [
  { id: "a1", user: "Raihan Ahmed", action: "Linked GitHub account @raihanahmed", time: "2 hours ago", type: "success" },
  { id: "a2", user: "Claude API Client", action: "Generated 4 posts for Raihan Ahmed (used 4,800 tokens)", time: "4 hours ago", type: "info" },
  { id: "a3", user: "n8n Cron Webhook", action: "Executed nightly generate-posts pipeline successfully", time: "12 hours ago", type: "success" },
  { id: "a4", user: "Sara Connor", action: "Created account and connected WakaTime", time: "1 day ago", type: "success" },
  { id: "a5", user: "Database Admin", action: "Failed n8n pipeline trigger for user_8 (Rate Limited)", time: "2 days ago", type: "error" },
]
