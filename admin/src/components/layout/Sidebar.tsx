"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, HeartPulse, Cpu, Settings, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "User Management", href: "/customers", icon: Users },
    { label: "System Health", href: "/services", icon: HeartPulse },
    { label: "API Usage", href: "/analytics", icon: Cpu },
    { label: "Settings", href: "/settings", icon: Settings },
  ]

  const handleSignOut = () => {
    router.push("/login")
  }

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, fixed left on md screens) */}
      <aside className="md:flex hidden fixed top-0 left-0 bottom-0 w-[240px] bg-bg-surface border-r border-border flex-col justify-between z-30">
        <div>
          {/* Logo / Brand Name */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <Link href="/" className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xl text-text-primary tracking-tight">DevPost</span>
              <span className="font-display font-bold text-sm bg-brand/10 border border-brand/20 text-brand px-1.5 py-0.5 rounded">Admin</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-2",
                    isActive
                      ? "border-brand text-brand bg-brand/10"
                      : "border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Pinned Admin Details & Sign Out */}
        <div className="p-4 border-t border-border bg-bg-base/30 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <Avatar className="h-9 w-9 bg-brand/20 border border-brand/30">
              <AvatarFallback className="text-sm font-semibold text-brand font-mono">AD</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">Super Admin</p>
              <p className="text-[10px] text-text-muted font-mono truncate">admin@devpost.app</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-danger hover:text-danger-muted hover:bg-danger/10 rounded-md transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (visible only on mobile, fixed bottom) */}
      <nav className="md:hidden flex fixed bottom-0 left-0 right-0 h-16 bg-bg-surface border-t border-border justify-around items-center px-2 z-30">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-2 rounded-md transition-all duration-200",
                isActive
                  ? "text-brand"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[9px] font-medium text-center leading-none">{item.label.split(" ")[0]}</span>
            </Link>
          )
        })}

        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-1 py-1 px-2 text-text-secondary hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-[9px] font-medium leading-none">Exit</span>
        </button>
      </nav>
    </>
  )
}
