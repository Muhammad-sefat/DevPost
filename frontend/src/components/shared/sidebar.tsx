"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/config/nav-items";
import { useRole } from "@/hooks/use-role";
import { LayoutDashboard, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * Dashboard sidebar — collapsible navigation panel.
 * Filters visible links based on the logged-in user's role.
 * Shows only items the user has permission to access.
 */
export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <aside
        className={cn(
          "flex h-screen flex-col border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-16 items-center justify-center">
          <div className="h-5 w-5 animate-pulse rounded bg-muted" />
        </div>
      </aside>
    );
  }

  const visibleItems = navItems.filter(
    (item) => role && "allowedRoles" in item && item.allowedRoles?.includes(role),
  );

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span>Dashboard</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(isCollapsed && "mx-auto")}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center px-2",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 text-xs text-muted-foreground">
          Dashboard v1.0
        </div>
      )}
    </aside>
  );
}
