"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

const recentActivity: Activity[] = [
  { id: "1", user: "John Doe", action: "Created", target: "New Post", time: "2 min ago" },
  { id: "2", user: "Jane Smith", action: "Updated", target: "Profile Settings", time: "15 min ago" },
  { id: "3", user: "Bob Johnson", action: "Deleted", target: "Old Comment", time: "1 hour ago" },
  { id: "4", user: "Alice Williams", action: "Created", target: "New User Account", time: "3 hours ago" },
  { id: "5", user: "Charlie Brown", action: "Updated", target: "Service Config", time: "5 hours ago" },
];

/**
 * RecentActivity — shows a table of the latest actions across the system.
 * Wire up with TanStack Query and real API data when available.
 */
export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.user}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.target}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {activity.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
