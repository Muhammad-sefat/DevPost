"use client";

import { useRole } from "@/hooks/use-role";

export function Overview() {
  const { role, changeRole } = useRole();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500">
            Current Role: <span className="font-semibold text-primary">{role}</span>
          </p>
        </div>
        
        {/* Role Selector widget */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500">Switch Role:</label>
          <select
            value={role || "USER"}
            onChange={(e) => changeRole(e.target.value)}
            className="rounded border bg-white px-2 py-1 text-sm font-medium text-primary cursor-pointer focus:outline-none"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-bold text-primary mb-2">Role Specific Content</h2>
        {role === "USER" && (
          <p className="text-sm text-gray-600">Welcome User! You are viewing the User Dashboard. You can access User Settings in the sidebar.</p>
        )}
        {role === "ADMIN" && (
          <p className="text-sm text-gray-600">Welcome Admin! You are viewing the Admin Dashboard. You have access to the Admin Panel.</p>
        )}
        {role === "SUPER_ADMIN" && (
          <p className="text-sm text-gray-600">Welcome Super Admin! You have full root privileges on this dashboard.</p>
        )}
      </div>
    </div>
  );
}
