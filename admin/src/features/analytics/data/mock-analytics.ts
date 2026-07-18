export interface MockUsageLog {
  id: string
  date: string
  user: string
  tokensUsed: number
  costUsd: number
  provider: string
}

export const MOCK_USAGE_LOGS: MockUsageLog[] = [
  { id: "u1", date: "2025-06-14", user: "Raihan Ahmed", tokensUsed: 4800, costUsd: 0.144, provider: "Claude 3.5 Sonnet" },
  { id: "u2", date: "2025-06-14", user: "Sara Connor", tokensUsed: 5200, costUsd: 0.156, provider: "Claude 3.5 Sonnet" },
  { id: "u3", date: "2025-06-13", user: "Raihan Ahmed", tokensUsed: 4600, costUsd: 0.138, provider: "Claude 3.5 Sonnet" },
  { id: "u4", date: "2025-06-13", user: "John Doe", tokensUsed: 6100, costUsd: 0.183, provider: "Claude 3.5 Sonnet" },
  { id: "u5", date: "2025-06-12", user: "Sara Connor", tokensUsed: 5000, costUsd: 0.150, provider: "Claude 3.5 Sonnet" },
]
