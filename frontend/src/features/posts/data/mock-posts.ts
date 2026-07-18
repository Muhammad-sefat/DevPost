export interface MockPostIdea {
  id: string
  text: string
  tags: string[]
  selected: boolean
  posted: boolean
}

export interface MockHistoryPost {
  id: string
  text: string
  tags: string[]
  date: string
  status: "posted" | "skipped" | "suggested"
}

export interface MockMonthlyDay {
  day: number
  status: "posted" | "skipped" | "none" | "future"
}

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

export const MOCK_HISTORY: MockHistoryPost[] = [
  { id: "h1", text: "Shipped my first REST API with Express and PostgreSQL today. Here's what I wish I knew before starting...", tags: ["Backend", "Node.js"], date: "2025-06-10", status: "posted" },
  { id: "h2", text: "Docker finally clicked for me. Here's the mental model that made it all make sense...", tags: ["Docker", "DevOps"], date: "2025-06-09", status: "posted" },
  { id: "h3", text: "Spent the morning on system design. Here's how I think about designing APIs that can scale...", tags: ["SystemDesign"], date: "2025-06-08", status: "skipped" },
  { id: "h4", text: "TypeScript utility types are one of the most underrated features. Here are 5 I use every week...", tags: ["TypeScript"], date: "2025-06-07", status: "posted" },
  { id: "h5", text: "Tried Go (Golang) for the first time today. Coming from TypeScript, here's what immediately stood out...", tags: ["Go", "Learning"], date: "2025-06-06", status: "posted" },
  { id: "h6", text: "React Server Components finally make sense to me. Here's how I explain them to myself...", tags: ["React", "Next.js"], date: "2025-06-05", status: "posted" },
  { id: "h7", text: "Set up Prisma with PostgreSQL from scratch today. Here's the exact step-by-step I followed...", tags: ["Prisma", "SQL"], date: "2025-06-04", status: "skipped" },
  { id: "h8", text: "What I learned after 30 days of posting consistently on LinkedIn as a developer...", tags: ["Career", "LinkedIn"], date: "2025-06-03", status: "posted" },
  { id: "h9", text: "Built a RAG pipeline for the first time using Qdrant and Claude API. Here's how it works...", tags: ["AI", "RAG"], date: "2025-06-02", status: "posted" },
  { id: "h10", text: "Redux Toolkit vs Zustand — I finally tried both on real projects. Here's my honest take...", tags: ["React", "State"], date: "2025-06-01", status: "posted" },
  { id: "h11", text: "n8n is the most underrated tool for developers who want to automate without writing boilerplate...", tags: ["Automation", "n8n"], date: "2025-05-30", status: "posted" },
  { id: "h12", text: "How I structure my Next.js projects for scale — the folder structure I always come back to.", tags: ["Next.js", "Architecture"], date: "2025-05-29", status: "posted" },
]

export const MOCK_MONTHLY: MockMonthlyDay[] = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  status: i >= 14 ? "future" : i % 4 === 0 ? "skipped" : i % 7 === 0 ? "none" : "posted",
}))
