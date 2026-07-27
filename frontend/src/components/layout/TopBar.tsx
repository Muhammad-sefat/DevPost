"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User as UserIcon, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const router = useRouter()
  const { user, isAuthenticated, logout, fetchCurrentUser } = useAuth()
  const [currentDate, setCurrentDate] = React.useState("")

  React.useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  React.useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const d = new Date()
    setCurrentDate(`${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`)
  }, [])

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-bg-surface/50 backdrop-blur-md sticky top-0 z-20 w-full">
      <div className="flex items-center gap-3">
        <div className="md:hidden block">
          <Link href="/" className="font-display font-bold text-lg text-brand tracking-tight mr-4">DevPost</Link>
        </div>
        <div>
          <h1 className="text-base font-semibold text-text-primary flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-text-secondary md:block hidden mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {currentDate && (
          <span className="text-xs font-mono text-text-secondary bg-bg-elevated px-2.5 py-1 rounded border border-border hidden sm:inline-block">
            {currentDate}
          </span>
        )}
        {isAuthenticated && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border p-0 cursor-pointer hover:bg-bg-elevated">
                <Avatar className="h-8 w-8">
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                  <AvatarFallback className="bg-brand/20 text-brand font-semibold text-xs uppercase">
                    {user.name ? user.name.slice(0, 2) : <UserIcon className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-bg-surface border-border text-text-primary p-2 space-y-1">
              <div className="px-2 py-1.5 border-b border-border mb-1">
                <p className="text-xs font-semibold text-text-primary truncate">{user.name}</p>
                <p className="text-[10px] text-text-secondary truncate">{user.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-brand/10 text-brand rounded uppercase border border-brand/20">
                  {user.role}
                </span>
              </div>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="cursor-pointer hover:bg-bg-elevated text-xs flex items-center gap-2 px-2 py-1.5 rounded"
              >
                <Settings className="h-4 w-4 text-brand" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border my-1" />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer hover:bg-danger/20 text-danger hover:text-danger text-xs flex items-center gap-2 px-2 py-1.5 rounded"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
