"use client"

import * as React from "react"
import { MOCK_ADMIN_STATS, MOCK_RECENT_ACTIONS } from "../data/mock-dashboard"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BarChart3, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react"

export function AdminOverviewContainer() {
  const stats = MOCK_ADMIN_STATS
  const actions = MOCK_RECENT_ACTIONS

  const getIcon = (label: string) => {
    if (label.includes("Users") || label.includes("Registered")) return <Users className="h-5 w-5" />
    if (label.includes("Active")) return <Clock className="h-5 w-5" />
    if (label.includes("API")) return <BarChart3 className="h-5 w-5" />
    return <BarChart3 className="h-5 w-5" />
  }

  const getActionBadgeColor = (type: string) => {
    switch (type) {
      case "success": return "success"
      case "error": return "destructive"
      case "warning": return "warning"
      default: return "secondary"
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <TopBar title="Admin Panel" subtitle="Welcome back! Passively monitoring DevPost metrics" />

      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto font-body">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-bg-surface border-border p-4 rounded-xl flex flex-col justify-between">
              <CardHeader className="p-0 flex flex-row justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-text-muted">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-text-primary mt-1">{stat.value}</h3>
                </div>
                <div className="p-2 bg-brand/10 border border-brand/20 text-brand rounded-lg">
                  {getIcon(stat.label)}
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4 flex items-center justify-between text-xs">
                <span className="text-text-secondary">{stat.change}</span>
                <span className={`flex items-center gap-0.5 font-semibold font-mono ${
                  stat.trend === "up" ? "text-success" : stat.trend === "down" ? "text-brand" : "text-text-muted"
                }`}>
                  {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : stat.trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
                  {stat.trend.toUpperCase()}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Row 2: Recent Activity logs ticker */}
        <Card className="bg-bg-surface border-border p-2 rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-text-primary">Recent System Activity</CardTitle>
            <CardDescription className="text-xs text-text-secondary">passive timeline logs of developer auth connection triggers and AI pipelines.</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <div className="divide-y divide-border/50">
              {actions.map((act) => (
                <div key={act.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <span className="mt-1">
                      <Badge variant={getActionBadgeColor(act.type)} className="text-[9px] uppercase font-mono tracking-wider font-semibold py-0.5 px-1.5 rounded">
                        {act.type}
                      </Badge>
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{act.user}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{act.action}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted shrink-0 text-right">{act.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
