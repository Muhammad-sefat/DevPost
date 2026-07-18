export interface MockCustomer {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  status: "active" | "suspended"
  connections: {
    github: boolean
    wakatime: boolean
  }
  joinedDate: string
}

export const MOCK_CUSTOMERS: MockCustomer[] = [
  {
    id: "user_1",
    name: "Raihan Ahmed",
    email: "raihan@example.com",
    role: "USER",
    status: "active",
    connections: { github: true, wakatime: false },
    joinedDate: "2025-06-01"
  },
  {
    id: "user_2",
    name: "John Doe",
    email: "john@example.com",
    role: "USER",
    status: "suspended",
    connections: { github: true, wakatime: true },
    joinedDate: "2025-05-15"
  },
  {
    id: "user_3",
    name: "Sara Connor",
    email: "sara@example.com",
    role: "USER",
    status: "active",
    connections: { github: false, wakatime: true },
    joinedDate: "2025-06-12"
  },
  {
    id: "user_4",
    name: "Alice Liddell",
    email: "alice@example.com",
    role: "ADMIN",
    status: "active",
    connections: { github: true, wakatime: true },
    joinedDate: "2025-04-10"
  }
]
