"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, DollarSign } from "lucide-react";

interface StatCardData {
  title: string;
  value: string;
  description: string;
  icon: typeof Users;
}

const stats: StatCardData[] = [
  {
    title: "Total Users",
    value: "1,234",
    description: "+12% from last month",
    icon: Users,
  },
  {
    title: "Active Posts",
    value: "456",
    description: "23 new this week",
    icon: FileText,
  },
  {
    title: "Page Views",
    value: "89.2K",
    description: "+8% from last month",
    icon: Activity,
  },
  {
    title: "Revenue",
    value: "$45,678",
    description: "+18% from last month",
    icon: DollarSign,
  },
];

/**
 * StatsCards — shows 4 key metrics in a responsive grid.
 * Each card has an icon, value, and trend description.
 * Replace hardcoded values with useDashboardStats() when API is ready.
 */
export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
