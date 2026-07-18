import {
  LayoutDashboard,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: string[];
}

export const navItems: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["USER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    label: "User Settings",
    href: "/dashboard/user-settings",
    icon: Settings,
    allowedRoles: ["USER"],
  },
  {
    label: "Admin Panel",
    href: "/dashboard/admin-panel",
    icon: Users,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },
];
