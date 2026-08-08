export interface MockHistoryPost {
  id: string
  text: string
  tags: string[]
  date: string
  status: "posted" | "skipped" | "suggested"
}
