export interface DashboardStats {
  totalUsers: number;
  activeServices: number;
  totalPosts: number;
  revenue: number;
  userGrowth: number;
  serviceGrowth: number;
  postGrowth: number;
  revenueGrowth: number;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}
