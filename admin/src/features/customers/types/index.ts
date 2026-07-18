export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "suspended" | "inactive";
  joinedAt: string;
}
