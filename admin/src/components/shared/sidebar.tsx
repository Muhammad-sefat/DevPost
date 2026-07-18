"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/config/nav-items";
import { ChevronLeft, UserRoundCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-secondary/10 bg-primary text-secondary transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <UserRoundCog className="h-6 w-6 text-secondary" />
            <span>Super Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "text-secondary hover:bg-secondary/10",
            isCollapsed && "mx-auto",
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
        </Button>
      </div>

      <Separator className="bg-secondary/10" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-primary"
                  : "text-secondary/80 hover:bg-secondary hover:text-primary",
                isCollapsed && "justify-center px-2",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
              {!isCollapsed && item.badge !== undefined && (
                <span className="ml-auto rounded-full bg-secondary text-primary px-2 py-0.5 text-xs font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 text-xs text-secondary/60">
          Admin Panel v1.0
        </div>
      )}
    </aside>
  );
}
