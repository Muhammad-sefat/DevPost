import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div
      role="status"
      className={cn(
        "animate-spin rounded-full border-t-brand border-r-transparent border-b-transparent border-l-transparent",
        sizeClasses[size],
        className
      )}
      style={{ borderColor: "var(--color-brand) transparent transparent transparent" }}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
