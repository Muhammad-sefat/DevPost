export interface MockUser {
  id: string
  name: string
  email: string
  avatar: string | null
  github: {
    connected: boolean
    username: string
  }
  wakatime: {
    connected: boolean
    apiKey?: string
  }
  createdAt: string
}

export const MOCK_USER: MockUser = {
  id: "user_1",
  name: "Raihan Ahmed",
  email: "raihan@example.com",
  avatar: null,
  github: { connected: true, username: "raihanahmed" },
  wakatime: { connected: false },
  createdAt: "2025-06-01",
}
