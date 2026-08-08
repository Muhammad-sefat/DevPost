"use client"

import * as React from "react"
import { Github, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { TodayActivity } from "../types"

interface ActivitySummaryProps {
  activity: TodayActivity | null
  loading: boolean
}

export function ActivitySummary({ activity, loading }: ActivitySummaryProps) {
  if (loading) {
    return (
      <Card className="bg-bg-surface border-border p-5 rounded-xl shadow-lg animate-pulse">
        <CardContent className="p-0 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          {/* Left Side: Stats Skeletons */}
          <div className="flex flex-col sm:flex-row md:gap-8 gap-5 shrink-0">
            {/* Github Stat Skeleton */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-bg-elevated rounded-lg shrink-0" />
              <div className="space-y-2">
                <div className="h-2.5 w-16 bg-bg-elevated rounded" />
                <div className="h-4 w-28 bg-bg-elevated rounded" />
                <div className="h-2 w-20 bg-bg-elevated rounded" />
              </div>
            </div>
            {/* Wakatime Stat Skeleton */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-bg-elevated rounded-lg shrink-0" />
              <div className="space-y-2">
                <div className="h-2.5 w-20 bg-bg-elevated rounded" />
                <div className="h-4 w-24 bg-bg-elevated rounded" />
                <div className="h-2 w-16 bg-bg-elevated rounded" />
              </div>
            </div>
          </div>

          {/* Right Side: Language Breakdown Skeleton */}
          <div className="flex-1 max-w-md space-y-3">
            <div className="h-2.5 w-32 bg-bg-elevated rounded" />
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-2 w-16 bg-bg-elevated rounded" />
                  <div className="h-2 w-12 bg-bg-elevated rounded" />
                </div>
                <div className="h-1.5 w-full bg-bg-elevated rounded-full" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-2 w-12 bg-bg-elevated rounded" />
                  <div className="h-2 w-10 bg-bg-elevated rounded" />
                </div>
                <div className="h-1.5 w-full bg-bg-elevated rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const commits = activity?.commits ?? 0
  const codingMinutes = activity?.codingMinutes ?? 0
  const repositories = activity?.repositories ?? []
  const languages = activity?.languages ?? {}

  // Format coding time
  const hours = Math.floor(codingMinutes / 60)
  const mins = codingMinutes % 60

  const langList = Object.entries(languages)
    .map(([name, minutes]) => ({ name, minutes }))
    .sort((a, b) => b.minutes - a.minutes)

  return (
    <Card className="bg-bg-surface border-border p-5 rounded-xl shadow-lg">
      <CardContent className="p-0 flex flex-col md:flex-row gap-6 md:items-center justify-between">
        {/* Left Side: Stats */}
        <div className="flex flex-col sm:flex-row md:gap-8 gap-5 shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand/10 border border-brand/20 text-brand rounded-lg">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-text-muted">GitHub Sync</p>
              <h4 className="text-sm font-semibold text-text-primary mt-0.5">
                {commits} {commits === 1 ? "commit" : "commits"} today
              </h4>
              <p className="text-[10px] text-text-secondary mt-0.5 truncate max-w-[200px]" title={repositories.join(", ")}>
                {repositories.length > 0 ? repositories.join(", ") : "No commits pushed today"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand/10 border border-brand/20 text-brand rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-text-muted">WakaTime Coding</p>
              <h4 className="text-sm font-semibold text-text-primary mt-0.5">
                {hours}h {mins}m today
              </h4>
              <p className="text-[10px] text-text-secondary mt-0.5">
                {codingMinutes > 0 ? "Active developer session" : "No active code time recorded"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Language Breakdown */}
        <div className="flex-1 max-w-md space-y-2">
          <p className="text-[10px] uppercase font-mono tracking-wider text-text-muted mb-2">Language Breakdown</p>
          {langList.length > 0 ? (
            <div className="space-y-1.5">
              {langList.map((lang) => {
                const percentage = codingMinutes > 0 ? Math.round((lang.minutes / codingMinutes) * 100) : 0
                const langHours = Math.floor(lang.minutes / 60)
                const langMins = lang.minutes % 60

                return (
                  <div key={lang.name} className="space-y-0.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-semibold text-text-primary font-mono">{lang.name}</span>
                      <span className="text-text-secondary font-mono">
                        {langHours > 0 ? `${langHours}h ` : ""}{langMins}m ({percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden">
                      <div
                        className="bg-brand h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center border border-dashed border-border rounded-lg py-5 px-4 bg-bg-input/20">
              <p className="text-[10px] text-text-muted text-center font-mono">
                No active language data detected for today
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
