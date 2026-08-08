import { MockPostIdea, MockMonthlyDay } from "../types"

export const MOCK_POST_IDEAS: MockPostIdea[] = [
  {
    id: "post_1",
    text: "Today I spent 4 hours debugging a TypeScript generic type issue that turned out to be a single missing extends keyword. Here's what I learned about conditional types and why they trip everyone up at first...",
    tags: ["TypeScript", "Debugging"],
    selected: false,
    posted: false
  },
  {
    id: "post_2",
    text: "I pushed my first PostgreSQL migration with Prisma today. Coming from a frontend background, here's what surprised me about schema design and why thinking in tables feels so different from thinking in components...",
    tags: ["Backend", "Prisma", "Learning"],
    selected: false,
    posted: false
  },
  {
    id: "post_3",
    text: "6 hours of coding and I shipped exactly 0 features. But I refactored a component that was 300 lines into 3 clean hooks. Sometimes the best day of work is the one where you delete more than you write.",
    tags: ["Refactoring", "React"],
    selected: false,
    posted: false
  },
  {
    id: "post_4",
    text: "Working on DevPost — a tool that turns your daily GitHub commits into LinkedIn content automatically. Building in public, day 3. Here's what I learned about n8n workflows this week...",
    tags: ["BuildInPublic", "SaaS"],
    selected: false,
    posted: false
  },
]

export const MOCK_MONTHLY: MockMonthlyDay[] = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  status: i >= 14 ? "future" : i % 4 === 0 ? "skipped" : i % 7 === 0 ? "none" : "posted",
}))
