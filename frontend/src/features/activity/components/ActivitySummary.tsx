"use client"

import * as React from "react"
import { Github, Clock } from "lucide-react"
import { MOCK_ACTIVITY } from "../data/mock-activity"
import { Card, CardContent } from "@/components/ui/card"

export function ActivitySummary() {
  const act = MOCK_ACTIVITY
  
  // Format coding time
  const hours = Math.floor(act.wakatime.totalMinutes / 60)
  const mins = act.wakatime.totalMinutes % 60
  
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
                {act.github.commits} commits today
              </h4>
              <p className="text-[10px] text-text-secondary mt-0.5 truncate max-w-[200px]">
                {act.github.repos.join(", ")}
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
                Active in VSCode
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Language Breakdown */}
        <div className="flex-1 max-w-md space-y-2">
          <p className="text-[10px] uppercase font-mono tracking-wider text-text-muted mb-2">Language Breakdown</p>
          <div className="space-y-1.5">
            {act.wakatime.languages.map((lang) => {
              const percentage = Math.round((lang.minutes / act.wakatime.totalMinutes) * 100)
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
        </div>
      </CardContent>
    </Card>
  )
}
