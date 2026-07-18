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

export const MOCK_ACTIVITY: MockActivity = {
  date: "2025-06-14",
  github: { commits: 4, repos: ["devpost", "portfolio"], prs: 0 },
  wakatime: {
    totalMinutes: 402,
    languages: [
      { name: "TypeScript", minutes: 240 },
      { name: "CSS", minutes: 60 },
      { name: "SQL", minutes: 42 },
      { name: "JSON", minutes: 60 },
    ],
  },
  hourlyPulse: [0, 0, 0, 0, 0, 0, 0, 2, 5, 8, 12, 15, 10, 6, 14, 18, 20, 16, 8, 4, 0, 0, 0, 0],
}
