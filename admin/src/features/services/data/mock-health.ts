export interface MockCronLog {
  id: string
  triggerTime: string
  status: "success" | "failed"
  durationMs: number
  usersProcessed: number
  errorDetails?: string
}

export const MOCK_CRON_LOGS: MockCronLog[] = [
  { id: "c1", triggerTime: "2025-06-14 20:00:00", status: "success", durationMs: 4210, usersProcessed: 45 },
  { id: "c2", triggerTime: "2025-06-13 20:00:00", status: "success", durationMs: 3950, usersProcessed: 43 },
  { id: "c3", triggerTime: "2025-06-12 20:00:01", status: "success", durationMs: 4400, usersProcessed: 42 },
  { id: "c4", triggerTime: "2025-06-11 20:00:03", status: "failed", durationMs: 1200, usersProcessed: 18, errorDetails: "Claude API Rate Limit reached (status code 429) during post generation." },
  { id: "c5", triggerTime: "2025-06-10 20:00:00", status: "success", durationMs: 3800, usersProcessed: 40 },
]
