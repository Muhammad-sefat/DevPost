"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname()

  if (pathname === "/welcome") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial brand glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand/8 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="w-full flex justify-center relative z-10">
        {children}
      </div>
    </div>
  )
}
