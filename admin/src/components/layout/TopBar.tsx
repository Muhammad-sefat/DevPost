"use client"

import * as React from "react"

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [currentDate, setCurrentDate] = React.useState("")

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
        <div className="md:hidden flex items-center gap-1.5 mr-4">
          <span className="font-display font-bold text-base text-text-primary tracking-tight">DevPost</span>
          <span className="font-display font-bold text-[10px] bg-brand/10 border border-brand/20 text-brand px-1.5 py-0.2 rounded">Admin</span>
        </div>
        <div>
          <h1 className="text-base font-semibold text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-text-secondary md:block hidden mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {currentDate && (
          <span className="text-xs font-mono text-text-secondary bg-bg-elevated px-2.5 py-1 rounded border border-border">
            {currentDate}
          </span>
        )}
      </div>
    </header>
  )
}
