"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl bg-bg-surface/30 min-h-[300px]">
      <div className="p-3 bg-bg-elevated rounded-full border border-border text-brand mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-text-primary font-display mb-1">{title}</h3>
      <p className="text-xs text-text-secondary max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold px-4 py-2 h-auto rounded-lg">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
