"use client"

import * as React from "react"
import { ReduxProvider } from "@/store/provider"
import { QueryProvider } from "@/lib/query-client"
import { ToastProvider } from "@/components/ui/toast"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <ToastProvider>{children}</ToastProvider>
      </QueryProvider>
    </ReduxProvider>
  )
}
