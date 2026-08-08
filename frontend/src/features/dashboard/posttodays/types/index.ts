export interface MockPostIdea {
  id: string
  text: string
  tags: string[]
  selected: boolean
  posted: boolean
}

export interface MockMonthlyDay {
  day: number
  status: "posted" | "skipped" | "none" | "future"
}

export interface MockActivity {
  date: string
  github: {
    commits: number
    repos: string[]
    prs: number
  }
  wakatime: {
    totalMinutes: number
    languages: Array<{ name: string; minutes: number }>
  }
  hourlyPulse: number[]
}

export interface TodayActivity {
  commits: number
  pullRequests: number
  codingMinutes: number
  repositories: string[]
  languages: Record<string, number>
}
