"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "warning" | "error" | "info"

export interface ToastItem {
  id: string
  title: string
  description?: string
  type?: ToastType
}

interface ToastContextType {
  toasts: ToastItem[]
  toast: (options: Omit<ToastItem, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const toast = React.useCallback(({ title, description, type = "info" }: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, type }])
    setTimeout(() => {
      dismiss(id)
    }, 4000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "p-4 rounded-lg shadow-lg border text-sm pointer-events-auto flex justify-between items-start gap-4 transition-all duration-300 animate-slide-in",
              t.type === "success" && "bg-bg-surface border-success/30 text-text-primary",
              t.type === "warning" && "bg-bg-surface border-warning/30 text-text-primary",
              t.type === "error" && "bg-bg-surface border-danger/30 text-text-primary",
              t.type === "info" && "bg-bg-surface border-border text-text-primary"
            )}
          >
            <div>
              <div className="font-semibold flex items-center gap-2">
                {t.type === "success" && <span className="h-2 w-2 rounded-full bg-success" />}
                {t.type === "warning" && <span className="h-2 w-2 rounded-full bg-warning" />}
                {t.type === "error" && <span className="h-2 w-2 rounded-full bg-danger" />}
                {t.type === "info" && <span className="h-2 w-2 rounded-full bg-brand" />}
                {t.title}
              </div>
              {t.description && <div className="text-xs text-text-secondary mt-1">{t.description}</div>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-text-muted hover:text-text-secondary text-xs font-mono"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
